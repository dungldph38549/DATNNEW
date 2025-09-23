const { default: mongoose } = require("mongoose");
const Order = require("../models/order.js");
const Product = require("../models/ProductModel.js");
const Voucher = require("../models/vouchers.js");
const OrderStatusHistory = require("../models/orderStatusHistory.js");
const { VNPay } = require("vnpay");
const { successResponse, errorResponse } = require("../utils/response.js");
const User = require("../models/UserModel.js");

const vnpay = new VNPay({
  tmnCode: "8ZN9ZQZF",
  secureSecret: "8KE9HQEJIQC08DWOMDXA8F5Y6O9P45QU",
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true,
});

exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      userId,
      guestId,
      address,
      fullName,
      paymentMethod,
      shippingMethod,
      phone,
      email,
      products,
      discount = 0,
      totalAmount,
      voucherCode,
    } = req.body;
    if (userId) {
    }
    const user = await User.findById(userId);
    if (user?.isAdmin) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({ message: "Quản trị viên không thể đặt hàng" });
    }
    // Validate user
    if (!(userId || guestId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    // Validate fields
    const requiredFields = {
      address,
      fullName,
      paymentMethod,
      shippingMethod,
      phone,
      email,
      totalAmount,
    };
    for (let key in requiredFields) {
      if (!requiredFields[key]) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(422)
          .json({ message: `Thiếu trường bắt buộc: ${key}` });
      }
    }

    // Validate product list
    if (!Array.isArray(products) || products.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(422)
        .json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    // Xác định phí giao hàng
    const shippingFee = shippingMethod === "fast" ? 30000 : 0;
    const mappedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(404)
          .json({ message: `Không tìm thấy sản phẩm: ${item.productId}` });
      }

      if (item.quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: `Số lượng sản phẩm không hợp lệ` });
      }

      if (product.hasVariants) {
        const variant = product.variants.find((v) => v.sku === item.sku);
        if (!variant) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Không tìm thấy biến thể SKU ${item.sku} cho sản phẩm ${product.name}`,
          });
        }

        if (item.quantity > variant.stock) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Biến thể ${item.sku} chỉ còn ${variant.stock} trong kho`,
          });
        }

        mappedProducts.push({
          productId: item.productId,
          sku: variant.sku,
          quantity: item.quantity,
          price: variant.price,
          attributes: Object.fromEntries(variant.attributes),
        });

        variant.stock -= item.quantity;
        variant.sold += item.quantity;
        await product.save({ session });
      } else {
        if (item.quantity > product.countInStock) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Sản phẩm ${product.name} chỉ còn ${product.countInStock} trong kho`,
          });
        }

        mappedProducts.push({
          productId: item.productId,
          sku: null,
          quantity: item.quantity,
          price: product.price,
          attributes: {},
        });

        product.countInStock -= item.quantity;
        product.sold += item.quantity;
        await product.save({ session });
      }
    }

    const newOrder = new Order({
      userId,
      guestId,
      address,
      fullName,
      paymentMethod,
      shippingMethod,
      phone,
      email,
      products: mappedProducts,
      discount,
      voucherCode,
      shippingFee,
      totalAmount,
    });

    const savedOrder = await newOrder.save({ session });

    if (voucherCode) {
      await Voucher.findOneAndUpdate(
        { code: voucherCode },
        { $inc: { usedCount: 1 } },
        { session }
      );
    }

    await OrderStatusHistory.create(
      [{ newStatus: savedOrder.status, orderId: savedOrder._id }],
      { session }
    );

    // Nếu thanh toán VNPAY thì trả về link
    if (paymentMethod === "vnpay") {
      const vnpayPaymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: savedOrder.totalAmount,
        vnp_IpAddr: req.ip,
        vnp_ReturnUrl: process.env.FE_URL + "/return-payment",
        vnp_TxnRef: savedOrder._id,
        vnp_OrderInfo: "Thanh toán đơn hàng: " + savedOrder._id,
      });

      await session.commitTransaction();
      session.endSession();
      return res.status(201).json({ vnpayPaymentUrl });
    }

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json(savedOrder);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: err.message });
  }
};

exports.returnPayment = async (req, res) => {
  try {
    const verify = vnpay.verifyReturnUrl(req.query);
    const orderId = req.query.vnp_TxnRef;
    if (verify.isSuccess) {
      const order = await Order.findById(orderId);
      if (order.paymentStatus !== "paid") {
        await Order.findOneAndUpdate(
          { _id: orderId },
          { paymentStatus: "paid" }
        );
        await OrderStatusHistory.create({
          orderId: orderId,
          paymentStatus: "paid",
        });
      }
      res.status(200).json({ message: "Thanh toán thành công!" });
    } else {
      res.status(400).json({ message: "Thanh toán thất bại" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersByUserOrGuest = async (req, res) => {
  const { userId, guestId, page, limit } = req.query;
  const pageCurrent = parseInt(page) || 1;
  const limitPage = parseInt(limit) || 10;
  try {
    if (!userId && !guestId) {
      return res.status(400).json({ message: "Thiếu userId hoặc guestId" });
    }

    const query = userId ? { userId } : { guestId };

    const orders = await Order.find(query)
      .populate("userId")
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip((pageCurrent - 1) * limitPage)
      .limit(limitPage);
    const total = await Order.countDocuments(query);

    const formattedOrders = await Promise.all(
      orders.map(async (orderDoc) => {
        const order = orderDoc.toObject();

        if (order.voucherCode) {
          const formattedCode = order.voucherCode.trim().toUpperCase();
          const voucher = await Voucher.findOne({ code: formattedCode });
          order.voucher = voucher;
        }
        return order;
      })
    );
    return res.status(200).json({
      status: "ok",
      message: "Successfully fetched all products",
      data: formattedOrders,
      total: total,
      pageCurrent: pageCurrent,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả Order
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    if (isNaN(page) || isNaN(limit))
      return res.status(422).json({ message: "Trang không hợp lệ" });
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId")
      .limit(limit)
      .skip(page * limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched all products",
      data: orders,
      total: total,
      pageCurrent: page + 1,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    const history = await OrderStatusHistory.find({ orderId: order._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      order,
      history,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật Order từ admin
const statusLabels = {
  pending: "Đang xử lý",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  canceled: "Đã hủy",
  "return-request": "Yêu cầu hoàn hàng",
  accepted: "Chấp nhận hoàn hàng",
  rejected: "Không chấp nhận hoàn hàng",
};
exports.updateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { status, fullName, email, phone, address, note } = req.body;

    const VALID_STATUSES = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "canceled",
      "return-request",
      "accepted",
      "rejected",
    ];
    const TRANSITIONS = {
      pending: ["confirmed", "canceled"],
      confirmed: ["shipped", "canceled"],
      shipped: ["delivered"],
      delivered: ["return-request"],
      canceled: [],
      "return-request": ["accepted", "rejected"],
      accepted: [],
      rejected: [],
    };

    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({ message: "Trạng thái không hợp lệ" });
    }

    if (status && status !== order.status) {
      const allowedNext = TRANSITIONS[order.status] || [];
      if (!allowedNext.includes(status)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(422).json({
          message: `Không thể chuyển từ "${statusLabels[order.status]}" sang "${
            statusLabels[status]
          }".`,
        });
      }
    }

    const NON_EDITABLE_STATUSES = [
      "shipped",
      "delivered",
      "canceled",
      "return-request",
      "accepted",
      "rejected",
    ];
    const isLockedStatus = NON_EDITABLE_STATUSES.includes(order.status);
    const tryingToEditOtherFields = fullName || email || phone || address;

    if (isLockedStatus && tryingToEditOtherFields) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        message: `Không thể chỉnh sửa thông tin khi đơn hàng đang ở trạng thái "${
          statusLabels[order.status]
        }".`,
      });
    }

    const updateFields = {};

    if (status && status !== order.status) {
      updateFields.status = status;
      if (status === "delivered" && order.paymentStatus !== "paid")
        updateFields.paymentStatus = "paid";
    }
    if (!isLockedStatus) {
      if (fullName) updateFields.fullName = fullName;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      if (address) updateFields.address = address;
    }

    if (Object.keys(updateFields).length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(422)
        .json({ message: "Không có thông tin nào để cập nhật" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, session }
    ).populate("products.productId");

    if (status && status !== order.status) {
      await OrderStatusHistory.create(
        [
          {
            oldStatus: order.status,
            newStatus: updateFields.status,
            orderId: order._id,
            paymentStatus:
              status === "delivered" && order.paymentStatus !== "paid"
                ? "paid"
                : null,
            note,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    res.status(200).json(updatedOrder);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// câp nhật order từ user
exports.updateOrderById = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, address, status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Nếu đơn đã xử lý → không được sửa nữa
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Đơn hàng đã xử lý, không thể chỉnh sửa" });
    }

    // Cập nhật thông tin người nhận
    if (fullName) order.fullName = fullName;
    if (email) order.email = email;
    if (phone) order.phone = phone;
    if (address) order.address = address;

    // Hủy đơn
    if (status === "canceled") {
      order.status = "canceled";
    }

    const updated = await order.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error("Lỗi update đơn hàng:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.comfirmDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.status !== "shipped") {
      return res.status(400).json({ message: "Đơn hàng chưa chuyển hàng" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: "delivered", paymentStatus: "paid" },
      { new: true }
    ).populate("products.productId");

    await OrderStatusHistory.create({
      oldStatus: "delivered",
      newStatus: "delivered",
      orderId: order._id,
      paymentStatus: updatedOrder.paymentStatus === "paid" ? null : "paid",
    });
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Lỗi update đơn hàng:", err);
    res.status(500).json({ message: err.message });
  }
};

// Xóa Order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dashboard tổng quan - Updated version
exports.dashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    console.log("Dashboard query range:", { start, end });

    const [totalOrders, totalRevenue, canceledOrders, deliveredOrders] =
      await Promise.all([
        Order.countDocuments({
          createdAt: { $gte: start, $lte: end },
        }),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end },
              // Tính cả paid và COD delivered
              $or: [
                { paymentStatus: "paid" },
                { paymentMethod: "cod", status: "delivered" },
              ],
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
        Order.countDocuments({
          createdAt: { $gte: start, $lte: end },
          status: "canceled",
        }),
        Order.countDocuments({
          createdAt: { $gte: start, $lte: end },
          status: "delivered",
        }),
      ]);

    const result = {
      totalOrders: totalOrders || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      canceledOrders: canceledOrders || 0,
      deliveredOrders: deliveredOrders || 0,
      successRate:
        totalOrders > 0
          ? ((deliveredOrders / totalOrders) * 100).toFixed(2)
          : 0,
    };

    console.log("Dashboard result:", result);

    // Trả về format giống như code cũ nhưng có thêm data
    res.status(200).json({
      status: "ok",
      message: "Successfully fetched dashboard data",
      data: result,
      // Backward compatibility với code cũ
      totalOrders: result.totalOrders,
      totalRevenue: result.totalRevenue,
      canceledOrders: result.canceledOrders,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({
      status: "error",
      message: err?.message || "Internal server error",
    });
  }
};

// Báo cáo doanh thu theo thời gian - Updated version
exports.revenue = async (req, res) => {
  try {
    const { startDate, endDate, unit = "day" } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message: "Missing startDate or endDate",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log("Revenue query:", { start, end, unit });

    let groupId;

    switch (unit) {
      case "year":
        groupId = { $year: "$createdAt" };
        break;
      case "month":
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      case "week":
        groupId = {
          year: { $year: "$createdAt" },
          week: { $isoWeek: "$createdAt" },
        };
        break;
      case "day":
        groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        break;
      case "hour":
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          hour: { $hour: "$createdAt" },
        };
        break;
      default:
        groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }

    const results = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: groupId,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format kết quả giống code cũ
    const formattedResults = results.map((item) => {
      let name = "";

      if (unit === "day" && typeof item._id === "string") {
        // Format YYYY-MM-DD thành D/M
        const date = new Date(item._id);
        name = `${date.getDate()}/${date.getMonth() + 1}`;
      } else {
        // Xử lý các unit khác
        switch (unit) {
          case "year":
            name = `${item._id}`;
            break;
          case "month":
            name = `${item._id.month}/${item._id.year}`;
            break;
          case "week":
            name = `Tuần ${item._id.week}/${item._id.year}`;
            break;
          case "hour":
            name = `${String(item._id.hour).padStart(2, "0")}:00`;
            break;
          default:
            name = item._id?.toString() || "N/A";
        }
      }

      return {
        ...item,
        name,
      };
    });

    console.log("Revenue results:", formattedResults.length, "items");

    // Trả về format giống code cũ
    res.status(200).json({
      status: "ok",
      message: "Successfully fetched revenue data",
      data: formattedResults,
    });
  } catch (err) {
    console.error("Revenue error:", err);
    res.status(500).json({
      status: "error",
      message: err?.message || "Internal server error",
    });
  }
};

// Top sản phẩm bán chạy - Updated version
exports.topSelling = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    console.log("TopSelling query range:", { start, end });

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: "canceled" }, // Không tính đơn bị hủy
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            productId: "$products.productId",
            sku: "$products.sku",
            attributes: "$products.attributes",
          },
          totalQuantity: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productName: { $ifNull: ["$product.name", "Unknown Product"] },
          productPrice: { $ifNull: ["$product.price", 0] },
          sku: { $ifNull: ["$_id.sku", "N/A"] },
          attributes: { $ifNull: ["$_id.attributes", {}] },
          totalQuantity: 1,
          totalRevenue: {
            $multiply: ["$totalQuantity", { $ifNull: ["$product.price", 0] }],
          },
        },
      },
    ]);

    console.log("TopSelling results:", result.length, "items");

    // Trả về format giống code cũ
    res.status(200).json({
      status: "ok",
      message: "Successfully fetched top selling products",
      data: result,
    });
  } catch (err) {
    console.error("TopSelling error:", err);
    res.status(500).json({
      status: "error",
      message: err?.message || "Internal server error",
    });
  }
};

