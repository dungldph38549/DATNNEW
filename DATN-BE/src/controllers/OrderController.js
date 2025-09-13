const { default: mongoose } = require("mongoose");
const Order = require("../models/order.js");
const Product = require("../models/ProductModel.js");
const Voucher = require("../models/vouchers.js");
const OrderStatusHistory = require("../models/orderStatusHistory.js");
const { VNPay } = require("vnpay");
const { successResponse, errorResponse } = require("../utils/response.js");

const vnpay = new VNPay({
  tmnCode: "8ZN9ZQZF",
  secureSecret: "8KE9HQEJIQC08DWOMDXA8F5Y6O9P45QU",
  vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  testMode: true,
});

// Thời gian cho phép hoàn hàng (7 ngày)
const RETURN_PERIOD_DAYS = 7;

// Cập nhật status labels để bao gồm trạng thái hoàn hàng
const statusLabels = {
  pending: "Đang xử lý",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  canceled: "Đã hủy",
  return_requested: "Yêu cầu hoàn hàng",
  returned: "Đã hoàn hàng",
  return_rejected: "Từ chối hoàn hàng",
};

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

// Cập nhật Order từ admin (ENHANCED)
exports.updateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { status, fullName, email, phone, address, note } = req.body;

    // Cập nhật danh sách trạng thái hợp lệ và quy tắc chuyển đổi
    const VALID_STATUSES = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "canceled",
      "return_requested",
      "returned",
      "return_rejected",
    ];
    const TRANSITIONS = {
      pending: ["confirmed", "canceled"],
      confirmed: ["shipped", "canceled"],
      shipped: ["delivered"],
      delivered: ["return_requested"], // Từ delivered có thể yêu cầu hoàn hàng
      canceled: [],
      return_requested: ["returned", "return_rejected"], // Từ yêu cầu hoàn có thể chấp nhận hoặc từ chối
      returned: [],
      return_rejected: [],
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

    // Cập nhật danh sách trạng thái không cho phép chỉnh sửa thông tin
    const NON_EDITABLE_STATUSES = [
      "shipped",
      "delivered",
      "canceled",
      "returned",
      "return_rejected",
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

      // Xử lý tự động cập nhật paymentStatus
      if (status === "delivered" && order.paymentStatus !== "paid") {
        updateFields.paymentStatus = "paid";
      }

      // Nếu hoàn hàng được chấp nhận, hoàn tiền và cập nhật kho
      if (status === "returned") {
        updateFields.paymentStatus = "refunded";

        // Hoàn lại kho hàng
        for (const item of order.products) {
          const product = await Product.findById(item.productId).session(
            session
          );
          if (product) {
            if (product.hasVariants && item.sku) {
              const variant = product.variants.find((v) => v.sku === item.sku);
              if (variant) {
                variant.stock += item.quantity;
                variant.sold -= item.quantity;
                await product.save({ session });
              }
            } else {
              product.countInStock += item.quantity;
              product.sold -= item.quantity;
              await product.save({ session });
            }
          }
        }
      }
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
            paymentStatus: updateFields.paymentStatus || null,
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

// Yêu cầu hoàn hàng từ người dùng (NEW)
exports.requestReturn = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    const { returnReason, returnDescription, returnImages } = req.body;

    if (!returnReason) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(422)
        .json({ message: "Vui lòng cung cấp lý do hoàn hàng" });
    }

    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== "delivered") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Chỉ có thể hoàn hàng khi đơn hàng đã được giao thành công",
      });
    }

    // Kiểm tra thời gian hoàn hàng
    const deliveredDate = order.updatedAt; // Hoặc lấy từ OrderStatusHistory
    const currentDate = new Date();
    const daysSinceDelivery = Math.ceil(
      (currentDate - deliveredDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceDelivery > RETURN_PERIOD_DAYS) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Đã quá thời hạn hoàn hàng. Bạn chỉ có thể hoàn hàng trong vòng ${RETURN_PERIOD_DAYS} ngày kể từ khi nhận hàng.`,
      });
    }

    // Kiểm tra xem đã có yêu cầu hoàn hàng chưa
    if (
      ["return_requested", "returned", "return_rejected"].includes(order.status)
    ) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Đơn hàng đã có yêu cầu hoàn hàng trước đó" });
    }

    // Cập nhật trạng thái đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: "return_requested",
        returnInfo: {
          returnReason,
          returnDescription,
          returnImages: returnImages || [],
          requestDate: new Date(),
        },
      },
      { new: true, session }
    ).populate("products.productId");

    // Ghi lịch sử
    await OrderStatusHistory.create(
      [
        {
          oldStatus: "delivered",
          newStatus: "return_requested",
          orderId: order._id,
          note: `Yêu cầu hoàn hàng: ${returnReason}. ${
            returnDescription || ""
          }`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Yêu cầu hoàn hàng đã được gửi thành công",
      order: updatedOrder,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: err.message });
  }
};

// Xử lý yêu cầu hoàn hàng từ admin (NEW)
exports.processReturn = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;
    const { action, adminNote } = req.body; // action: 'approve' hoặc 'reject'

    if (!["approve", "reject"].includes(action)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(422).json({
        message:
          'Hành động không hợp lệ. Chỉ chấp nhận "approve" hoặc "reject"',
      });
    }

    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (order.status !== "return_requested") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Đơn hàng không có yêu cầu hoàn hàng" });
    }

    let newStatus,
      paymentStatus = order.paymentStatus;

    if (action === "approve") {
      newStatus = "returned";
      paymentStatus = "refunded";

      // Hoàn lại kho hàng
      for (const item of order.products) {
        const product = await Product.findById(item.productId).session(session);
        if (product) {
          if (product.hasVariants && item.sku) {
            const variant = product.variants.find((v) => v.sku === item.sku);
            if (variant) {
              variant.stock += item.quantity;
              variant.sold -= item.quantity;
              await product.save({ session });
            }
          } else {
            product.countInStock += item.quantity;
            product.sold -= item.quantity;
            await product.save({ session });
          }
        }
      }
    } else {
      newStatus = "return_rejected";
    }

    // Cập nhật đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        paymentStatus,
        "returnInfo.processDate": new Date(),
        "returnInfo.adminNote": adminNote,
        "returnInfo.status": action === "approve" ? "approved" : "rejected",
      },
      { new: true, session }
    ).populate("products.productId");

    // Ghi lịch sử
    await OrderStatusHistory.create(
      [
        {
          oldStatus: "return_requested",
          newStatus: newStatus,
          orderId: order._id,
          paymentStatus: action === "approve" ? "refunded" : null,
          note: `${
            action === "approve" ? "Chấp nhận" : "Từ chối"
          } yêu cầu hoàn hàng. ${adminNote || ""}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: `Đã ${
        action === "approve" ? "chấp nhận" : "từ chối"
      } yêu cầu hoàn hàng`,
      order: updatedOrder,
    });
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
      oldStatus: "shipped",
      newStatus: "delivered",
      orderId: order._id,
      paymentStatus: updatedOrder.paymentStatus === "paid" ? "paid" : null,
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

