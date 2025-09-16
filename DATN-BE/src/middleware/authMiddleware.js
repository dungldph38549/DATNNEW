// middlewares/auth.js - Authentication middlewares

const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Token truy cập bị thiếu" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user info from database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Token không hợp lệ - người dùng không tồn tại" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Tài khoản đã bị vô hiệu hóa" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
    return res.status(500).json({ message: "Lỗi xác thực token" });
  }
};

// Optional authentication - doesn't throw error if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      // No token provided, continue without user
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // Token invalid but continue without user
    req.user = null;
    next();
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yêu cầu đăng nhập" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Yêu cầu quyền quản trị viên" });
  }

  next();
};

// Check if user is owner or admin
const isUserOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yêu cầu đăng nhập" });
  }

  const { userId } = req.params;
  const requestingUserId = req.user._id.toString();
  const isAdminUser = req.user.isAdmin;

  if (isAdminUser || requestingUserId === userId) {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
};

// Check if user owns the resource or is admin
const checkResourceOwnership = (resourceUserIdField = "userId") => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Yêu cầu đăng nhập" });
    }

    try {
      // For different resource types, you might need different models
      let resource;
      const resourceId = req.params.id;

      // Determine model based on route
      if (req.baseUrl.includes("/orders")) {
        const Order = require("../models/order");
        resource = await Order.findById(resourceId);
      } else if (req.baseUrl.includes("/wallet")) {
        const UserWallet = require("../models/userWallet");
        resource = await UserWallet.findById(resourceId);
      }

      if (!resource) {
        return res.status(404).json({ message: "Tài nguyên không tồn tại" });
      }

      const resourceUserId = resource[resourceUserIdField];
      const requestingUserId = req.user._id.toString();
      const isAdminUser = req.user.isAdmin;

      if (
        isAdminUser ||
        (resourceUserId && resourceUserId.toString() === requestingUserId)
      ) {
        req.resource = resource; // Attach resource to request for later use
        next();
      } else {
        return res
          .status(403)
          .json({ message: "Không có quyền truy cập tài nguyên này" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Lỗi kiểm tra quyền truy cập" });
    }
  };
};

// Rate limiting middleware
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const identifier = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();

    if (!requests.has(identifier)) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const requestData = requests.get(identifier);

    if (now > requestData.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (requestData.count >= maxRequests) {
      return res.status(429).json({
        message: "Quá nhiều yêu cầu, vui lòng thử lại sau",
        retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
      });
    }

    requestData.count++;
    next();
  };
};

// Validate API key for external integrations
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key bị thiếu" });
  }

  // Check if API key is valid (you should store these securely)
  const validApiKeys = process.env.VALID_API_KEYS
    ? process.env.VALID_API_KEYS.split(",")
    : [];

  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({ message: "API key không hợp lệ" });
  }

  next();
};

// Log user actions for audit trail
const auditLogger = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
      // Log the action
      console.log({
        timestamp: new Date().toISOString(),
        userId: req.user ? req.user._id : null,
        userEmail: req.user ? req.user.email : null,
        action: action,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        statusCode: res.statusCode,
        responseTime: Date.now() - req.startTime,
      });

      originalSend.call(this, data);
    };

    req.startTime = Date.now();
    next();
  };
};

// Validate request body
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        details: error.details.map((detail) => detail.message),
      });
    }
    next();
  };
};

// Check user status
const checkUserStatus = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yêu cầu đăng nhập" });
  }

  if (!req.user.isActive) {
    return res.status(403).json({ message: "Tài khoản đã bị vô hiệu hóa" });
  }

  if (req.user.isBlocked) {
    return res.status(403).json({ message: "Tài khoản đã bị chặn" });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  isAdmin,
  isUserOrAdmin,
  checkResourceOwnership,
  rateLimiter,
  validateApiKey,
  auditLogger,
  validateBody,
  checkUserStatus,
};
