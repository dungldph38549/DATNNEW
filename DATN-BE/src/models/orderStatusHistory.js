const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
  {
    oldStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "canceled",
        "return-request",
        "accepted",
        "rejected",
      ],
    },
    newStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "canceled",
        "return-request",
        "accepted",
        "rejected",
      ],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    image: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderStatusHistory", orderStatusHistorySchema);
