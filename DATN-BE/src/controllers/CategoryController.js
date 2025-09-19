const Category = require("../models/Categories.js");
const { successResponse, errorResponse } = require("../utils/response.js");

exports.create = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    successResponse({ res, data: newCategory, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" });
    return successResponse({ res, data: categories });
  } catch (err) {
    return errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    successResponse({ res, data: category });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, status, id, image } = req.body;
    if (!id) {
      return errorResponse({
        res,
        message: "ID danh mục không hợp lệ",
        statusCode: 422,
      });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, status, image },
      { new: true, runValidators: true }
    );
    successResponse({ res, data: category });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.delete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse({
        res,
        message: "Danh sách ID không hợp lệ",
        statusCode: 422,
      });
    }
    const result = await Category.deleteMany({ _id: { $in: ids } });

    successResponse({ res, data: result, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};
