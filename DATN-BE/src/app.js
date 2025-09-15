// app.js - Main application file with all integrations

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

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
app.use(compression());

// ==== REQUEST LOGGING ====
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${
      req.ip
    }`
  );
  next();
});

// ==== TRUST PROXY ====
app.set("trust proxy", 1);

// ==== DATABASE CONNECTION ====
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce", {
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

// ==== ROUTES IMPORT ====
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const walletRoutes = require("./routes/walletRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// ==== HEALTH CHECK ====
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ==== API ROUTES ====
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/upload", uploadRoutes);

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
      vouchers: "/api/vouchers",
      categories: "/api/categories",
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
    ],
  });
});

// ==== ERROR HANDLING MIDDLEWARE ====
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
      vouchers: "/api/vouchers",
      categories: "/api/categories",
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
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server đang chạy trên port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || "development"}
📊 API Documentation: http://localhost:${PORT}/api
💊 Health Check: http://localhost:${PORT}/health
🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}
  `);
});

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} đã được sử dụng`);
  } else {
    console.error("❌ Server error:", error);
  }
  process.exit(1);
});

module.exports = app;
