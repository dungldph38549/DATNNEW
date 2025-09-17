// src/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: String,
    address: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay", "bank_transfer"],
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["standard", "fast"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sku: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        attributes: {
          type: Object,
          default: {},
        },
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    voucherCode: String,
    shippingFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
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
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    internalNotes: [
      {
        note: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Indexes chỉ đặt ở đây, sau khi khai báo schema, trước khi export
orderSchema.index({ userId: 1 });
orderSchema.index({ guestId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "products.productId": 1 });

// Virtual: kiểm tra xem đơn hàng có thể trả hàng hay không
orderSchema.virtual("canReturn").get(function () {
  if (this.status !== "delivered") return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return this.updatedAt > sevenDaysAgo;
});

// Method: tính số tiền hoàn tối đa
orderSchema.methods.calculateMaxRefund = function () {
  return (
    this.totalAmount - (this.paymentMethod === "cod" ? this.shippingFee : 0)
  );
};

// Middleware: tự động set ngày trả hàng khi thay đổi status
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "return-request" && !this.returnRequestDate) {
      this.returnRequestDate = new Date();
    }
    if (
      ["accepted", "rejected"].includes(this.status) &&
      !this.returnProcessedDate
    ) {
      this.returnProcessedDate = new Date();
    }
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
