// routes/orderRoutes.js - Complete order routes with return management

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const {
  authenticateToken,
  isAdmin,
  optionalAuth,
} = require("../middlewares/auth");

// ==== PUBLIC ROUTES ====
// Create order (for both users and guests)
router.post("/create", optionalAuth, orderController.createOrder);

// Return from VNPay payment
router.get("/return-payment", orderController.returnPayment);

// ==== USER ROUTES ====
// Get orders by user or guest
router.get("/my-orders", optionalAuth, orderController.getOrdersByUserOrGuest);

// Get single order detail (with access control)
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const order = await require("../models/order")
      .findById(req.params.id)
      .populate("userId")
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Check access permission
    if (req.user) {
      const isOwner =
        order.userId && order.userId._id.toString() === req.user.id;
      const isAdmin = req.user.isAdmin;

      if (!isOwner && !isAdmin) {
        return res
          .status(403)
          .json({ message: "Không có quyền truy cập đơn hàng này" });
      }
    } else {
      // For guest users, they need to provide guestId in query
      if (!req.query.guestId || order.guestId !== req.query.guestId) {
        return res
          .status(403)
          .json({ message: "Không có quyền truy cập đơn hàng này" });
      }
    }

    const history = await require("../models/orderStatusHistory")
      .find({ orderId: order._id })
      .populate("processedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      order,
      history,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order by user (only pending orders)
router.patch(
  "/:id/user-update",
  authenticateToken,
  orderController.updateOrderById
);

// Confirm delivery by user
router.patch(
  "/:id/confirm-delivery",
  authenticateToken,
  orderController.comfirmDelivery
);

// Request return by user
router.post("/:id/request-return", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    const Order = require("../models/order");
    const OrderStatusHistory = require("../models/orderStatusHistory");

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Check ownership
    if (!order.userId || order.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // Check if order can be returned
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể hoàn hàng khi đơn hàng đã được giao" });
    }

    // Check 7-day return policy
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (order.updatedAt < sevenDaysAgo) {
      return res
        .status(400)
        .json({ message: "Quá hạn hoàn hàng (7 ngày sau khi giao hàng)" });
    }

    // Update order status
    order.status = "return-request";
    order.returnReason = note;
    order.returnRequestDate = new Date();
    await order.save();

    // Create status history
    await OrderStatusHistory.create({
      orderId: id,
      oldStatus: "delivered",
      newStatus: "return-request",
      note,
      returnReason: note,
      source: "customer",
      processedBy: userId,
    });

    res.status(200).json({
      message: "Yêu cầu hoàn hàng đã được gửi",
      order: {
        _id: order._id,
        status: order.status,
        returnRequestDate: order.returnRequestDate,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel order by user (only pending/confirmed orders)
router.patch("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const Order = require("../models/order");
    const OrderStatusHistory = require("../models/orderStatusHistory");

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Check ownership
    if (!order.userId || order.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Không có quyền truy cập đơn hàng này" });
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Không thể hủy đơn hàng ở trạng thái hiện tại" });
    }

    const oldStatus = order.status;
    order.status = "canceled";
    await order.save();

    // Create status history
    await OrderStatusHistory.create({
      orderId: id,
      oldStatus,
      newStatus: "canceled",
      note: reason || "Khách hàng hủy đơn",
      source: "customer",
      processedBy: userId,
    });

    res.status(200).json({
      message: "Đã hủy đơn hàng thành công",
      order: {
        _id: order._id,
        status: order.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==== ADMIN ROUTES ====
// Get all orders (admin only)
router.get(
  "/admin/all",
  authenticateToken,
  isAdmin,
  orderController.getAllOrders
);

// Get all orders without pagination (admin only)
router.get(
  "/admin/list",
  authenticateToken,
  isAdmin,
  orderController.getOrders
);

// Update order (admin only)
router.patch(
  "/admin/:id",
  authenticateToken,
  isAdmin,
  orderController.updateOrder
);

// Delete order (admin only)
router.delete(
  "/admin/:id",
  authenticateToken,
  isAdmin,
  orderController.deleteOrder
);

// ==== RETURN MANAGEMENT ROUTES ====
// Get all return requests (admin only)
router.get(
  "/admin/returns",
  authenticateToken,
  isAdmin,
  orderController.getAllReturnRequests
);

// Get specific return request detail (admin only)
router.get(
  "/admin/returns/:orderId",
  authenticateToken,
  isAdmin,
  orderController.getReturnRequest
);

// Accept or reject return request (admin only)
router.post(
  "/admin/returns/accept-reject",
  authenticateToken,
  isAdmin,
  orderController.acceptOrRejectReturn
);

// Get return statistics (admin only)
router.get(
  "/admin/returns/statistics",
  authenticateToken,
  isAdmin,
  orderController.getReturnStatistics
);

// Bulk process returns (admin only)
router.post(
  "/admin/returns/bulk-process",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { orderIds, action, note, refundAmount } = req.body;

      if (!Array.isArray(orderIds) || orderIds.length === 0) {
        return res
          .status(400)
          .json({ message: "Danh sách đơn hàng không hợp lệ" });
      }

      if (!["accepted", "rejected"].includes(action)) {
        return res.status(400).json({ message: "Hành động không hợp lệ" });
      }

      const results = [];
      const errors = [];

      for (const orderId of orderIds) {
        try {
          await orderController.acceptOrRejectReturn(
            {
              body: { id: orderId, status: action, note, refundAmount },
            },
            {
              status: () => ({ json: () => {} }),
              json: () => {},
            }
          );
          results.push({ orderId, success: true });
        } catch (error) {
          errors.push({ orderId, error: error.message });
        }
      }

      res.status(200).json({
        message: "Bulk process completed",
        successful: results.length,
        failed: errors.length,
        results,
        errors,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ==== ANALYTICS ROUTES ====
// Dashboard analytics (admin only)
router.get(
  "/admin/analytics/dashboard",
  authenticateToken,
  isAdmin,
  orderController.dashboard
);

// Revenue analytics (admin only)
router.get(
  "/admin/analytics/revenue",
  authenticateToken,
  isAdmin,
  orderController.revenue
);

// Top selling products (admin only)
router.get(
  "/admin/analytics/top-selling",
  authenticateToken,
  isAdmin,
  orderController.topSelling
);

// Payment method statistics (admin only)
router.get(
  "/admin/analytics/payment-methods",
  authenticateToken,
  isAdmin,
  orderController.paymentMethod
);

// Order status distribution (admin only)
router.get(
  "/admin/analytics/status-distribution",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate
        ? new Date(startDate)
        : new Date(new Date().getFullYear(), 0, 1);
      const end = endDate ? new Date(endDate) : new Date();

      const Order = require("../models/order");
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Monthly order trends (admin only)
router.get(
  "/admin/analytics/monthly-trends",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    try {
      const { year = new Date().getFullYear() } = req.query;

      const Order = require("../models/order");
      const result = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            month: "$_id",
            totalOrders: 1,
            totalRevenue: 1,
            avgOrderValue: { $round: ["$avgOrderValue", 0] },
          },
        },
      ]);

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
