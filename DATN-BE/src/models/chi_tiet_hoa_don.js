import mongoose from "mongoose";

const ChiTietHoaDonSchema = new mongoose.Schema({
  hoa_don_id: { type: mongoose.Schema.Types.ObjectId, ref: "HoaDon" },
  chi_tiet_san_pham_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChiTietSanPham" },
  so_luong: Number,
  don_gia: Number,
});

export default mongoose.model("ChiTietHoaDon", ChiTietHoaDonSchema);