const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên thương hiệu là bắt buộc"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Ảnh thương hiệu là bắt buộc"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Trạng thái phải là 'active' hoặc 'inactive'",
      },
      default: "active",
      required: [true, "Trạng thái là bắt buộc"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
