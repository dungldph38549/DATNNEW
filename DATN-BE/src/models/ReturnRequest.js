const mongoose = require("mongoose");

const returnRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: String,
    returnReason: {
      type: String,
      required: true,
      enum: [
        "defective_product", // Sản phẩm lỗi
        "wrong_item", // Giao sai sản phẩm
        "damaged_shipping", // Hư hại trong vận chuyển
        "not_as_described", // Không đúng mô tả
        "changed_mind", // Đổi ý
        "size_issue", // Vấn đề về kích cỡ
        "other", // Khác
      ],
    },
    returnDescription: String,
    returnImages: [
      {
        type: String, // URLs của ảnh chứng minh
      },
    ],
    requestDate: {
      type: Date,
      default: Date.now,
    },
    processDate: Date,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    adminNote: String,
    refundAmount: Number,
    refundMethod: {
      type: String,
      enum: ["original_payment", "store_credit", "bank_transfer"],
    },
    refundStatus: {
      type: String,
      enum: ["pending", "processed", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
