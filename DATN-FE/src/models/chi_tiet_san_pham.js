import mongoose from "mongoose";

const ChiTietSanPhamSchema = new mongoose.Schema({
  san_pham_id: { type: mongoose.Schema.Types.ObjectId, ref: "SanPham" },
  kich_thuoc_id: { type: mongoose.Schema.Types.ObjectId, ref: "KichThuoc" },
  chat_lieu_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChatLieu" },
  so_luong: Number,
  gia_ban: Number,
  ngay_tao: { type: Date, default: Date.now },
  ngay_cap_nhat: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("ChiTietSanPham", ChiTietSanPhamSchema);