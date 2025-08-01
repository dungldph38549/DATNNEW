const Order = require('../models/order.js');
const Product = require("../models/ProductModel.js");

// Tạo mới Order
exports.createOrder = async (req, res) => {
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
    } = req.body;

    // 1. Validate đầu vào
    
    if (!(userId || guestId)) {
      return res.status(422).json({ message: "Thiếu userId hoặc guestId" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(422).json({ message: "Danh sách sản phẩm không hợp lệ" });
    }

    const requiredFields = { address, fullName, paymentMethod, shippingMethod, phone, email };
    for (let key in requiredFields) {
      if (!requiredFields[key]) {
        return res.status(422).json({ message: `Thiếu trường bắt buộc: ${key}` });
      }
    }

    // 2. Validate sản phẩm và tính toán tổng tiền
    let subtotal = 0;
    const mapProducts = [];

    for (const item of products) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({ message: `Không tìm thấy sản phẩm: ${item._id}` });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Số lượng sản phẩm ${product.name} không hợp lệ` });
      }

      if (item.quantity > product.countInStock) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} chỉ còn ${product.countInStock} trong kho`,
        });
      }

      subtotal += item.quantity * product.price;
      mapProducts.push({ productId: item._id, quantity: item.quantity });
    }

    const shippingFee = shippingMethod === "fast" ? 30000 : 0;
    const totalAmount = subtotal + shippingFee;

    // 3. Tạo đơn hàng
    const newOrder = new Order({
      userId,
      guestId,
      address,
      fullName,
      paymentMethod,
      shippingMethod,
      phone,
      email,
      products: mapProducts,
      totalAmount,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    // 4. Trừ số lượng tồn kho
    for (const item of products) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { countInStock: -item.quantity },
      });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getOrdersByUserOrGuest = async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    if (!userId && !guestId) {
      return res.status(400).json({ message: 'Thiếu userId hoặc guestId' });
    }

    const query = userId ? { userId } : { guestId };

    const orders = await Order.find(query)
      .populate('userId')
      .populate('products.productId')
      .sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả Order
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    if(isNaN(page) || isNaN(limit)) return res.status(422).json({ message: "Trang không hợp lệ" });
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate('userId')
      .populate('products.productId')
      .limit(limit)
      .skip(page * limit);
      
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
      .populate('userId')
      .populate('products.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết Order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId')
      .populate('products.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật Order từ admin
const statusLabels = {
  pending: 'Đang xử lý',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã hủy',
}
exports.updateOrder = async (req, res) => {
  try {
    const {
      status,
      fullName,
      email,
      phone,
      address,
    } = req.body;

    const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'];
    const TRANSITIONS = {
      pending: ['confirmed', 'canceled'],
      confirmed: ['shipped', 'canceled'],
      shipped: ['delivered'],
      delivered: [],
      canceled: [],
    };

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    // Nếu muốn thay đổi status, validate trạng thái mới
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(422).json({ message: 'Trạng thái không hợp lệ' });
    }

    // Nếu status được cập nhật, validate chuyển trạng thái
    if (status && status !== order.status) {
      const allowedNext = TRANSITIONS[order.status] || [];
      if (!allowedNext.includes(status)) {
        return res.status(422).json({
          message: `Không thể chuyển từ "${statusLabels[order.status]}" sang "${statusLabels[status]}".`,
        });
      }
    }

    // Không cho phép chỉnh sửa thông tin khác nếu trạng thái hiện tại là "shipping", "delivered" hoặc "canceled"
    const NON_EDITABLE_STATUSES = ['shipped', 'delivered', 'canceled'];
    const isLockedStatus = NON_EDITABLE_STATUSES.includes(order.status);
    const tryingToEditOtherFields = fullName || email || phone || address;

    if (isLockedStatus && tryingToEditOtherFields) {
      return res.status(403).json({
        message: `Không thể chỉnh sửa thông tin khi đơn hàng đang ở trạng thái "${statusLabels[order.status]}".`,
      });
    }

    const updateFields = {};

    if (status && status !== order.status) updateFields.status = status;
    if (!isLockedStatus) {
      if (fullName) updateFields.fullName = fullName;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      if (address) updateFields.address = address;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(422).json({ message: 'Không có thông tin nào để cập nhật' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('products.productId');

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ' });
  }
};

// câp nhật order từ user
exports.updateOrderById = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, address, status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    // Nếu đơn đã xử lý → không được sửa nữa
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Đơn hàng đã xử lý, không thể chỉnh sửa' });
    }

    // Cập nhật thông tin người nhận
    if (fullName) order.fullName = fullName;
    if (email) order.email = email;
    if (phone) order.phone = phone;
    if (address) order.address = address;

    // Hủy đơn
    if (status === 'canceled') {
      order.status = 'canceled';
    }

    const updated = await order.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error('Lỗi update đơn hàng:', err);
    res.status(500).json({ message: err.message });
  }
};

// Xóa Order
exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
