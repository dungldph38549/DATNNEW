const Order = require('../models/order.js');

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

    if(
      !(userId || guestId) ||
      !address ||
      !fullName ||
      !paymentMethod ||
      !shippingMethod ||
      !phone ||
      !email ||
      !products
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const subtotal = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const mapProducts = products.map((item) => ({ productId: item._id, quantity: item.quantity }));
    
    const shippingFee = shippingMethod === "fast" ? 30000 : 0;
    const totalAmount = subtotal + shippingFee;
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
      status: 'pending',
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      .populate('products.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả Order
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId')
      .populate('products.productId');
    res.status(200).json(orders);
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

// Cập nhật trạng thái Order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
