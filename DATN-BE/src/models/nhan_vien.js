import mongoose from "mongoose";

const NhanVienSchema = new mongoose.Schema({
  ho_ten: String,
  email: String,
  sdt: String,
  gioi_tinh: String,
  ngay_sinh: Date,
  hinh_anh: String,
  mat_khau: String,
  chuc_vu: String,
  ngay_tao: { type: Date, default: Date.now },
  ngay_cap_nhat: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"] },
});

export default mongoose.model("NhanVien", NhanVienSchema);