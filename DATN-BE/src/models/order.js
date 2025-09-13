const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guestId: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', 'vnpay'],
  },
  shippingMethod: {
    type: String,
    required: true,
    enum: ['standard', 'fast'],
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
    default: 'pending'
  }
}, { timestamps: true });

orderSchema.pre('validate', function (next) {
  if (!this.userId && !this.guestId) {
    this.invalidate('userId', 'Either userId or guestId is required.');
    this.invalidate('guestId', 'Either guestId or userId is required.');
  }
  next();
});
module.exports = mongoose.model('Order', orderSchema);