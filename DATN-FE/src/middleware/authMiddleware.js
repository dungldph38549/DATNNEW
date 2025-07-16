const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware xác thực user thường hoặc admin (chỉ cần token hợp lệ)
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
      status: "Err",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
        status: "Err",
      });
    }

    const { payload } = decoded;
    req.user = payload; // Gắn user vào request để controller có thể sử dụng
    next();
  });
};

// Middleware dành riêng cho admin
const authAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
      status: "Err",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
        status: "Err",
      });
    }

    const { payload } = decoded;

    if (payload?.isAdmin) {
      req.user = payload;
      next();
    } else {
      return res.status(403).json({
        message: "You are not an admin",
        status: "Err",
      });
    }
  });
};

module.exports = {
  authMiddleware,
  authAdminMiddleware,
};
