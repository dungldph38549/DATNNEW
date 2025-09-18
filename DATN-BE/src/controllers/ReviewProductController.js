const Review = require("../models/review.js");
const { successResponse, errorResponse } = require("../utils/response.js");

exports.create = async (req, res) => {
  try {
    const { productId, userId, content, rating } = req.body;
    const newReview = await Review.create({
      productId,
      userId,
      content,
      rating,
    });
    successResponse({ res, data: newReview, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.reviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate("userId")
      .populate("replies.userId")
      .sort({ createdAt: -1 });
    successResponse({ res, data: reviews, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.repliesReview = async (req, res) => {
  try {
    const { content, userId, role, reviewId } = req.body;

    if (!content || !userId || !role) {
      return errorResponse({
        res,
        statusCode: 400,
        message: "Vui lồng nhập đầy đủ thống tin",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return errorResponse({
        res,
        statusCode: 400,
        message: "Vai trò không hợp lệ",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review)
      return errorResponse({
        res,
        statusCode: 404,
        message: "Không tìm thấy review này",
      });

    review.replies.push({ content, userId, role, createdAt: new Date() });

    await review.save();
    successResponse({ res, data: review, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};
