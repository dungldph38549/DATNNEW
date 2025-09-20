import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Order from "./Order";
import Products from "./Products";
import Categories from "./Categories";
import Brands from "./Brands";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Vouchers from "./Vouchers";
import OrderReturn from "./OrderReturn";
import Comments from "./Comments"; // Import component Comments mới
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../redux/user";

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleMenuClick = (menu) => {
    if (user.isAdmin && user.login) {
      setSelectedMenu(menu);
      // Auto collapse sidebar on mobile after selection
      if (isMobile) {
        setSidebarCollapsed(true);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.login && !user.isAdmin) {
      navigate("/");
      return;
    }

    if (!user.login || !user.isAdmin) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const menuItems = [
    {
      key: "dashboard",
      icon: "📊",
      label: "Dashboard",
      title: "Dashboard Analytics",
      description: "Tổng quan về hiệu suất kinh doanh",
    },
    {
      key: "products",
      icon: "📦",
      label: "Sản phẩm",
      title: "Quản lý sản phẩm",
      description: "Thêm, sửa, xóa sản phẩm",
    },
    {
      key: "orders",
      icon: "🛒",
      label: "Đơn hàng",
      title: "Quản lý đơn hàng",
      description: "Theo dõi và xử lý đơn hàng",
    },
    {
      key: "users",
      icon: "👥",
      label: "Người dùng",
      title: "Quản lý người dùng",
      description: "Quản lý tài khoản khách hàng",
    },
    {
      key: "vouchers",
      icon: "🎫",
      label: "Voucher",
      title: "Quản lý voucher",
      description: "Tạo và quản lý mã giảm giá",
    },
    {
      key: "categories",
      icon: "📂",
      label: "Danh mục",
      title: "Quản lý danh mục",
      description: "Phân loại sản phẩm",
    },
    {
      key: "brands",
      icon: "🏷️",
      label: "Thương hiệu",
      title: "Quản lý thương hiệu",
      description: "Quản lý các nhãn hiệu",
    },
    {
      key: "order-returns",
      icon: "↩️",
      label: "Hoàn Hàng",
      title: "Yêu cầu hoàn hàng",
      description: "Xử lý yêu cầu hoàn trả hàng",
    },
    {
      key: "comments",
      icon: "⭐",
      label: "Đánh giá",
      title: "Quản lý đánh giá",
      description: "Quản lý và phản hồi đánh giá sản phẩm",
    },
  ];

  const currentMenuItem = menuItems.find((item) => item.key === selectedMenu);

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
      case "order-returns":
        return <OrderReturn />;
      case "comments":
        return <Comments />; // Thêm case mới cho Comments
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="text-6xl mb-4 opacity-50">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chọn mục để bắt đầu
            </h3>
            <p className="text-gray-500">
              Sử dụng menu bên trái để điều hướng đến các chức năng quản trị
            </p>
          </div>
        );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Đang kiểm tra quyền truy cập
          </h3>
          <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex relative min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile ? "fixed" : "relative"} ${
          sidebarCollapsed && isMobile ? "-translate-x-full" : "translate-x-0"
        } w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col">
          {/* Logo & Brand */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-3">
                  A
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-gray-500">Management System</p>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-3">
                {user.name?.charAt(0)?.toUpperCase() ||
                  user.email?.charAt(0)?.toUpperCase() ||
                  "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${
                    selectedMenu === item.key
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                      : "hover:bg-gray-50 text-gray-700 hover:text-blue-600 hover:translate-x-1"
                  }`}
                >
                  <span
                    className={`text-xl mr-3 transition-transform duration-200 ${
                      selectedMenu === item.key
                        ? "scale-110"
                        : "group-hover:scale-105"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <div
                      className={`font-medium ${
                        selectedMenu === item.key
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {item.label}
                    </div>
                    {selectedMenu === item.key && (
                      <div className="text-blue-100 text-xs mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {selectedMenu === item.key && (
                    <div className="w-1 h-6 bg-white rounded-full opacity-80"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Bottom Actions */}
            <div className="space-y-2">
              <Link
                to="/"
                className="w-full flex items-center p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all duration-200 group"
              >
                <span className="text-lg mr-3 group-hover:scale-105 transition-transform">
                  🌐
                </span>
                <span className="font-medium">Trang người dùng</span>
              </Link>

              <button
                onClick={() => {
                  dispatch(clearUser());
                  navigate("/login");
                }}
                className="w-full flex items-center p-3 rounded-xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-200 group"
              >
                <span className="text-lg mr-3 group-hover:scale-105 transition-transform">
                  🚪
                </span>
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-2xl mr-2">{currentMenuItem?.icon}</span>
                  {currentMenuItem?.title || selectedMenu}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {currentMenuItem?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4M5 7h14l-1 10H6L5 7z"
                  />
                </svg>
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-3.5-3.5L15 17zm-3-4V7a4 4 0 00-8 0v6h8z"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>

                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-0">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
