// routes/staffRoutes.js - Routes quản lý nhân viên
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/StaffController.js");
const {
  authMiddleware,
  authAdminMiddleware,
} = require("../middleware/authMiddleware.js");

// =================== STAFF MANAGEMENT ROUTES ===================

// Lấy danh sách tất cả nhân viên (Admin only)
router.get("/", authAdminMiddleware, staffController.getAllStaff);

// Tạo nhân viên mới (Admin only)
router.post("/", authAdminMiddleware, staffController.createStaff);

// Lấy thống kê nhân viên (Admin only)
router.get(
  "/statistics",
  authAdminMiddleware,
  staffController.getStaffStatistics
);

// Lấy chi tiết nhân viên theo ID (Admin only)
router.get("/:id", authAdminMiddleware, staffController.getStaffById);

// Cập nhật thông tin nhân viên (Admin only)
router.put("/:id", authAdminMiddleware, staffController.updateStaff);

// Xóa nhân viên - soft delete (Admin only)
router.delete("/:id", authAdminMiddleware, staffController.deleteStaff);

module.exports = router;
