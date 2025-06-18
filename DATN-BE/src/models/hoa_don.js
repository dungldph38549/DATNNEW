import mongoose from "mongoose";

const HoaDonSchema = new mongoose.Schema({
  khach_hang_id: { type: mongoose.Schema.Types.ObjectId, ref: "KhachHang" },
  nhan_vien_id: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  phuong_thuc_thanh_toan: String,
  tong_tien: Number,
  phi_van_chuyen: Number,
  giam_gia: Number,
  ngay_tao: { type: Date, default: Date.now },
  dia_chi: String,
  so_dien_thoai: String,
  trang_thai: { type: String, enum: ["cho_xac_nhan", "dang_giao", "da_giao"] },
});

export default mongoose.model("HoaDon", HoaDonSchema);