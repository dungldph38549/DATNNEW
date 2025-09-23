const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["refund", "payment", "deposit", "withdrawal", "bonus"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    description: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String, // Order ID hoặc reference khác
      required: false,
    },
    referenceType: {
      type: String,
      enum: ["order", "return", "deposit", "withdrawal", "bonus"],
      required: false,
    },
    metadata: {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      returnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderStatusHistory",
      },
      adminNote: String,
      refundReason: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
walletTransactionSchema.index({ walletId: 1, createdAt: -1 });
walletTransactionSchema.index({ userId: 1, type: 1 });
walletTransactionSchema.index({ referenceId: 1, referenceType: 1 });

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
