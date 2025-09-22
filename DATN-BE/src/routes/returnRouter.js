// routes/returnRouter.js - Routes sử dụng ReturnController riêng
const express = require("express");
const router = express.Router();
const returnController = require("../controllers/ReturnController.js");
const orderController = require("../controllers/OrderController.js"); // Cho các method cũ
const {
  authMiddleware,
  authAdminMiddleware,
  optionalAuthMiddleware,
  authOwnerOrAdminMiddleware,
} = require("../middleware/authMiddleware.js");

// =================== PUBLIC RETURN ROUTES ===================

// Lấy danh sách lý do hoàn hàng (Public - không cần auth)
router.get("/reasons", returnController.getReturnReasons);

// =================== USER RETURN ROUTES ===================

// Kiểm tra điều kiện hoàn hàng
router.get(
  "/check-eligibility/:orderId",
  authMiddleware,
  returnController.checkReturnEligibility
);

// Xem danh sách yêu cầu hoàn hàng của user
router.get(
  "/my-requests",
  authMiddleware,
  returnController.getMyReturnRequests
);

// Cập nhật thông tin gửi hàng hoàn trả (chỉ owner hoặc admin)
router.put(
  "/shipping/:orderId",
  authOwnerOrAdminMiddleware,
  returnController.updateReturnShipping
);

// Hủy yêu cầu hoàn hàng (chỉ owner hoặc admin)
router.delete(
  "/cancel/:orderId",
  authOwnerOrAdminMiddleware,
  returnController.cancelReturnRequest
);

// Xem chi tiết yêu cầu hoàn hàng (owner hoặc admin)
router.get(
  "/detail/:orderId",
  authOwnerOrAdminMiddleware,
  returnController.getReturnRequestDetail
);

// =================== EXISTING ROUTES (Compatibility) ===================

// Tạo yêu cầu hoàn hàng (sử dụng OrderController cũ)
router.post("/request", authMiddleware, orderController.returnOrderRequest);

// =================== ADMIN RETURN ROUTES ===================

// Lấy tất cả yêu cầu hoàn hàng với filter (Admin only)
router.get(
  "/admin/all-requests",
  authAdminMiddleware,
  returnController.getAllReturnRequests
);

// Xử lý yêu cầu hoàn hàng (compatibility với code cũ)
router.post(
  "/admin/process",
  authAdminMiddleware,
  orderController.acceptOrRejectReturn
);

// Xác nhận đã nhận hàng hoàn trả (Admin only)
router.post(
  "/admin/confirm-received/:orderId",
  authAdminMiddleware,
  returnController.confirmReturnReceived
);

// Thống kê hoàn hàng (Admin only)
router.get(
  "/admin/statistics",
  authAdminMiddleware,
  returnController.getReturnStatistics
);

// Chi tiết yêu cầu hoàn hàng - Admin view (Admin only)
router.get(
  "/admin/detail/:orderId",
  authAdminMiddleware,
  returnController.getReturnRequestDetail
);

// Bulk operations cho admin (Admin only)
router.post(
  "/admin/bulk-process",
  authAdminMiddleware,
  returnController.bulkProcessReturns
);

// Danh sách đơn hoàn hàng (compatibility với code cũ)
router.get("/admin/list", authAdminMiddleware, orderController.orderReturn);

module.exports = router;
