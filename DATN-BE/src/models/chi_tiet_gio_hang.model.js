import mongoose from "mongoose";

const ChiTietGioHangSchema = new mongoose.Schema({
  gio_hang_id: { type: mongoose.Schema.Types.ObjectId, ref: "GioHang" },
  chi_tiet_san_pham_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChiTietSanPham" },
  so_luong: Number,
});

export default mongoose.model("ChiTietGioHang", ChiTietGioHangSchema);