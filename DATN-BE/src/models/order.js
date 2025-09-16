const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestId: {
      type: String,
      required: false,
    },
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
        sku: {
          type: String,
          required: false,
        },
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
    voucherCode: {
      type: String,
      required: false,
    },
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
    // NEW FIELDS FOR RETURN FLOW
    refundAmount: {
      type: Number,
      required: false,
      min: 0,
    },
    returnReason: {
      type: String,
      required: false,
    },
    returnRequestDate: {
      type: Date,
      required: false,
    },
    returnProcessedDate: {
      type: Date,
      required: false,
    },
    returnProcessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    adminNotes: [
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
  {
    timestamps: true,
  }
);

// Index for better performance
orderSchema.index({ userId: 1 });
orderSchema.index({ guestId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "products.productId": 1 });

// Virtual for return eligibility
orderSchema.virtual("canReturn").get(function () {
  if (this.status !== "delivered") return false;

  // Check if within 7 days of delivery
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return this.updatedAt > sevenDaysAgo;
});

// Method to calculate refund eligibility
orderSchema.methods.calculateMaxRefund = function () {
  // Can refund up to total amount minus shipping fee for certain cases
  return (
    this.totalAmount - (this.paymentMethod === "cod" ? this.shippingFee : 0)
  );
};

// Pre-save middleware to set return dates
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
