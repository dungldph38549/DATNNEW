import mongoose from "mongoose";

const SanPhamSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  mo_ta: String,
  thuong_hieu_id: { type: mongoose.Schema.Types.ObjectId, ref: "ThuongHieu" },
  loai_san_pham_id: { type: mongoose.Schema.Types.ObjectId, ref: "LoaiSanPham" },
  ngay_tao: { type: Date, default: Date.now },
  ngay_cap_nhat: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("SanPham", SanPhamSchema);