const mongoose = require("mongoose");

const inventoryTransactionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["in", "out", "adjust"],
      required: true,
    },
    sku: {
      type: String, // For variant products
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
    },
    beforeStock: {
      type: Number,
      required: true,
    },
    afterStock: {
      type: Number,
      required: true,
    },
    priceChange: {
      oldPrice: Number,
      newPrice: Number,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "restock",
        "sale",
        "damage",
        "lost",
        "return",
        "adjustment",
        "initial",
      ],
    },
    note: String,
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    batchInfo: {
      batchNumber: String,
      expiryDate: Date,
      supplier: String,
      unitCost: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
inventoryTransactionSchema.index({ productId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ staffId: 1, createdAt: -1 });
inventoryTransactionSchema.index({ type: 1, reason: 1 });

module.exports = mongoose.model(
  "InventoryTransaction",
  inventoryTransactionSchema
);
