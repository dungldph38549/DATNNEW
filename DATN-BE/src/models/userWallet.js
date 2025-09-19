const mongoose = require("mongoose");

const userWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ✅ đã đủ, không cần index thêm
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["refund", "withdrawal", "deposit"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          required: function () {
            return this.type === "refund";
          },
        },
        description: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["completed", "pending", "failed"],
          default: "completed",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userWalletSchema.index({ "transactions.createdAt": -1 });

// Method to add money to wallet
userWalletSchema.methods.addMoney = async function (
  amount,
  type,
  description,
  orderId = null
) {
  this.balance += amount;
  this.transactions.push({
    type,
    amount,
    orderId,
    description,
    status: "completed",
  });
  await this.save();
};

// Method to subtract money from wallet
userWalletSchema.methods.subtractMoney = async function (
  amount,
  type,
  description,
  orderId = null
) {
  if (this.balance < amount) {
    throw new Error("Insufficient balance");
  }
  this.balance -= amount;
  this.transactions.push({
    type,
    amount: -amount,
    orderId,
    description,
    status: "completed",
  });
  await this.save();
};

module.exports = mongoose.model("UserWallet", userWalletSchema);
