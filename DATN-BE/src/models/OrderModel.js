const mongoose = require("mongose");
const orderSchema = new mongoose.Schema(
  {
    orderItem: [
      {
        name: { type: String, require: true },
        amount: { type: Number, require: true },
        price: { type: Number, require: true },
        image: { type: String, require: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
      },
    ],
    ShippingAddress: {
      fullName: { type: String, require: true },
      address: { type: String, require: true },
      city: { type: String, require: true },
      country: { type: String, require: true },
      phone: { type: Number, require: true },
    },
    paymentMethod: { type: String, require: true },
    ItemPrice: { type: Number, require: true },
    totalPrice: { type: Number, require: true },
    shippingPrice: { type: Number, require: true },
    taxiPrice: { type: Number, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
