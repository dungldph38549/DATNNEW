const mongoose = require("mongoose");
const replySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxLength: 500,
      required: [true, "Sản phẩm không được để trống"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Sản phẩm không được để trống"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Người dùng không được để trống"],
    },
    rating: {
      type: Number,
      required: [true, "Vui lòng đánh giá sản phẩm (1 đến 5 sao)"],
      min: [1, "Số sao tối thiểu là 1"],
      max: [5, "Số sao tối đa là 5"],
    },
    content: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || v.length <= 500;
        },
        message: "Nội dung đánh giá không được vượt quá 500 ký tự",
      },
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
