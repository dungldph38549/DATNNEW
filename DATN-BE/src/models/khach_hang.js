import mongoose from "mongoose";

const KhachHangSchema = new mongoose.Schema({
  ho_ten: String,
  email: String,
  sdt: String,
  gioi_tinh: String,
  ngay_sinh: Date,
  mat_khau: String,
  ngay_tao: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("KhachHang", KhachHangSchema);