// controllers/ReturnController.js - Controller riêng cho hệ thống hoàn hàng
const { default: mongoose } = require("mongoose");
const Order = require("../models/order.js");
const Product = require("../models/ProductModel.js");
const OrderStatusHistory = require("../models/orderStatusHistory.js");
const User = require("../models/UserModel.js");

// =================== PUBLIC RETURN METHODS ===================

// Lấy danh sách lý do hoàn hàng
const getReturnReasons = async (req, res) => {
  try {
    const reasons = [
      { code: "wrong-item", text: "Nhận sai hàng", category: "seller-fault" },
      { code: "defective", text: "Sản phẩm bị lỗi/hỏng", category: "quality" },
      {
        code: "not-described",
        text: "Không đúng như mô tả",
        category: "quality",
      },
      {
        code: "size-wrong",
        text: "Sai size/màu sắc",
        category: "specification",
      },
      {
        code: "change-mind",
        text: "Đổi ý không muốn mua nữa",
        category: "customer-change",
      },
      {
        code: "damaged-shipping",
        text: "Hàng bị hư hại trong quá trình vận chuyển",
        category: "shipping",
      },
      {
        code: "missing-parts",
        text: "Thiếu phụ kiện/chi tiết",
        category: "incomplete",
      },
      {
        code: "quality-issue",
        text: "Chất lượng không như mong đợi",
        category: "quality",
      },
      { code: "other", text: "Lý do khác", category: "other" },
    ];

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched return reasons",
      data: reasons,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// =================== USER RETURN METHODS ===================

// Kiểm tra điều kiện hoàn hàng
const checkReturnEligibility = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền sở hữu (nếu không phải admin)
    if (
      !req.user?.isAdmin &&
      order.userId &&
      order.userId.toString() !== userId?.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "Không có quyền truy cập đơn hàng này",
      });
    }

    let eligible = false;
    let reason = "";
    let remainingDays = 0;

    if (order.status !== "delivered") {
      reason = "Đơn hàng chưa được giao";
    } else {
      // Kiểm tra thời hạn (7 ngày)
      const latestHistory = await OrderStatusHistory.findOne({
        orderId,
        newStatus: "delivered",
      }).sort({ createdAt: -1 });

      if (latestHistory) {
        const deliveryDate = new Date(latestHistory.createdAt);
        const currentDate = new Date();
        const daysDiff = Math.floor(
          (currentDate - deliveryDate) / (1000 * 60 * 60 * 24)
        );
        const returnPeriod = 7; // 7 ngày

        if (daysDiff <= returnPeriod) {
          eligible = true;
          remainingDays = returnPeriod - daysDiff;
          reason = `Đủ điều kiện hoàn hàng (còn ${remainingDays} ngày)`;
        } else {
          reason = `Đã quá hạn hoàn hàng (${returnPeriod} ngày)`;
        }
      } else {
        reason = "Không tìm thấy thông tin giao hàng";
      }
    }

    // Kiểm tra trạng thái hiện tại
    const hasActiveReturn = await OrderStatusHistory.findOne({
      orderId,
      newStatus: {
        $in: ["return-request", "return-shipping", "return-approved"],
      },
    });

    if (hasActiveReturn) {
      eligible = false;
      reason = "Đơn hàng đã có yêu cầu hoàn trả đang xử lý";
    }

    res.status(200).json({
      status: "ok",
      data: {
        eligible,
        reason,
        remainingDays,
        order: {
          id: order._id,
          status: order.status,
          totalAmount: order.totalAmount,
          deliveredAt: latestHistory?.createdAt || null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Xem danh sách yêu cầu hoàn hàng của user
const getMyReturnRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user?.id;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu thông tin user",
      });
    }

    // Tìm các đơn hàng của user
    const userOrders = await Order.find({ userId }).select("_id");
    const orderIds = userOrders.map((order) => order._id);

    // Build query cho return requests
    let query = {
      orderId: { $in: orderIds },
      newStatus: {
        $in: [
          "return-request",
          "return-shipping",
          "return-approved",
          "return-rejected",
          "return-completed",
        ],
      },
    };

    if (status) {
      query.newStatus = status;
    }

    const returnRequests = await OrderStatusHistory.find(query)
      .populate({
        path: "orderId",
        populate: {
          path: "products.productId",
          model: "Product",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await OrderStatusHistory.countDocuments(query);

    // Format data
    const formattedRequests = returnRequests.map((request) => ({
      _id: request._id,
      orderId: request.orderId._id,
      orderInfo: {
        totalAmount: request.orderId.totalAmount,
        products: request.orderId.products,
        createdAt: request.orderId.createdAt,
      },
      status: request.newStatus,
      requestDate: request.createdAt,
      note: request.note,
      image: request.image,
      trackingNumber: request.trackingNumber,
      carrier: request.carrier,
    }));

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched return requests",
      data: formattedRequests,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Cập nhật thông tin gửi hàng hoàn trả
const updateReturnShipping = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { trackingNumber, carrier, shippingImages, note } = req.body;
    const userId = req.user?.id;

    if (!trackingNumber) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Thiếu mã vận đơn",
      });
    }

    // Kiểm tra order và quyền
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (!req.user?.isAdmin && order.userId.toString() !== userId?.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        status: "error",
        message: "Không có quyền truy cập đơn hàng này",
      });
    }

    if (order.status !== "return-request") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Đơn hàng không ở trạng thái chờ gửi hàng hoàn trả",
      });
    }

    // Cập nhật order status
    await Order.findByIdAndUpdate(
      orderId,
      { status: "return-shipping" },
      { session }
    );

    // Thêm vào lịch sử
    await OrderStatusHistory.create(
      [
        {
          orderId,
          oldStatus: "return-request",
          newStatus: "return-shipping",
          note: note || `Đã gửi hàng hoàn trả. Mã vận đơn: ${trackingNumber}`,
          trackingNumber,
          carrier,
          image: shippingImages,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: "Cập nhật thông tin gửi hàng thành công",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Hủy yêu cầu hoàn hàng
const cancelReturnRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền
    if (!req.user?.isAdmin && order.userId.toString() !== userId?.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        status: "error",
        message: "Không có quyền truy cập đơn hàng này",
      });
    }

    if (order.status !== "return-request") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Không thể hủy yêu cầu hoàn hàng ở trạng thái hiện tại",
      });
    }

    // Cập nhật order về trạng thái delivered
    await Order.findByIdAndUpdate(
      orderId,
      { status: "delivered" },
      { session }
    );

    // Thêm vào lịch sử
    await OrderStatusHistory.create(
      [
        {
          orderId,
          oldStatus: "return-request",
          newStatus: "delivered",
          note: reason || "Khách hàng hủy yêu cầu hoàn hàng",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: "Đã hủy yêu cầu hoàn hàng",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// =================== ADMIN RETURN METHODS ===================

// Lấy tất cả yêu cầu hoàn hàng (Admin)
const getAllReturnRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      startDate,
      endDate,
      search,
    } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    let query = {
      newStatus: {
        $in: [
          "return-request",
          "return-shipping",
          "return-approved",
          "return-rejected",
          "return-completed",
        ],
      },
    };

    if (status) {
      query.newStatus = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Get return requests
    let returnQuery = OrderStatusHistory.find(query)
      .populate({
        path: "orderId",
        populate: [
          {
            path: "userId",
            model: "User",
            select: "name email phone",
          },
          {
            path: "products.productId",
            model: "Product",
            select: "name price images",
          },
        ],
      })
      .sort({ createdAt: -1 });

    // Apply search if provided
    if (search) {
      returnQuery = returnQuery.populate({
        path: "orderId",
        match: {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    const returnRequests = await returnQuery
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await OrderStatusHistory.countDocuments(query);

    // Format data
    const formattedRequests = returnRequests
      .filter((request) => request.orderId) // Remove null orders from search
      .map((request) => ({
        _id: request._id,
        orderId: request.orderId._id,
        orderInfo: {
          fullName: request.orderId.fullName,
          email: request.orderId.email,
          phone: request.orderId.phone,
          totalAmount: request.orderId.totalAmount,
          products: request.orderId.products,
          orderDate: request.orderId.createdAt,
        },
        userInfo: request.orderId.userId,
        status: request.newStatus,
        requestDate: request.createdAt,
        note: request.note,
        image: request.image,
        trackingNumber: request.trackingNumber,
        carrier: request.carrier,
        refundAmount: request.refundAmount,
      }));

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched all return requests",
      data: formattedRequests,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Xác nhận đã nhận hàng hoàn trả (Admin)
const confirmReturnReceived = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { condition, adminNote, refundAmount, inspectionImages } = req.body;

    if (!["approved", "rejected"].includes(condition)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Điều kiện không hợp lệ (approved/rejected)",
      });
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status !== "return-shipping") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Đơn hàng không ở trạng thái chờ xác nhận",
      });
    }

    let newStatus;
    if (condition === "approved") {
      newStatus = "return-completed";

      // Hoàn lại tồn kho
      for (const item of order.products) {
        const product = await Product.findById(item.productId).session(session);

        if (product) {
          if (product.hasVariants && item.sku) {
            const variant = product.variants.find((v) => v.sku === item.sku);
            if (variant) {
              variant.stock += item.quantity;
              variant.sold = Math.max(0, variant.sold - item.quantity);
            }
          } else {
            product.countInStock += item.quantity;
            product.sold = Math.max(0, product.sold - item.quantity);
          }

          await product.save({ session });
        }
      }

      // TODO: Implement refund processing
      // await processRefund(order, refundAmount);
    } else {
      newStatus = "return-rejected";
    }

    // Cập nhật order
    await Order.findByIdAndUpdate(orderId, { status: newStatus }, { session });

    // Thêm vào lịch sử
    await OrderStatusHistory.create(
      [
        {
          orderId,
          oldStatus: "return-shipping",
          newStatus,
          note:
            adminNote ||
            `Hàng hoàn trả đã được ${
              condition === "approved" ? "chấp nhận" : "từ chối"
            }`,
          refundAmount: condition === "approved" ? refundAmount : null,
          image: inspectionImages,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: `Đã ${
        condition === "approved" ? "chấp nhận" : "từ chối"
      } hàng hoàn trả`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Thống kê hoàn hàng (Admin)
const getReturnStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const [returnStats, totalDeliveredOrders] = await Promise.all([
      // Thống kê return theo status
      OrderStatusHistory.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            newStatus: {
              $in: ["return-request", "return-completed", "return-rejected"],
            },
          },
        },
        {
          $group: {
            _id: "$newStatus",
            count: { $sum: 1 },
          },
        },
      ]),

      // Tổng số đơn hàng đã giao
      Order.countDocuments({
        createdAt: { $gte: start, $lte: end },
        status: "delivered",
      }),
    ]);

    // Tính toán metrics
    const returnRequests =
      returnStats.find((s) => s._id === "return-request")?.count || 0;
    const completedReturns =
      returnStats.find((s) => s._id === "return-completed")?.count || 0;
    const rejectedReturns =
      returnStats.find((s) => s._id === "return-rejected")?.count || 0;

    const returnRate =
      totalDeliveredOrders > 0
        ? ((returnRequests / totalDeliveredOrders) * 100).toFixed(2)
        : "0.00";

    const approvalRate =
      returnRequests > 0
        ? ((completedReturns / returnRequests) * 100).toFixed(2)
        : "0.00";

    // Thống kê theo lý do (nếu có field reason)
    const reasonStats = await OrderStatusHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          newStatus: "return-request",
          reason: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched return statistics",
      data: {
        overview: {
          totalDeliveredOrders,
          returnRequests,
          completedReturns,
          rejectedReturns,
          returnRate: `${returnRate}%`,
          approvalRate: `${approvalRate}%`,
        },
        statusBreakdown: returnStats,
        reasonBreakdown: reasonStats,
        period: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Chi tiết yêu cầu hoàn hàng
const getReturnRequestDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra quyền (user chỉ xem được order của mình, admin xem được tất cả)
    if (
      !req.user?.isAdmin &&
      order.userId._id.toString() !== userId?.toString()
    ) {
      return res.status(403).json({
        status: "error",
        message: "Không có quyền truy cập đơn hàng này",
      });
    }

    // Lấy lịch sử return
    const returnHistory = await OrderStatusHistory.find({
      orderId,
      newStatus: {
        $in: [
          "return-request",
          "return-shipping",
          "return-completed",
          "return-rejected",
        ],
      },
    }).sort({ createdAt: 1 });

    // Lấy toàn bộ lịch sử nếu là admin
    const fullHistory = req.user?.isAdmin
      ? await OrderStatusHistory.find({ orderId }).sort({ createdAt: 1 })
      : returnHistory;

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched return request detail",
      data: {
        order,
        returnHistory,
        fullHistory: req.user?.isAdmin ? fullHistory : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Bulk process returns (Admin only)
const bulkProcessReturns = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { returnIds, action, note } = req.body;

    if (!Array.isArray(returnIds) || returnIds.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Danh sách return ID không hợp lệ",
      });
    }

    if (!["approve", "reject"].includes(action)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Hành động không hợp lệ",
      });
    }

    const results = [];

    for (const returnId of returnIds) {
      try {
        const returnRequest = await OrderStatusHistory.findById(
          returnId
        ).session(session);
        if (!returnRequest) {
          results.push({
            id: returnId,
            success: false,
            message: "Không tìm thấy yêu cầu hoàn trả",
          });
          continue;
        }

        const newStatus = action === "approve" ? "accepted" : "rejected";

        await Order.findByIdAndUpdate(
          returnRequest.orderId,
          { status: newStatus },
          { session }
        );

        await OrderStatusHistory.create(
          [
            {
              orderId: returnRequest.orderId,
              oldStatus: returnRequest.newStatus,
              newStatus,
              note: note || `Bulk ${action} by admin`,
            },
          ],
          { session }
        );

        results.push({
          id: returnId,
          success: true,
          message: `${
            action === "approve" ? "Chấp nhận" : "Từ chối"
          } thành công`,
        });
      } catch (err) {
        results.push({
          id: returnId,
          success: false,
          message: err.message,
        });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "ok",
      message: "Bulk process completed",
      data: {
        results,
        summary: {
          total: returnIds.length,
          success: results.filter((r) => r.success).length,
          failed: results.filter((r) => !r.success).length,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  // Public methods
  getReturnReasons,

  // User methods
  checkReturnEligibility,
  getMyReturnRequests,
  updateReturnShipping,
  cancelReturnRequest,

  // Admin methods
  getAllReturnRequests,
  confirmReturnReceived,
  getReturnStatistics,
  bulkProcessReturns,

  // Shared methods
  getReturnRequestDetail,
};
