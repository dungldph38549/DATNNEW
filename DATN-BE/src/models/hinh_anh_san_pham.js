import mongoose from "mongoose";

const HinhAnhSanPhamSchema = new mongoose.Schema({
  chi_tiet_san_pham_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChiTietSanPham" },
  duong_dan: String,
  ngay_tao: { type: Date, default: Date.now },
  ngay_cap_nhat: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("HinhAnhSanPham", HinhAnhSanPhamSchema);