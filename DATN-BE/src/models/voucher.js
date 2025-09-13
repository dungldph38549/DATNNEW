import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
  ten: String,
  ma: String,
  gia_tri: Number,
  loai: String,
  ngay_bat_dau: Date,
  ngay_ket_thuc: Date,
  trang_thai: { type: String, enum: ["active", "inactive"] },
});

export default mongoose.model("Voucher", VoucherSchema);