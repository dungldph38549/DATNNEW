import mongoose from "mongoose";

const ChiTietVoucherSchema = new mongoose.Schema({
  voucher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
  khach_hang_id: { type: mongoose.Schema.Types.ObjectId, ref: "KhachHang" },
  trang_thai: { type: String, enum: ["used", "unused"] },
});

export default mongoose.model("ChiTietVoucher", ChiTietVoucherSchema);