import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/user";
import { changeKeyword } from "../../redux/general";

const Hearder = () => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  const handleSearch = () => {
    dispatch(changeKeyword(search));
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div>
      {/* Top bar */}
      <div className="bg-[#0274be] text-white text-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-2 flex flex-wrap justify-end items-center space-x-2">
          {/* Nếu đã login thì hiện tên */}
          {user.login && (
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <Link
                to={user?.login ? "/profile" : "/login"}
                className="flex items-center gap-1"
              >
                👤 {user.name}
              </Link>
            </button>
          )}
          {user.isAdmin && (
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <Link to="/admin" className="flex items-center gap-1">
                🧑‍🔧 Admin page
              </Link>
            </button>
          )}
          <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
            <Link className="flex items-center gap-1" to="/cart">
              🛒 Giỏ hàng
            </Link>
          </button>
          <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
            <Link className="flex items-center gap-1" to="/orders">
              ✔ Đơn hàng
            </Link>
          </button>
          <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
            <Link className="flex items-center gap-1" to="/checkoutpage">
              ✔ Thanh toán
            </Link>
          </button>

          {!user.login ? (
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/login">
                🔒 Đăng nhập
              </Link>
            </button>
          ) : (
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <span className="flex items-center gap-1" onClick={handleLogout}>
                🔒 Đăng xuất
              </span>
            </button>
          )}

          {/* Nút menu trên điện thoại */}
          <button
            className="sm:hidden px-3 py-1 bg-white text-black rounded"
            onClick={() => setTopMenuOpen(!topMenuOpen)}
            aria-label="Toggle top menu"
          >
            ☰
          </button>
        </div>

        {/* Menu ẩn hiện trên điện thoại */}
        {topMenuOpen && (
          <div className="sm:hidden bg-[#0274be] text-white px-4 py-2 space-y-2 flex flex-col">
            {user.login && (
              <button className="transition duration-200 transform hover:scale-105">
                <span className="flex items-center gap-1">👤 {user.name}</span>
              </button>
            )}
            {user.isAdmin && (
              <button className="transition duration-200 transform hover:scale-105">
                <Link to="/admin" className="flex items-center gap-1">
                  🧑‍🔧 Admin page
                </Link>
              </button>
            )}
            <button className="transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/cart">
                🛒 Giỏ hàng
              </Link>
            </button>
            <button className="transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/orders">
                ✔ Đơn hàng
              </Link>
            </button>
            <button className="transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/checkoutpage">
                ✔ Thanh toán
              </Link>
            </button>

            {!user.login ? (
              <button className="transition duration-200 transform hover:scale-105">
                <Link className="flex items-center gap-1" to="/login">
                  🔒 Đăng nhập
                </Link>
              </button>
            ) : (
              <button className="transition duration-200 transform hover:scale-105">
                <span
                  className="flex items-center gap-1"
                  onClick={handleLogout}
                >
                  🔒 Đăng xuất
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Header */}
      <div className="bg-[#0274be] text-white pb-5">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between">
          {/* Logo */}
          <div className="text-3xl font-bold italic whitespace-nowrap">
            <a href="/">
              <span className="text-black">P</span>SG
            </a>
          </div>

          {/* Search bar */}
          <div className="flex flex-grow max-w-4xl mx-6 w-full sm:w-auto">
            <div className="flex border rounded overflow-hidden w-full bg-white h-12">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm..."
                className="flex-grow px-4 text-gray-800 outline-none text-sm sm:text-base"
              />
              <button
                className="bg-yellow-400 px-4 sm:px-6 text-black text-lg"
                onClick={handleSearch}
              >
                🔍
              </button>
            </div>
          </div>

          {/* Cart */}
          <button className="mt-3 sm:mt-0">
            <Link
              to="/cart"
              className="align-center relative bg-[#035fa0] rounded px-4 py-2 flex items-center text-white text-sm font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              </svg>
              <span>Giỏ hàng</span>
            </Link>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#0f6cb2] text-white text-sm font-semibold">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          {/* Menu ngang */}
          <ul className="hidden sm:flex justify-center items-center space-x-1">
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              HOME
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              CLOTHING
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              ELECTRONICS
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              WATCHES
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              JEWELLERY
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              SHOES
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              KIDS &amp; GIRLS
            </li>
            <li className="relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer">
              PAGES
            </li>
            <li className="relative px-4 py-3 text-yellow-400 hover:bg-[#0865a4] cursor-pointer">
              TODAYS OFFER
            </li>
          </ul>

          {/* Nút menu trên điện thoại */}
          <button
            className="sm:hidden px-3 py-2"
            onClick={() => setNavMenuOpen(!navMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            ☰
          </button>
        </div>

        {/* Menu mobile */}
        {navMenuOpen && (
          <ul className="sm:hidden bg-[#0f6cb2] text-white text-sm space-y-2 px-4 py-3">
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">HOME</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">CLOTHING</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">
              ELECTRONICS
            </li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">WATCHES</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">
              JEWELLERY
            </li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">SHOES</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">
              KIDS &amp; GIRLS
            </li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">PAGES</li>
            <li className="py-2 text-yellow-400 hover:bg-[#0865a4] cursor-pointer">
              TODAYS OFFER
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Hearder;
