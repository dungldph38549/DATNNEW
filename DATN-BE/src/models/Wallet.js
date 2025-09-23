const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "VND",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastTransactionAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
walletSchema.index({ userId: 1 });

module.exports = mongoose.model("Wallet", walletSchema);
