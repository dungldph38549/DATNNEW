const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/UserModel.js");

dotenv.config();

// Middleware xác thực user thường hoặc admin (chỉ cần token hợp lệ)
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
        status: "Err",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { payload } = decoded;

    // Optional: Verify user still exists in database
    if (payload?.id) {
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(401).json({
          message: "User not found",
          status: "Err",
        });
      }

      // Update payload with fresh user data
      req.user = {
        ...payload,
        isAdmin: user.isAdmin || false,
        email: user.email,
      };
    } else {
      req.user = payload;
    }

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Invalid token",
        status: "Err",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        status: "Err",
      });
    }

    return res.status(500).json({
      message: "Authentication error",
      status: "Err",
    });
  }
};

// Middleware dành riêng cho admin
const authAdminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
        status: "Err",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { payload } = decoded;

    // Check if user exists and is admin
    if (payload?.id) {
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(401).json({
          message: "User not found",
          status: "Err",
        });
      }

      if (!user.isAdmin) {
        return res.status(403).json({
          message: "You are not an admin",
          status: "Err",
        });
      }

      req.user = {
        ...payload,
        isAdmin: user.isAdmin,
        email: user.email,
      };
    } else {
      // Fallback to payload data
      if (!payload?.isAdmin) {
        return res.status(403).json({
          message: "You are not an admin",
          status: "Err",
        });
      }
      req.user = payload;
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        message: "Invalid token",
        status: "Err",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        status: "Err",
      });
    }

    return res.status(500).json({
      message: "Authentication error",
      status: "Err",
    });
  }
};

// Middleware cho optional authentication (không bắt buộc token)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { payload } = decoded;

    if (payload?.id) {
      const user = await User.findById(payload.id);
      req.user = user
        ? {
            ...payload,
            isAdmin: user.isAdmin || false,
            email: user.email,
          }
        : null;
    } else {
      req.user = payload;
    }

    next();
  } catch (err) {
    // Nếu token invalid, vẫn cho phép truy cập nhưng user = null
    req.user = null;
    next();
  }
};

// Middleware kiểm tra owner hoặc admin
const authOwnerOrAdminMiddleware = async (req, res, next) => {
  try {
    // Đầu tiên check auth
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Nếu là admin thì cho phép tất cả
    if (req.user?.isAdmin) {
      return next();
    }

    // Nếu không phải admin, kiểm tra ownership
    const { id, orderId, userId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        message: "User ID not found in token",
        status: "Err",
      });
    }

    // Kiểm tra ownership dựa trên parameter
    if (id && id !== currentUserId.toString()) {
      return res.status(403).json({
        message: "Access denied - not resource owner",
        status: "Err",
      });
    }

    if (userId && userId !== currentUserId.toString()) {
      return res.status(403).json({
        message: "Access denied - not resource owner",
        status: "Err",
      });
    }

    // Nếu có orderId, cần kiểm tra order ownership
    if (orderId) {
      const Order = require("../models/order.js");
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
          status: "Err",
        });
      }

      if (
        order.userId &&
        order.userId.toString() !== currentUserId.toString()
      ) {
        return res.status(403).json({
          message: "Access denied - not order owner",
          status: "Err",
        });
      }
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Authorization error",
      status: "Err",
    });
  }
};

// Export với tên cũ để backward compatibility
module.exports = {
  authMiddleware,
  authAdminMiddleware,
  optionalAuthMiddleware,
  authOwnerOrAdminMiddleware,

  // Aliases cho naming convention mới (nếu cần)
  authenticateToken: authMiddleware,
  isAdmin: authAdminMiddleware,
  optionalAuth: optionalAuthMiddleware,
  isOwnerOrAdmin: authOwnerOrAdminMiddleware,
};
