// routes/index.js - Updated để tích hợp với cấu trúc hiện có
const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./orderRouter");
const BrandRouter = require("./BrandRouter");
const CategoryRouter = require("./CategoryRouter");
const VoucherRouter = require("./VoucherRouter");
const ReviewRouter = require("./ReviewRouter");
const StaffRouter = require("./staffRoutes");

// Import routes mới cho return system
const ReturnRouter = require("./returnRouter");

const routes = (app) => {
  // Existing routes (unchanged)
  app.use("/api/user", UserRouter);
  app.use("/api/brand", BrandRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/voucher", VoucherRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/review", ReviewRouter);

  // New return routes
  app.use("/api/order/return", ReturnRouter);

  app.use("/api/staff", StaffRouter);

  // Health check và documentation
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      message: "API is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/docs", (req, res) => {
    res.json({
      message: "API Documentation",
      version: "1.0.0",
      endpoints: {
        user: "/api/user/*",
        brand: "/api/brand/*",
        category: "/api/category/*",
        product: "/api/product/*",
        voucher: "/api/voucher/*",
        order: "/api/order/*",
        review: "/api/review/*",
        return: "/api/order/return/*", // New
      },
      utilities: {
        health: "/api/health",
        docs: "/api/docs",
      },
    });
  });
};

module.exports = routes;
