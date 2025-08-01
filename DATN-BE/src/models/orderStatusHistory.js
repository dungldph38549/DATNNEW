const mongoose = require('mongoose');

const orderStatusHistorySchema = new mongoose.Schema({
  oldStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
  },
   newStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
  },
  paymentStatus: {
    type: String,
    enum: ['paid','unpaid'],
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  note: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);
