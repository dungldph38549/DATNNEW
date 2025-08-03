const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Ảnh chính của sản phẩm là bắt buộc"],
      trim: true,
    },
    srcImages: [{ type: String, trim: true }],
    // type: { type: String, trim: true },
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá sản phẩm không được âm"],
    },
    countInStock: {
      type: Number,
      required: [true, "Số lượng tồn kho là bắt buộc"],
      min: [0, "Số lượng tồn kho không được âm"],
    },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    description: {
      type: String,
      required: [true, "Mô tả chi tiết là bắt buộc"],
      trim: true,
    },
    hasVariants: { type: Boolean, default: false },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    attributes: [{ type: String, trim: true }],
    variants: [
      {
        sku: {
          type: String,
          required: [true, "SKU của biến thể là bắt buộc"],
          uppercase: true,
          trim: true,
        },
        price: {
          type: Number,
          required: [true, "Giá biến thể là bắt buộc"],
          min: [0, "Giá biến thể không được âm"],
        },
        stock: {
          type: Number,
          default: 0,
          min: [0, "Số lượng biến thể không được âm"],
        },
        attributes: {
          type: Map,
          of: String,
          required: [true, "Thuộc tính của biến thể là bắt buộc"],
        },
        sold: { type: Number, default: 0 },
      },
    ],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("validate", async function (next) {
  const product = this;

  // ✅ Nếu có biến thể thì phải có ít nhất 1 variant
  if (product.hasVariants) {
    if (!product.variants || product.variants.length === 0) {
      return next(
        new Error("Sản phẩm có biến thể phải có ít nhất 1 biến thể.")
      );
    }

    // ✅ Kiểm tra tất cả biến thể có đúng các thuộc tính khai báo
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

    // ✅ Kiểm tra giá > 0
    const hasInvalidPrice = product.variants.some((v) => v.price <= 0);
    if (hasInvalidPrice) {
      return next(new Error("Tất cả biến thể phải có giá > 0."));
    }

    // ✅ Kiểm tra thuộc tính rỗng
    const hasEmptyAttr = product.variants.some((v) =>
      Array.from(v.attributes.values()).some((val) => !val || val.trim() === "")
    );
    if (hasEmptyAttr) {
      return next(new Error("Không được để thuộc tính của biến thể trống."));
    }

    // ✅ Kiểm tra SKU không trùng trong product
    const skuSet = new Set();
    for (const variant of product.variants) {
      if (skuSet.has(variant.sku)) {
        return next(
          new Error(`SKU "${variant.sku}" bị trùng trong cùng sản phẩm.`)
        );
      }
      skuSet.add(variant.sku);
    }
  }

  // ✅ Nếu không có biến thể, cần có price > 0 và countInStock > 0
  if (!product.hasVariants) {
    if (product.price <= 0) {
      return next(new Error("Sản phẩm không có biến thể phải có giá > 0."));
    }
    if (product.countInStock <= 0) {
      return next(
        new Error("Sản phẩm không có biến thể phải có số lượng tồn kho > 0.")
      );
    }
  }

  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
