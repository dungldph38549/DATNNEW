import mongoose from "mongoose";

const ChuongTrinhKhuyenMaiSchema = new mongoose.Schema({
  ten: String,
  mo_ta: String,
  phan_tram_giam: Number,
  ngay_bat_dau: Date,
  ngay_ket_thuc: Date,
  trang_thai: { type: String, enum: ["active", "inactive"] },
});

export default mongoose.model("ChuongTrinhKhuyenMai", ChuongTrinhKhuyenMaiSchema);