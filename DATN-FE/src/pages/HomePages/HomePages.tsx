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
      <img src="https://cdn.nhandan.vn/images/fa391366f89db5a67559939572e33e64fb0be6ed83558c63424374077d876b1f22e75ecde216a7f5e23446739cc1371abedbf23dd69f2682b1e8dd0c97579983/57-finale-cdf-trophee.jpg" className="w-full h-48 object-cover rounded-lg" />
      <img src="https://www.sporter.vn/wp-content/uploads/2023/06/Chi-tiet-ao-bong-da-psg-san-nha-2023-0.jpg" className="w-full h-48 object-cover rounded-lg" />
    </div>
    {/* Sản phẩm mới */}
    <div className="space-y-4">
  <h2 className="text-xl font-bold text-gray-800"> Sản phẩm</h2>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
    <div className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <img
        src="https://aressport.vn/wp-content/uploads/2024/09/ao-psg-san-nha-24-25.jpg"
        alt="Áo Real Madrid"
        className="w-full h-60 object-cover"
      />
      <div className="p-4 space-y-1">
        <h3 className="text-gray-800 font-semibold text-sm">Áo Real Madrid 2024</h3>
        <p className="text-blue-600 font-bold">480.000đ</p>
        <button className="mt-2 w-full text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Mua ngay</button>
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
        <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white">Yêu thích</button>
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