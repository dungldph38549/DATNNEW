const mongoose = require("mongoose");

const inventoryHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["in", "out", "adjustment", "return"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  variantSku: {
    type: String,
    trim: true,
  },
});

const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, "SKU của biến thể là bắt buộc"],
    uppercase: true,
    trim: true,
    unique: true, // Global unique SKU
    index: true,
  },
  barcode: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // Allow null values but unique if provided
    index: true,
  },
  price: {
    type: Number,
    required: [true, "Giá biến thể là bắt buộc"],
    min: [0, "Giá biến thể không được âm"],
  },
  costPrice: {
    type: Number,
    min: [0, "Giá vốn không được âm"],
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Số lượng biến thể không được âm"],
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, "Ngưỡng cảnh báo không được âm"],
  },
  attributes: {
    type: Map,
    of: String,
    required: [true, "Thuộc tính của biến thể là bắt buộc"],
  },
  sold: {
    type: Number,
    default: 0,
    min: [0, "Số lượng đã bán không được âm"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
      trim: true,
    },
  ], // Specific images for this variant
  weight: {
    type: Number,
    min: [0, "Khối lượng không được âm"],
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  inventoryHistory: [inventoryHistorySchema],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: String,
      required: [true, "Ảnh chính của sản phẩm là bắt buộc"],
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ], // Additional product images
    price: {
      type: Number,
      required: function () {
        return !this.hasVariants;
      },
      min: [0, "Giá sản phẩm không được âm"],
    },
    costPrice: {
      type: Number,
      min: [0, "Giá vốn không được âm"],
      default: 0,
    },
    stock: {
      type: Number,
      required: function () {
        return !this.hasVariants;
      },
      min: [0, "Số lượng tồn kho không được âm"],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Ngưỡng cảnh báo không được âm"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "Số lượng đã bán không được âm"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Đánh giá không được âm"],
      max: [5, "Đánh giá không được vượt quá 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, "Số lượng đánh giá không được âm"],
    },
    description: {
      type: String,
      required: [true, "Mô tả chi tiết là bắt buộc"],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxLength: [500, "Mô tả ngắn không được vượt quá 500 ký tự"],
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Thương hiệu là bắt buộc"],
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục là bắt buộc"],
      index: true,
    },
    attributes: [
      {
        type: String,
        trim: true,
      },
    ], // Available attribute keys (e.g., ["Size", "Color"])
    variants: [variantSchema],

    // PSG Store specific fields
    playerName: {
      type: String,
      trim: true,
      index: true, // For PSG jerseys
    },
    season: {
      type: String,
      trim: true,
      index: true, // e.g., "2023-24", "2024-25"
    },
    isLimited: {
      type: Boolean,
      default: false,
    },

    // SEO and Marketing
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Product status
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "discontinued"],
      default: "active",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Inventory tracking
    inventoryHistory: [inventoryHistorySchema],

    // Supplier information
    supplier: {
      name: String,
      contact: String,
      email: String,
    },

    // Physical properties
    weight: {
      type: Number,
      min: [0, "Khối lượng không được âm"],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    // Dates
    releaseDate: {
      type: Date,
      index: true,
    },
    discontinueDate: {
      type: Date,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ brandId: 1, categoryId: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ rating: -1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1, isActive: 1 });

// Virtual fields
productSchema.virtual("totalStock").get(function () {
  if (this.hasVariants) {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
});

productSchema.virtual("isLowStock").get(function () {
  if (this.hasVariants) {
    return this.variants.some(
      (variant) =>
        variant.stock <= variant.lowStockThreshold && variant.isActive
    );
  }
  return this.stock <= this.lowStockThreshold;
});

productSchema.virtual("isOutOfStock").get(function () {
  if (this.hasVariants) {
    return this.variants.every(
      (variant) => variant.stock === 0 || !variant.isActive
    );
  }
  return this.stock === 0;
});

productSchema.virtual("priceRange").get(function () {
  if (this.hasVariants && this.variants.length > 0) {
    const activePrices = this.variants
      .filter((v) => v.isActive)
      .map((v) => v.price);

    if (activePrices.length === 0) return null;

    const min = Math.min(...activePrices);
    const max = Math.max(...activePrices);

    return { min, max };
  }
  return { min: this.price, max: this.price };
});

// Pre-save middleware for slug generation
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");

    // Add random suffix if needed for uniqueness
    if (this.isNew) {
      this.slug += `-${Date.now()}`;
    }
  }
  next();
});

