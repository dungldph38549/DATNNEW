import mongoose from "mongoose";

const DiaChiSchema = new mongoose.Schema({
  khach_hang_id: { type: mongoose.Schema.Types.ObjectId, ref: "KhachHang" },
  tinh: String,
  huyen: String,
  xa: String,
  so_nha: String,
  trang_thai: { type: String, enum: ["mac_dinh", "phu"] },
});

export default mongoose.model("DiaChi", DiaChiSchema);