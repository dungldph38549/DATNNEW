import React from "react";

const HeaderComponent = () => {
  return (
    <header className="bg-[#1789db]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-3 text-white text-sm">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold italic">
            <span className="text-yellow-400">F</span>lipmart
          </span>
        </div>
        {/* Search Bar */}
        <div className="flex flex-1 mx-8 max-w-3xl">
          <div className="flex">
            <button className="bg-gray-100 text-gray-700 px-4 rounded-l-md border-r border-gray-300 flex items-center">
              Categories
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search here..."
              className="w-full px-4 py-2 outline-none"
            />
            <button className="bg-yellow-400 px-6 rounded-r-md flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
        {/* Top Right */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1 cursor-pointer">
            <span>USD</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <span>English</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>My Account</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 016.364 0l1.318 1.318 1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
            <span>Wishlist</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
            </svg>
            <span>My Cart</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span>Checkout</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
              <path d="M12 13v7" />
            </svg>
            <span>Login</span>
          </div>
        </div>
        {/* Cart */}
        <div className="ml-6 flex items-center bg-[#0e6eb8] rounded px-4 py-2 relative">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
          </svg>
          <span className="absolute -top-2 -left-2 bg-yellow-400 text-[#1789db] rounded-full w-6 h-6 flex items-center justify-center font-bold text-base">2</span>
          <span className="ml-2">CART - $600.00</span>
        </div>
      </div>
      {/* Navigation Bar */}
      <nav className="bg-[#1576c2]">
        <div className="flex items-center px-8">
          <ul className="flex space-x-2">
            <li>
              <a href="#" className="px-6 py-3 bg-[#1568a7] text-white font-semibold">HOME</a>
            </li>
            <li>
              <a href="#" className="px-6 py-3 text-white font-semibold">CLOTHING</a>
            </li>
            <li className="relative">
              <a href="#" className="px-6 py-3 text-white font-semibold flex items-center">
                ELECTRONICS
                <span className="ml-2 bg-red-400 text-white text-xs px-2 py-0.5 rounded absolute -top-2 left-20">HOT</span>
              </a>
            </li>
            <li>
              <a href="#" className="px-6 py-3 text-white font-semibold">HEALTH & BEAUTY</a>
            </li>
            <li className="relative">
              <a href="#" className="px-6 py-3 text-white font-semibold flex items-center">
                WATCHES
                <span className="ml-2 bg-yellow-400 text-[#1789db] text-xs px-2 py-0.5 rounded absolute -top-2 left-16">NEW</span>
              </a>
            </li>
            <li>
              <a href="#" className="px-6 py-3 text-white font-semibold">JEWELLERY</a>
            </li>
            <li>
              <a href="#" className="px-6 py-3 text-white font-semibold">SHOES</a>
            </li>
            <li>
              <a href="#" className="px-6 py-3 text-white font-semibold">KIDS & GIRLS</a>
            </li>
            <li>
              <a href="#" className="px-6 py-3 text-white font-semibold">PAGES</a>
            </li>
          </ul>
          <div className="flex-1 flex justify-end">
            <span className="text-yellow-400 font-semibold text-lg">TODAYS OFFER</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
