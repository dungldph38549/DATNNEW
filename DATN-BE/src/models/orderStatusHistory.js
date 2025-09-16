// models/orderStatusHistory.js
const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
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
      required: false,
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
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "unpaid"],
      required: false,
    },
    note: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    // NEW FIELDS FOR RETURN FLOW
    refundAmount: {
      type: Number,
      required: false,
      min: 0,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    adminNote: {
      type: String,
      required: false,
      maxlength: 500,
    },
    returnReason: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    // Metadata for tracking
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      enum: ["admin", "customer", "system", "api"],
      default: "system",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
orderStatusHistorySchema.index({ orderId: 1 });
orderStatusHistorySchema.index({ orderId: 1, createdAt: -1 });
orderStatusHistorySchema.index({ newStatus: 1 });
orderStatusHistorySchema.index({ processedBy: 1 });
orderStatusHistorySchema.index({ createdAt: -1 });

// Virtual for status transition description
orderStatusHistorySchema.virtual("transitionDescription").get(function () {
  const statusLabels = {
    pending: "Đang xử lý",
    confirmed: "Đã xác nhận",
    shipped: "Đang giao",
    delivered: "Đã giao",
    canceled: "Đã hủy",
    "return-request": "Yêu cầu hoàn hàng",
    accepted: "Chấp nhận hoàn hàng",
    rejected: "Từ chối hoàn hàng",
  };

  if (this.oldStatus && this.newStatus) {
    return `${statusLabels[this.oldStatus]} → ${statusLabels[this.newStatus]}`;
  }
  return statusLabels[this.newStatus] || this.newStatus;
});

// Static method to get order history
orderStatusHistorySchema.statics.getOrderTimeline = async function (orderId) {
  return this.find({ orderId })
    .populate("processedBy", "name email")
    .sort({ createdAt: 1 })
    .exec();
};

// Static method to get return history specifically
orderStatusHistorySchema.statics.getReturnHistory = async function (orderId) {
  return this.find({
    orderId,
    $or: [
      { newStatus: "return-request" },
      { oldStatus: "return-request" },
      { newStatus: { $in: ["accepted", "rejected"] } },
    ],
  })
    .populate("processedBy", "name email")
    .sort({ createdAt: -1 })
    .exec();
};

// Method to check if this is a return-related status change
orderStatusHistorySchema.methods.isReturnRelated = function () {
  const returnStatuses = ["return-request", "accepted", "rejected"];
  return (
    returnStatuses.includes(this.newStatus) ||
    returnStatuses.includes(this.oldStatus)
  );
};

// Pre-save middleware to validate status transitions
orderStatusHistorySchema.pre("save", function (next) {
  if (this.newStatus === "accepted" && (!this.refundAmount || this.refundAmount <= 0)) {
    return next(new Error("Refund amount is required when accepting return"));
  }

  if (this.newStatus === "rejected" && !this.note) {
    return next(new Error("Note is required when rejecting return"));
  }

  next();
});

module.exports = mongoose.model("OrderStatusHistory", orderStatusHistorySchema);
