const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./orderRouter");
const BrandRouter = require("./BrandRouter");
const CategoryRouter = require("./CategoryRouter");
const VoucherRouter = require("./VoucherRouter");
const ReviewRouter = require("./ReviewRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/brand", BrandRouter);
  app.use("/api/category", CategoryRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/voucher", VoucherRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/review", ReviewRouter);
};

module.exports = routes;
