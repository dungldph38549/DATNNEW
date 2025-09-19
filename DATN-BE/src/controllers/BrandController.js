const Brand = require("../models/Brands.js");
const { successResponse, errorResponse } = require("../utils/response.js");

exports.create = async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    successResponse({ res, data: newBrand, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.getAll = async (req, res) => {
<<<<<<< HEAD
    try {
        const brands =  await Brand.find({ status: 'active' });
        return successResponse({ res, data: brands });
    } catch (err) {
        return errorResponse({ res, message: err.message, statusCode: 500 });
    }
=======
  try {
    const brands = await Brand.find({ status: "active" });
    return successResponse({ res, data: brands });
  } catch (err) {
    return errorResponse({ res, message: err.message, statusCode: 500 });
  }
>>>>>>> dfcd3bfbe0d4fea861c27d8827345ccc5ef598c2
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    successResponse({ res, data: brand });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return errorResponse({
        res,
        message: "ID không hợp lệ",
        statusCode: 422,
      });
    }
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    successResponse({ res, data: brand });
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
    const result = await Brand.deleteMany({ _id: { $in: ids } });

    successResponse({ res, data: result });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};
