import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Order from "./Order";
import Products from "./Products";
import Categories from "./Categories";
import Brands from "./Brands";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Vouchers from "./Vouchers";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../redux/user";

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Bỏ ": any"
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const handleMenuClick = (menu) => {
    // Bỏ ": string"
    if (user.isAdmin && user.login) {
      setSelectedMenu(menu);
    }
  };

  useEffect(() => {
    // Kiểm tra user state có tồn tại không
    if (!user) {
      navigate("/login");
      return;
    }

    // Nếu user đã login nhưng không phải admin
    if (user.login && !user.isAdmin) {
      navigate("/");
      return;
    }

    // Nếu chưa login hoặc không phải admin
    if (!user.login || !user.isAdmin) {
      navigate("/login");
      return;
    }
  }, [user, navigate]); // Thêm dependencies

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "orders":
        return <Order />;
      case "users":
        return <Users />;
      case "vouchers":
        return <Vouchers />;
      case "brands":
        return <Brands />;
      case "categories":
        return <Categories />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600 text-lg">
              📋 Chọn mục bên trái để xem nội dung
            </p>
          </div>
        );
    }
  };

  // Loading state nếu user chưa được load
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="fixed w-64 h-full bg-white z-10">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Admin Panel
            </h2>

            {/* User info */}
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Xin chào,</p>
              <p className="font-semibold text-blue-600">
                {user.name || user.email}
              </p>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => handleMenuClick("dashboard")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "dashboard"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => handleMenuClick("products")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "products"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                📦 Sản phẩm
              </button>

              <button
                onClick={() => handleMenuClick("orders")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "orders"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                🛒 Đơn hàng
              </button>

              <button
                onClick={() => handleMenuClick("users")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "users"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                👥 Người dùng
              </button>

              <button
                onClick={() => handleMenuClick("vouchers")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "vouchers"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                🎫 Voucher
              </button>

              <button
                onClick={() => handleMenuClick("categories")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "categories"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                📂 Danh mục
              </button>

              <button
                onClick={() => handleMenuClick("brands")}
                className={`flex items-center gap-3 text-left p-3 rounded-lg transition-colors ${
                  selectedMenu === "brands"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                🏷️ Thương hiệu
              </button>

              {/* Divider */}
              <div className="border-t my-4"></div>

              <Link
                to="/"
                className="flex items-center gap-3 text-left p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
              >
                🌐 Trang người dùng
              </Link>

              <button
                onClick={() => {
                  dispatch(clearUser());
                  navigate("/login");
                }}
                className="flex items-center gap-3 text-left p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors mt-2"
              >
                🚪 Đăng xuất
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {selectedMenu === "dashboard"
                  ? "Dashboard"
                  : selectedMenu === "products"
                  ? "Quản lý sản phẩm"
                  : selectedMenu === "orders"
                  ? "Quản lý đơn hàng"
                  : selectedMenu === "users"
                  ? "Quản lý người dùng"
                  : selectedMenu === "vouchers"
                  ? "Quản lý voucher"
                  : selectedMenu === "categories"
                  ? "Quản lý danh mục"
                  : selectedMenu === "brands"
                  ? "Quản lý thương hiệu"
                  : selectedMenu}
              </h1>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-200px)]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