// Thống kê phương thức thanh toán - Updated version
exports.paymentMethod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    console.log("PaymentMethod query range:", { start, end });

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Enhanced format với thêm thông tin
    const formattedResult = result.map((item) => {
      let method;
      switch (item._id) {
        case "cod":
          method = "COD";
          break;
        case "vnpay":
          method = "VNPay";
          break;
        case "momo":
          method = "MoMo";
          break;
        case "wallet":
          method = "Ví điện tử";
          break;
        default:
          method = item._id || "Unknown";
      }

      return {
        _id: item._id,
        method,
        count: item.count,
        totalAmount: item.totalAmount,
        percentage: 0, // Sẽ tính sau
      };
    });

    // Tính phần trăm
    const totalCount = formattedResult.reduce(
      (sum, item) => sum + item.count,
      0
    );
    formattedResult.forEach((item) => {
      item.percentage =
        totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(2) : 0;
    });

    console.log("PaymentMethod results:", formattedResult);

    // Trả về format giống code cũ
    res.status(200).json({
      status: "ok",
      message: "Successfully fetched payment method statistics",
      data: formattedResult,
    });
  } catch (err) {
    console.error("PaymentMethod error:", err);
    res.status(500).json({
      status: "error",
      message: err?.message || "Internal server error",
    });
  }
};