exports.dashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const [totalOrders, totalRevenue, canceledOrders] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: start, $lte: end },
      }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            // paymentStatus: 'paid'
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
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      canceledOrders,
    });
  } catch (err) {
    errorResponse({ res, message: err?.message, statusCode: 500 });
  }
};

exports.revenue = async (req, res) => {
  try {
    const { startDate, endDate, unit = "day" } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Missing startDate or endDate" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    let groupId;
    let format;

    switch (unit) {
      case "year":
        groupId = { $year: "$createdAt" };
        format = "YYYY";
        break;
      case "month":
        groupId = { $month: "$createdAt" }; // Số tháng từ 1 đến 12
        format = "MM";
        break;
      case "week":
        groupId = { $isoWeek: "$createdAt" }; // Tuần ISO (1 - 53)
        format = "WW";
        break;
      case "day":
        groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        format = "D/M";
        break;
      case "hour":
        groupId = { $hour: "$createdAt" }; // giờ 0–23
        format = "HH:00";
        break;
      default:
        groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        format = "D/M";
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

    const formattedResults = results.map((item) => {
      let name = "";
      switch (unit) {
        case "month":
          name = `Tháng ${item._id}`;
          break;
        case "week":
          name = `Tuần ${item._id}`;
          break;
        case "year":
          name = `${item._id}`;
          break;
        case "hour":
          name = `${String(item._id).padStart(2, "0")}:00`;
          break;
        case "day":
          name = moment(item._id).format("D/M");
          break;
        default:
          name = moment(item._id).format("D/M");
      }

      return {
        ...item,
        name,
      };
    });
    res.status(200).json(formattedResults);
  } catch (err) {
    errorResponse({ res, message: err?.message, statusCode: 500 });
  }
};

exports.topSelling = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
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
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productName: "$product.name",
          sku: "$_id.sku",
          attributes: "$_id.attributes",
          totalQuantity: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    errorResponse({ res, message: err?.message, statusCode: 500 });
  }
};

exports.paymentMethod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (err) {
    errorResponse({ res, message: err?.message, statusCode: 500 });
  }
};

// Thống kê hoàn hàng (NEW)
exports.returnStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    const [returnStats, returnReasons] = await Promise.all([
      // Thống kê tổng quan về hoàn hàng
      Order.aggregate([
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
          $match: {
            _id: { $in: ["return_requested", "returned", "return_rejected"] },
          },
        },
      ]),

      // Thống kê theo lý do hoàn hàng
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: {
              $in: ["return_requested", "returned", "return_rejected"],
            },
            "returnInfo.returnReason": { $exists: true },
          },
        },
        {
          $group: {
            _id: "$returnInfo.returnReason",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      returnStats,
      returnReasons,
    });
  } catch (err) {
    errorResponse({ res, message: err?.message, statusCode: 500 });
  }
};

// Lấy danh sách yêu cầu hoàn hàng (NEW)
exports.getReturnRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'return_requested', 'returned', 'return_rejected'

    let query = {
      status: { $in: ["return_requested", "returned", "return_rejected"] },
    };

    if (
      status &&
      ["return_requested", "returned", "return_rejected"].includes(status)
    ) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("userId")
      .populate("products.productId")
      .limit(limit)
      .skip(page * limit)
      .sort({ "returnInfo.requestDate": -1 });

    res.status(200).json({
      status: "ok",
      message: "Successfully fetched return requests",
      data: orders,
      total: total,
      pageCurrent: page + 1,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
