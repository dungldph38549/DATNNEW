import React from 'react'

const HomePages = () => {
  return (
    <div>
<main className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-8 bg-gray-100">
  {/* Sidebar */}
  <aside className="md:col-span-1 space-y-6">
    {/* Thể loại */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-3">🗂️ Thể loại</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><a href="#" className="hover:text-blue-600">👕 Quần áo</a></li>
        <li><a href="#" className="hover:text-blue-600">👟 Giày dép</a></li>
        <li><a href="#" className="hover:text-blue-600">🧢 Phụ kiện</a></li>
        <li><a href="#" className="hover:text-blue-600">⚽ Đồ thể thao</a></li>
      </ul>
    </div>
    {/* Ưu đãi hấp dẫn */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-3">🎁 Ưu đãi hấp dẫn</h2>
      <ul className="text-sm text-gray-600 space-y-2">
        <li>✔️ Hoàn lại tiền trong 20 ngày</li>
        <li>✔️ Miễn phí vận chuyển</li>
        <li>✔️ Khuyến mãi đặc biệt mỗi tháng</li>
      </ul>
    </div>
    {/* Tìm sản phẩm */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-3">🔍 Tìm sản phẩm</h2>
      <input type="text" placeholder="Tìm kiếm..." className="w-full p-2 border rounded text-sm" />
    </div>
    {/* Đăng ký bản tin */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg mb-3">📬 Bản tin</h2>
      <input type="email" placeholder="Đăng ký để nhận bản tin của chúng tôi" className="w-full p-2 border rounded mb-3 text-sm" />
      <button className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700">Đặt mua</button>
    </div>
    {/* Người dùng đánh giá */}
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="text-sm italic text-gray-700">"Áo chất lượng, giao hàng nhanh!"</div>
      <div className="flex items-center space-x-2">
        <img src="https://via.placeholder.com/40" className="rounded-full" />
        <div>
          <div className="font-bold text-sm">John Doe</div>
          <div className="text-xs text-gray-500">Công ty ABC</div>
        </div>
      </div>
      <div className="text-sm italic text-gray-700">"Giày rất đẹp, sẽ quay lại mua nữa!"</div>
      <div className="flex items-center space-x-2">
        <img src="https://via.placeholder.com/40" className="rounded-full" />
        <div>
          <div className="font-bold text-sm">Stephen Doe</div>
          <div className="text-xs text-gray-500">Studio Korea</div>
        </div>
      </div>
    </div>
  </aside>
  {/* Nội dung chính */}
  <section className="md:col-span-3 space-y-10">
    {/* Banner chính */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <img src="data:image/jpeg;base64,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" className="w-full h-48 object-cover rounded-lg" />
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRETKTcOAZ6FqILCC4OmSMMtmUuQNVswa6LCA&s" className="w-full h-48 object-cover rounded-lg" />
    </div>
    {/* Sản phẩm mới */}
    <div className="space-y-4">
  <h2 className="text-xl font-bold text-gray-800">🆕 Sản phẩm</h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
    <div className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src="https://via.placeholder.com/300x300?text=Áo+Real+Madrid"
        alt="Áo Real Madrid"
        className="w-full h-60 object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-gray-800 font-semibold text-sm">Áo Real Madrid 2024</h3>
        <p className="text-blue-600 font-bold">480.000đ</p>
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-blue-600 hover:text-white">Mua ngay</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-green-600 hover:text-white">Chi tiết</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white">Yêu thích</button>
      </div>
    </div>
    {/* ... */}
  </div>

  {/* Nút Xem thêm */}
<div className="flex justify-center mt-4">
  <button className="border border-black bg-white text-black px-6 py-2 rounded hover:bg-black hover:text-white transition text-sm">
    Xem thêm sản phẩm
  </button>
</div>
</div>
    
    {/* Sản phẩm nổi bật */}
    <div className="space-y-4">
  <h2 className="text-xl font-bold text-gray-800">⭐ Sản phẩm nổi bật</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {/* Thẻ sản phẩm 1 */}
    <div className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src="https://via.placeholder.com/300x300?text=Áo+Real+Madrid"
        alt="Áo Real Madrid"
        className="w-full h-60 object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-gray-800 font-semibold text-sm">Áo Real Madrid 2024</h3>
        <p className="text-blue-600 font-bold">480.000đ</p>
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-blue-600 hover:text-white">Mua ngay</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-green-600 hover:text-white">Chi tiết</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white">❤</button>
      </div>
    </div>

    {/* Thẻ sản phẩm 2 */}
    <div className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src="https://via.placeholder.com/300x300?text=Áo+Liverpool"
        alt="Áo Liverpool"
        className="w-full h-60 object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-gray-800 font-semibold text-sm">Áo Liverpool 2024</h3>
        <p className="text-blue-600 font-bold">470.000đ</p>
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-blue-600 hover:text-white">Mua ngay</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-green-600 hover:text-white">Chi tiết</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white">❤</button>
      </div>
    </div>

    {/* Thẻ sản phẩm 3 */}
    <div className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src="https://via.placeholder.com/300x300?text=Áo+Man+City"
        alt="Áo Man City"
        className="w-full h-60 object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-gray-800 font-semibold text-sm">Áo Man City 2024</h3>
        <p className="text-blue-600 font-bold">490.000đ</p>
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-blue-600 hover:text-white">Mua ngay</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-green-600 hover:text-white">Chi tiết</button>
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white">❤</button>
      </div>
    </div>
  </div>
</div>

    {/* Bán chạy nhất */}
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">🔥 Bán chạy nhất</h2>
      <div className="bg-white p-4 rounded shadow flex space-x-4">
        <img src="https://via.placeholder.com/120" className="rounded w-28 h-28 object-cover" />
        <div>
          <h3 className="font-semibold text-lg text-gray-800">Áo MU Bán chạy</h3>
          <p className="text-blue-600 font-bold mt-1">450.000đ</p>
          <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Mua ngay</button>
        </div>
      </div>
    </div>
    {/* Blog */}
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📝 Blog mới nhất</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-gray-800">Top 5 áo đấu đẹp 2024</h3>
          <p className="text-sm text-gray-600">Cùng khám phá 5 mẫu áo đá bóng nổi bật nhất năm...</p>
          <a href="#" className="text-blue-600 text-sm mt-2 inline-block hover:underline">Đọc thêm</a>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-gray-800">Hướng dẫn chọn size áo chuẩn</h3>
          <p className="text-sm text-gray-600">Không biết chọn size? Đây là bài viết dành cho bạn...</p>
          <a href="#" className="text-blue-600 text-sm mt-2 inline-block hover:underline">Đọc thêm</a>
        </div>
      </div>
    </div>
    {/* Hàng mới về */}
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📦 Hàng mới về</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Lặp sản phẩm mới về ở đây */}
      </div>
    </div>
  </section>
</main>




    </div>
  )
}

export default HomePages