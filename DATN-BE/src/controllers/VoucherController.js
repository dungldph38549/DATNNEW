const Voucher = require("../models/vouchers.js");
const { successResponse, errorResponse } = require("../utils/response.js");

// ✅ Admin - Tạo voucher
exports.create = async (req, res) => {
  try {
    const voucher = new Voucher(req.body);
    await voucher.save();
    return successResponse({ res, data: voucher, statusCode: 201 });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

// ✅ Admin - Cập nhật voucher
exports.update = async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    delete req.body.code;
    const updated = await Voucher.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated)
      return errorResponse({
        res,
        message: "Voucher không tồn tại",
        statusCode: 404,
      });
    return successResponse({ res, data: updated });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

// ✅ Admin - Xoá voucher
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
    const deleted = await Voucher.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Voucher không tồn tại" });
    return successResponse({ res, data: deleted });
  } catch (err) {
    return errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

// ✅ Admin - Lấy tất cả voucher (lọc, phân trang)
exports.getAll = async (req, res) => {
  try {
    const { status, code, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (code) query.code = new RegExp(code, "i");

    const vouchers = await Voucher.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return successResponse({ res, data: vouchers });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);
    if (!voucher)
      return errorResponse({
        res,
        message: "Voucher không tồn tại",
        statusCode: 404,
      });
    return successResponse({ res, data: voucher });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

// ✅ User - Lấy danh sách voucher đang hoạt động
exports.getActiveVouchers = async (req, res) => {
  try {
    const now = new Date();
    const vouchers = await Voucher.find({
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
      $expr: { $lt: ["$usedCount", "$count"] },
    }).sort({ createdAt: -1 });

    return successResponse({ res, data: vouchers });
  } catch (err) {
    errorResponse({ res, message: err.message, statusCode: 500 });
  }
};

// ✅ User - Kiểm tra mã voucher hợp lệ
exports.checkVoucherCode = async (req, res) => {
  try {
    const { code } = req.params;
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });

    if (!voucher) return res.status(404).json({ message: "Mã không tồn tại" });
    if (!voucher.isUsable()) {
      return res.status(400).json({ message: "Mã không còn hiệu lực" });
    }
    return successResponse({ res, data: voucher, message: "Mã hợp lệ" });
  } catch (err) {
    return errorResponse({ res, message: err.message, statusCode: 500 });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> dfcd3bfbe0d4fea861c27d8827345ccc5ef598c2
