import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../redux/user';

const Hearder = () => {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [topMenuOpen, setTopMenuOpen] = useState(false)
  const [navMenuOpen, setNavMenuOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)

  const menu = [
    {
      name: 'Trang chủ',
      link: '/'
    },
    {
      name: 'CLOTHING',
      link: '/1'
    },
    {
      name: 'ELECTRONICS',
      link: '/2'
    },
    {
      name: 'WATCHES',
      link: '/3'
    },
    {
      name: 'JEWELLERY',
      link: '/4'
    },
    {
      name: 'SHOES',
      link: '/5'
    },
    {
      name: 'KIDS &amp; GIRLS',
      link: '/6'
    },
    {
      name: 'PAGES',
      link: '/7'
    },
  ]

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  }
  return (
    <div>
      <div>
        {/* Top bar */}
        <div className="bg-[#0274be] text-white text-sm">
          <div className="max-w-screen-xl mx-auto px-6 py-2 flex flex-wrap justify-end items-center space-x-2">
            {/* Dropdown tiền tệ, ngôn ngữ - ẩn trên điện thoại */}
            {/* <div className="relative group hidden sm:block">
              <button className="bg-[#0274be] text-white px-2 py-1 rounded">
                USD ▼
              </button>
              <div className="absolute right-0 mt-1 w-20 bg-white text-black rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">USD</div>
                <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">VND</div>
              </div>
            </div>

            <div className="relative group hidden sm:block">
              <button className="bg-[#0274be] text-white px-2 py-1 rounded">
                English ▼
              </button>
              <div className="absolute right-0 mt-1 w-20 bg-white text-black rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
                <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">Tiếng Việt</div>
                <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">Franch</div>
              </div>
            </div> */}

            {/* Các nút ẩn trên điện thoại */}
            { user.isAdmin &&
              <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
                <Link to="/admin" className="flex items-center gap-1"> Admin page</Link >
              </button>
            }
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <span className="flex items-center gap-1">👤 Tài khoản</span>
            </button>
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <span className="flex items-center gap-1">💙 Sản phẩm yêu thích</span>
            </button>
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/cart" >🛒 Giỏ hàng</Link>
            </button>
            <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/orders">✔ Đơn hàng</Link>
            </button>
             <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
              <Link className="flex items-center gap-1" to="/checkoutpage">✔ Thanh toán</Link>
            </button>
        
            { !user.login ?
              <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
                <Link className="flex items-center gap-1" to="/login">🔒 Đăng nhập</Link>
              </button>
              : 
              <button className="hidden sm:inline transition duration-200 transform hover:scale-105">
                <span className="flex items-center gap-1" onClick={handleLogout}>🔒 Đăng xuất</span>
              </button>
            }
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
            <div className="sm:hidden bg-[#0274be] text-white px-4 py-2 space-y-2">
              {/* Dropdown tiền tệ có state */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="bg-[#0274be] text-white px-2 py-1 rounded w-full text-left"
                >
                  USD ▼
                </button>
                {currencyOpen && (
                  <div className="mt-1 bg-white text-black rounded shadow-md">
                    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">USD</div>
                    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">VND</div>
                  </div>
                )}
              </div>

              {/* Dropdown ngôn ngữ có state */}
              <div className="relative mt-2">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="bg-[#0274be] text-white px-2 py-1 rounded w-full text-left"
                >
                  English ▼
                </button>
                {languageOpen && (
                  <div className="mt-1 bg-white text-black rounded shadow-md">
                    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">Tiếng Việt</div>
                    <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">Franch</div>
                  </div>
                )}
              </div>

              <div>👤 My Account</div>
              <div>💙 Wishlist</div>
              <div>🛒 My Cart</div>
              <div>✔ Checkout</div>
              <div>🔒 Login</div>
            </div>
          )}
        </div>

        {/* Main Header */}
        <div className="bg-[#0274be] text-white">
          <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between">
            {/* Logo */}
            <div className="text-3xl font-bold italic whitespace-nowrap text-white-400">
              <a href="/"><span className="text-black-400">P</span>SG</a>
            </div>

            {/* Search bar */}
            <div className="flex flex-grow max-w-4xl mx-6 w-full sm:w-auto">
              <div className="flex border rounded overflow-hidden w-full bg-white h-12">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="flex-grow px-4 text-gray-800 outline-none text-sm sm:text-base"
                />
                <button className="bg-yellow-400 px-4 sm:px-6 text-black text-lg">
                  🔍
                </button>
              </div>
            </div>

            {/* Cart */}
            <button className="mt-3 sm:mt-0">
              <div className="relative bg-[#035fa0] rounded px-4 py-2 flex items-center text-white text-sm font-medium">
                <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                </svg>
                <span>CART</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#0f6cb2] text-white text-sm font-semibold">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          {/* Menu ngang ẩn trên điện thoại */}
          <ul className="hidden sm:flex justify-center items-center space-x-1">
            {
              menu.map((item, index) => (
                <NavLink 
                  key={index}
                  to={item.link} 
                  className={({ isActive }) =>
                    `relative px-4 py-3 hover:bg-[#0865a4] cursor-pointer ${isActive ? 'bg-[#0865a4] text-white font-semibold' : ''}`
                  }
                >
                  {item.name}
                </NavLink>
              ))
            }
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

        {/* Menu ẩn hiện trên điện thoại */}
        {navMenuOpen && (
          <ul className="sm:hidden bg-[#0f6cb2] text-white text-sm space-y-2 px-4 py-3">
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">HOME</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">CLOTHING</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">ELECTRONICS</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">WATCHES</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">JEWELLERY</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">SHOES</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">KIDS &amp; GIRLS</li>
            <li className="py-2 hover:bg-[#0865a4] cursor-pointer">PAGES</li>
            <li className="py-2 text-yellow-400 hover:bg-[#0865a4] cursor-pointer">TODAYS OFFER</li>
          </ul>
        )}
      </nav>
    </div>
  )
}

export default Hearder
