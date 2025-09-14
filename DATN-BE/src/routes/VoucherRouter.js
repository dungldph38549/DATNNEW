// src/routes/ProductRouter.js
const express = require("express");
const router = express.Router();
const VoucherController = require("../controllers/VoucherController");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

router.post("/admin/create", authAdminMiddleware, VoucherController.create);
router.put("/admin/update", authAdminMiddleware, VoucherController.update);
router.delete("/admin/delete", authAdminMiddleware, VoucherController.delete);
router.get("/admin/list", authAdminMiddleware, VoucherController.getAll);
router.get("/list", VoucherController.getActiveVouchers);
router.get("/detail/:id", VoucherController.detail);

module.exports = router;