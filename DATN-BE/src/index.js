const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Import routes
const routes = require("./routes");
const orderRoutes = require("./routes/orderRoutes");
const walletRoutes = require("./routes/walletRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ==== SECURITY MIDDLEWARE ====
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.",
  },
});
app.use("/api/", limiter);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Không được phép bởi CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  })
);

// ==== BODY PARSING MIDDLEWARE ====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json());
app.use(compression());

// ==== TRUST PROXY ====
app.set("trust proxy", 1);

// ==== REQUEST LOGGING ====
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${
      req.ip
    }`
  );
  next();
});

// ==== FILE UPLOAD CONFIGURATION ====
// Thư mục lưu trữ ảnh upload
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF, WEBP)"));
    }
  },
});

// Cho phép truy cập thư mục public
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ==== HEALTH CHECK ====
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ==== UPLOAD ROUTES ====
// Upload 1 ảnh
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được tải lên" });
    }
    const filePath = `${req.file.filename}`;
    res.status(200).json({
      message: "Tải lên thành công",
      path: filePath,
      url: `${req.protocol}://${req.get("host")}/uploads/${filePath}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload nhiều ảnh
app.post("/api/uploads/multiple", upload.array("files", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Không có ảnh nào được tải lên" });
    }
    const filePaths = req.files.map((file) => ({
      filename: file.filename,
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    }));
    res.status(200).json({
      message: "Tải lên thành công",
      files: filePaths,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get image
app.get("/api/image/:filename", (req, res) => {
  const { filename } = req.params;
  if (!filename) {
    return res.status(400).json({ message: "Thiếu tên file" });
  }

  const filePath = path.join(__dirname, "../public/uploads", filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }
    res.sendFile(filePath);
  });
});

// ==== API ROUTES ====
// Authentication routes
if (authRoutes) {
  app.use("/api/auth", authRoutes);
}

// User routes
if (userRoutes) {
  app.use("/api/users", userRoutes);
}

// Product routes
if (productRoutes) {
  app.use("/api/products", productRoutes);
}

// Order routes (with return management)
if (orderRoutes) {
  app.use("/api/orders", orderRoutes);
}

// Wallet routes
if (walletRoutes) {
  app.use("/api/wallet", walletRoutes);
}

// Legacy routes (if exists)
if (routes && typeof routes === "function") {
  routes(app);
}

// ==== API DOCUMENTATION ====
app.get("/api", (req, res) => {
  res.json({
    message: "E-commerce API with Return Management & Wallet System",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      orders: "/api/orders",
      wallet: "/api/wallet",
      upload: "/api/upload",
    },
    features: [
      "User Authentication & Authorization",
      "Product Management",
      "Order Management with Return Flow",
      "User Wallet System",
      "VNPay Payment Integration",
      "Admin Dashboard Analytics",
      "Return Request Management",
      "Refund Processing",
      "File Upload System",
    ],
  });
});

// ==== DATABASE CONNECTION ====
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công");
  })
  .catch((error) => {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1);
  });

// ==== ERROR HANDLING MIDDLEWARE ====
// Multer error handler
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File quá lớn (tối đa 10MB)" });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Quá nhiều file (tối đa 10 file)" });
    }
  }
  next(error);
});

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Không tìm thấy endpoint",
    message: `Route ${req.originalUrl} không tồn tại`,
    availableRoutes: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      orders: "/api/orders",
      wallet: "/api/wallet",
      upload: "/api/upload",
    },
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error("❌ Global Error:", error);

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      error: "Duplicate Entry",
      message: `${field} đã tồn tại trong hệ thống`,
    });
  }

  // MongoDB validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      error: "Validation Error",
      message: "Dữ liệu không hợp lệ",
      details: errors,
    });
  }

  // MongoDB CastError
  if (error.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID",
      message: "ID không hợp lệ",
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid Token",
      message: "Token không hợp lệ",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token Expired",
      message: "Token đã hết hạn",
    });
  }

  // CORS error
  if (error.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: "Yêu cầu bị chặn bởi CORS policy",
    });
  }

  // Default server error
  res.status(error.status || 500).json({
    error: error.name || "Internal Server Error",
    message: error.message || "Đã xảy ra lỗi không mong muốn",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// ==== GRACEFUL SHUTDOWN ====
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Nhận tín hiệu ${signal}, đang tắt server...`);

  mongoose.connection.close(() => {
    console.log("🔌 Đã đóng kết nối MongoDB");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ==== PROCESS ERROR HANDLING ====
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// ==== SERVER START ====
app.listen(port, () => {
  console.log(`
🚀 Server đang chạy trên port ${port}
🌍 Environment: ${process.env.NODE_ENV || "development"}
📊 API Documentation: http://localhost:${port}/api
💊 Health Check: http://localhost:${port}/health
🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}
📁 Upload Directory: ${uploadDir}
  `);
});

module.exports = app;
