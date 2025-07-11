import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-[8rem] font-extrabold text-blue-600 drop-shadow-lg">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Trang không tồn tại</h2>
        <p className="text-gray-600 mb-6">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-lg"
        >
          🔙 Quay về trang chủ
        </Link>
      </div>
    </div>
    );
};

export default NotFoundPage;
