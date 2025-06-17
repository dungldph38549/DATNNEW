import mongoose from "mongoose";

const GioHangSchema = new mongoose.Schema({
  khach_hang_id: { type: mongoose.Schema.Types.ObjectId, ref: "KhachHang" },
  ngay_tao: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"] },
});

export default mongoose.model("GioHang", GioHangSchema);