exports.returnOrderRequest = async (req, res) => {
  const { id, note, image } = req.body;

  try {
    const latestOrderStatus = await OrderStatusHistory.findOne({ orderId: id })
      .sort({ createdAt: -1 }) // Lấy mới nhất
      .limit(1);

    if (!latestOrderStatus.newStatus === "delivered") {
      return res.status(400).json({ message: "Không hợp lệ" });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 3);
    if (latestOrderStatus.createdAt < sevenDaysAgo) {
      return res
        .status(400)
        .json({ message: "Quá hạn hoàn hàng (sau 3 ngày)" });
    }

    Order.findByIdAndUpdate(id, { status: "return-request" }, { new: true })
      .then((updatedOrder) => {
        if (!updatedOrder) {
          return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });

    OrderStatusHistory.create({
      oldStatus: latestOrderStatus.newStatus,
      newStatus: "return-request",
      orderId: id,
      note,
      image,
    });

    return res.status(200).json({ message: "Thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptOrRejectReturn = async (req, res) => {
  const { id, status, note } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, session }
    );

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    await OrderStatusHistory.create(
      [
        {
          oldStatus: "return-request",
          newStatus: status,
          orderId: id,
          note,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "Thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.orderReturn = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const histories = await OrderStatusHistory.find({
      newStatus: "return-request",
      updatedAt: { $gte: threeDaysAgo },
    }).populate("orderId");
    return res.status(200).json(histories);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// 1. Controller cho khách hàng xem yêu cầu hoàn hàng của mình
exports.getMyReturnRequests = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    // Tìm các đơn hàng của user có yêu cầu hoàn hàng
    const orders = await Order.find({ userId }).select("_id");
    const orderIds = orders.map((order) => order._id);

    const returnRequests = await OrderStatusHistory.find({
      orderId: { $in: orderIds },
      newStatus: { $in: ["return-request", "accepted", "rejected"] },
    })
      .populate("orderId")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await OrderStatusHistory.countDocuments({
      orderId: { $in: orderIds },
      newStatus: { $in: ["return-request", "accepted", "rejected"] },
    });

    res.json({
      data: returnRequests,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Controller cập nhật thông tin gửi hàng hoàn trả
exports.updateReturnShipping = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber, carrier, shippingImages } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({ message: "Thiếu mã vận đơn" });
    }

    // Tìm order
    const order = await Order.findById(orderId);
    if (!order || order.status !== "return-request") {
      return res.status(400).json({ message: "Đơn hàng không hợp lệ" });
    }

    // Cập nhật thông tin shipping
    await Order.findByIdAndUpdate(orderId, {
      status: "return-shipping",
      returnShipping: {
        trackingNumber,
        carrier,
        shippingImages,
        shippedAt: new Date(),
      },
    });

    // Thêm vào lịch sử
    await OrderStatusHistory.create({
      orderId,
      oldStatus: "return-request",
      newStatus: "return-shipping",
      note: `Đã gửi hàng hoàn trả. Mã vận đơn: ${trackingNumber}`,
      trackingNumber,
      carrier,
    });

    res.json({ message: "Cập nhật thông tin gửi hàng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Controller admin xác nhận đã nhận hàng hoàn trả
exports.confirmReturnReceived = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { condition, adminNote, refundAmount, images } = req.body;

    const order = await Order.findById(orderId).session(session);
    if (!order || order.status !== "return-shipping") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Đơn hàng không hợp lệ" });
    }

    let newStatus;
    if (condition === "approved") {
      newStatus = "return-approved-final";

      // Hoàn lại tồn kho
      for (const item of order.products) {
        const product = await Product.findById(item.productId).session(session);

        if (product.hasVariants && item.sku) {
          const variant = product.variants.find((v) => v.sku === item.sku);
          if (variant) {
            variant.stock += item.quantity;
            variant.sold -= item.quantity;
          }
        } else {
          product.countInStock += item.quantity;
          product.sold -= item.quantity;
        }

        await product.save({ session });
      }

      // TODO: Xử lý hoàn tiền ở đây
      // await processRefund(order, refundAmount);
    } else {
      newStatus = "return-rejected-final";
    }

    await Order.findByIdAndUpdate(
      orderId,
      {
        status: newStatus,
        returnInspection: {
          condition,
          adminNote,
          refundAmount,
          images,
          inspectedAt: new Date(),
        },
      },
      { session }
    );

    await OrderStatusHistory.create(
      [
        {
          orderId,
          oldStatus: "return-shipping",
          newStatus,
          note: adminNote || `Hàng hoàn trả đã được ${condition}`,
          refundAmount: condition === "approved" ? refundAmount : null,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: `Đã ${
        condition === "approved" ? "chấp nhận" : "từ chối"
      } hàng hoàn trả`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// 4. Controller lấy chi tiết yêu cầu hoàn hàng
exports.getReturnRequestDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const history = await OrderStatusHistory.find({ orderId }).sort({
      createdAt: 1,
    });

    // Lọc ra các bước liên quan đến hoàn hàng
    const returnHistory = history.filter(
      (h) => h.newStatus && h.newStatus.includes("return")
    );

    res.json({
      order,
      returnHistory,
      fullHistory: history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Controller hủy yêu cầu hoàn hàng (từ khách)
exports.cancelReturnRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId).session(session);
    if (!order || order.status !== "return-request") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Không thể hủy yêu cầu hoàn hàng" });
    }

    await Order.findByIdAndUpdate(
      orderId,
      { status: "delivered" }, // Quay về trạng thái đã giao
      { session }
    );

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

    res.json({ message: "Đã hủy yêu cầu hoàn hàng" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// 6. Controller thống kê hoàn hàng (cho admin)
exports.getReturnStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const stats = await OrderStatusHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          newStatus: { $in: ["return-request", "accepted", "rejected"] },
        },
      },
      {
        $group: {
          _id: "$newStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tính tỷ lệ hoàn hàng
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end },
      status: "delivered",
    });

    const returnRequests =
      stats.find((s) => s._id === "return-request")?.count || 0;
    const returnRate =
      totalOrders > 0 ? ((returnRequests / totalOrders) * 100).toFixed(2) : 0;

    res.json({
      stats,
      returnRate: `${returnRate}%`,
      totalDeliveredOrders: totalOrders,
      period: { startDate: start, endDate: end },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Controller lấy template lý do hoàn hàng
exports.getReturnReasons = async (req, res) => {
  const reasons = [
    { code: "wrong-item", text: "Nhận sai hàng" },
    { code: "defective", text: "Sản phẩm bị lỗi/hỏng" },
    { code: "not-described", text: "Không đúng như mô tả" },
    { code: "size-wrong", text: "Sai size/màu sắc" },
    { code: "change-mind", text: "Đổi ý không muốn mua nữa" },
    {
      code: "damaged-shipping",
      text: "Hàng bị hư hại trong quá trình vận chuyển",
    },
    { code: "other", text: "Lý do khác" },
  ];

  res.json(reasons);
};

// 8. Controller kiểm tra điều kiện hoàn hàng
exports.checkReturnEligibility = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    let eligible = false;
    let reason = "";

    if (order.status !== "delivered") {
      reason = "Đơn hàng chưa được giao";
    } else {
      // Kiểm tra thời hạn (3 ngày)
      const latestHistory = await OrderStatusHistory.findOne({
        orderId,
        newStatus: "delivered",
      }).sort({ createdAt: -1 });

      if (latestHistory) {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        if (latestHistory.createdAt >= threeDaysAgo) {
          eligible = true;
          reason = "Đủ điều kiện hoàn hàng";
        } else {
          reason = "Đã quá hạn hoàn hàng (3 ngày)";
        }
      } else {
        reason = "Không tìm thấy thông tin giao hàng";
      }
    }

    res.json({
      eligible,
      reason,
      order: {
        id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
