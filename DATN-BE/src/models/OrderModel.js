const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
    },
    totalAmount: Number,
    status: { type: String, default: "Pending" }, // Pending | Confirmed | Shipping | Delivered | Cancelled
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
