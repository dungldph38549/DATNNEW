import mongoose from "mongoose";

const ChatLieuSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  ngay_tao: { type: Date, default: Date.now },
  ngay_cap_nhat: { type: Date, default: Date.now },
  trang_thai: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("ChatLieu", ChatLieuSchema);