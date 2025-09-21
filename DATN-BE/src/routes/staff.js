const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const staffController = require("../controllers/staffController");
const { authenticateToken, requireRole } = require("../middleware/auth");

// Validation rules
const createStaffValidation = [
  body("name").notEmpty().withMessage("Tên là bắt buộc"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("role")
    .isIn(["staff", "manager", "admin"])
    .withMessage("Vai trò không hợp lệ"),
];

// Apply authentication to all routes
router.use(authenticateToken);

// Staff CRUD routes
router.get("/", requireRole(["admin", "manager"]), staffController.getAllStaff);
router.get("/stats", requireRole(["admin"]), staffController.getStaffStats);
router.get(
  "/:id",
  requireRole(["admin", "manager"]),
  staffController.getStaffById
);
router.post(
  "/",
  requireRole(["admin"]),
  createStaffValidation,
  staffController.createStaff
);
router.put(
  "/:id",
  requireRole(["admin", "manager"]),
  staffController.updateStaff
);
router.delete("/:id", requireRole(["admin"]), staffController.deleteStaff);

// Attendance routes
router.post(
  "/:staffId/attendance",
  requireRole(["admin", "manager"]),
  staffController.recordAttendance
);

// Salary routes
router.post(
  "/:staffId/salary",
  requireRole(["admin"]),
  staffController.updateSalary
);

module.exports = router;

// ================== Frontend API Integration (api/index.js) ==================

// Add these functions to your existing api/index.js

// ================== Staff Management ==================
export const getAllStaff = async (params) => {
  const res = await axiosInstance.get("/staff", { params });
  return res.data;
};

export const getStaffById = async (id) => {
  const res = await axiosInstance.get(`/staff/${id}`);
  return res.data;
};

export const createStaff = async (payload) => {
  const res = await axiosInstance.post("/staff", payload);
  return res.data;
};

export const updateStaff = async (id, payload) => {
  const res = await axiosInstance.put(`/staff/${id}`, payload);
  return res.data;
};

export const deleteStaff = async (id) => {
  const res = await axiosInstance.delete(`/staff/${id}`);
  return res.data;
};

export const getStaffStats = async () => {
  const res = await axiosInstance.get("/staff/stats");
  return res.data;
};

export const recordAttendance = async (staffId, payload) => {
  const res = await axiosInstance.post(`/staff/${staffId}/attendance`, payload);
  return res.data;
};

export const updateStaffSalary = async (staffId, payload) => {
  const res = await axiosInstance.post(`/staff/${staffId}/salary`, payload);
  return res.data;
};
