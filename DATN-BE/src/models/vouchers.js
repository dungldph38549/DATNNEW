const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên voucher là bắt buộc"],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Mã voucher là bắt buộc"],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9]+$/, "Mã voucher chỉ được chứa các ký tự từ A-Z và số từ 0-9"],
  },
  value: {
    type: Number,
    required: [true, "Giá trị giảm giá là bắt buộc"],
    min: [0, "Giá trị không được âm"],
  },
  type: {
    type: String,
    enum: {
      values: ["percentage", "fixed"],
      message: "Loại giảm giá phải là 'percentage' hoặc 'fixed'",
    },
    required: [true, "Loại giảm giá là bắt buộc"],
  },
  startDate: {
    type: Date,
    required: [true, "Ngày bắt đầu là bắt buộc"],
  },
  endDate: {
    type: Date,
    required: [true, "Ngày kết thúc là bắt buộc"],
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive"],
      message: "Trạng thái phải là 'active' hoặc 'inactive'",
    },
    default: "inactive",
  },
  count: {
    type: Number,
    default: 0,
    min: [0, "Số lượng không được âm"],
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, "Số lần sử dụng không được âm"],
  },
}, {
  timestamps: true,
});

VoucherSchema.pre("validate", function (next) {
  // Check thời gian
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    return next(new Error("Ngày bắt đầu phải trước ngày kết thúc."));
  }

  // Check value theo type
  if (this.type === "percentage" && this.value > 100) {
    return next(new Error("Giá trị phần trăm không được vượt quá 100%."));
  }

  if (this.type === "percentage" && this.value < 1) {
    return next(new Error("Giá trị phần trăm tối thiểu là 1%."));
  }

  if (this.type === "fixed" && this.value < 1000) {
    return next(new Error("Giá trị giảm giá cố định tối thiểu là 1.000 VNĐ."));
  }

  // Check count và usedCount
  if (this.count > 0 && this.usedCount > this.count) {
    return next(new Error("Số lần sử dụng đã vượt quá số lượng cho phép."));
  }

  next();
});

// Phương thức kiểm tra khả dụng (cho người dùng)
VoucherSchema.methods.isUsable = function () {
  const now = new Date();
  return (
    this.status === "active" &&
    now >= this.startDate &&
    now <= this.endDate &&
    this.usedCount < this.count &&
    this.count > 0
  );
};

const Voucher = mongoose.model("Voucher", VoucherSchema);
module.exports = Voucher;