// Validation middleware
productSchema.pre("validate", async function (next) {
  const product = this;

  // Validate variants if hasVariants is true
  if (product.hasVariants) {
    if (!product.variants || product.variants.length === 0) {
      return next(
        new Error("Sản phẩm có biến thể phải có ít nhất 1 biến thể.")
      );
    }

    // Check all variants have required attributes
    const expectedAttrs = product.attributes || [];
    const hasMismatch = product.variants.some((variant) => {
      if (!variant.attributes) return true;
      const keys = Array.from(variant.attributes.keys());
      if (keys.length !== expectedAttrs.length) return true;
      return !expectedAttrs.every((key) => keys.includes(key));
    });

    if (hasMismatch) {
      return next(
        new Error(
          `Tất cả biến thể phải có đầy đủ các thuộc tính: [${expectedAttrs.join(
            ", "
          )}]`
        )
      );
    }

    // Validate variant prices
    const hasInvalidPrice = product.variants.some((v) => v.price <= 0);
    if (hasInvalidPrice) {
      return next(new Error("Tất cả biến thể phải có giá > 0."));
    }

    // Check empty attributes
    const hasEmptyAttr = product.variants.some((v) =>
      Array.from(v.attributes.values()).some((val) => !val || val.trim() === "")
    );
    if (hasEmptyAttr) {
      return next(new Error("Không được để thuộc tính của biến thể trống."));
    }

    // Check SKU uniqueness within product
    const skuSet = new Set();
    for (const variant of product.variants) {
      if (skuSet.has(variant.sku)) {
        return next(
          new Error(`SKU "${variant.sku}" bị trùng trong cùng sản phẩm.`)
        );
      }
      skuSet.add(variant.sku);
    }
  } else {
    // Validate simple product
    if (!product.price || product.price <= 0) {
      return next(new Error("Sản phẩm không có biến thể phải có giá > 0."));
    }
    if (product.stock < 0) {
      return next(new Error("Số lượng tồn kho không được âm."));
    }
  }

  next();
});

// Methods to update inventory
productSchema.methods.updateInventory = function (
  type,
  quantity,
  reason,
  userId,
  orderId,
  variantSku
) {
  const historyEntry = {
    date: new Date(),
    type,
    quantity,
    reason,
    userId,
    orderId,
    variantSku,
  };

  if (variantSku) {
    // Update variant inventory
    const variant = this.variants.find((v) => v.sku === variantSku);
    if (!variant) {
      throw new Error(`Variant with SKU ${variantSku} not found`);
    }

    historyEntry.previousStock = variant.stock;

    if (type === "in") {
      variant.stock += quantity;
    } else if (type === "out") {
      variant.stock = Math.max(0, variant.stock - quantity);
    } else if (type === "adjustment") {
      variant.stock = quantity;
    }

    historyEntry.newStock = variant.stock;
    variant.inventoryHistory.push(historyEntry);
  } else {
    // Update simple product inventory
    historyEntry.previousStock = this.stock;

    if (type === "in") {
      this.stock += quantity;
    } else if (type === "out") {
      this.stock = Math.max(0, this.stock - quantity);
    } else if (type === "adjustment") {
      this.stock = quantity;
    }

    historyEntry.newStock = this.stock;
    this.inventoryHistory.push(historyEntry);
  }

  return this.save();
};

// Static methods
productSchema.statics.findLowStock = function () {
  return this.find({
    $or: [
      {
        hasVariants: false,
        $expr: { $lte: ["$stock", "$lowStockThreshold"] },
      },
      {
        hasVariants: true,
        variants: {
          $elemMatch: {
            isActive: true,
            $expr: { $lte: ["$stock", "$lowStockThreshold"] },
          },
        },
      },
    ],
    isActive: true,
    deletedAt: null,
  });
};

productSchema.statics.findOutOfStock = function () {
  return this.find({
    $or: [
      {
        hasVariants: false,
        stock: 0,
      },
      {
        hasVariants: true,
        variants: {
          $not: {
            $elemMatch: {
              isActive: true,
              stock: { $gt: 0 },
            },
          },
        },
      },
    ],
    isActive: true,
    deletedAt: null,
  });
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
