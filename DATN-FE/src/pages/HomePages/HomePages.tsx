import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../api/index";
import { addProduct as addProductCheckout } from "../../redux/checkout/checkoutSlice";
import { addProduct } from "../../redux/cart/cartSlice";
import { useEffect, useState, useCallback } from "react";

const HomePages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["list-products", page],
    queryFn: () => fetchProducts(page, 10),
    keepPreviousData: true, // Giữ dữ liệu cũ khi load trang mới
  });

  useEffect(() => {
    if (products?.data?.length) {
      if (page === 0) {
        // Nếu là trang đầu tiên, reset dữ liệu
        setData(products.data);
      } else {
        // Nếu không phải trang đầu, thêm dữ liệu mới vào
        setData((prev) => {
          const newIds = new Set(prev.map((p) => p._id));
          const filtered = products.data.filter((p) => !newIds.has(p._id));
          return [...prev, ...filtered];
        });
      }
    }
  }, [products, page]);

  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const handleCheckout = useCallback(
    (item) => {
      dispatch(addProductCheckout(item));
      navigate("/checkoutpage");
    },
    [dispatch, navigate]
  );

  const handleAddToCart = useCallback(
    (item) => {
      dispatch(addProduct(item));
      Swal.fire({
        icon: "success",
        title: "Đã thêm vào giỏ hàng",
        text: `"${item.name}" đã được thêm vào giỏ hàng.`,
        timer: 1500,
        showConfirmButton: false,
      });
    },
    [dispatch]
  );

  const handleProductClick = useCallback(
    (productId) => {
      navigate(`/detail/${productId}`);
    },
    [navigate]
  );

  // Hiển thị loading cho lần đầu
  if (isLoading && page === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Có lỗi xảy ra</h2>
          <p>Không thể tải dữ liệu sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-8 bg-gray-100">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Thể loại */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-3">🗂️ Thể loại</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  👕 Quần áo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  👟 Giày dép
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  🧢 Phụ kiện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  ⚽ Đồ thể thao
                </a>
              </li>
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
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Đăng ký bản tin */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-3">📬 Bản tin</h2>
            <input
              type="email"
              placeholder="Đăng ký để nhận bản tin của chúng tôi"
              className="w-full p-2 border rounded mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition-colors">
              Đăng ký
            </button>
          </div>

          {/* Người dùng đánh giá */}
          <div className="bg-white p-4 rounded shadow space-y-4">
            <div className="text-sm italic text-gray-700">
              "Áo chất lượng, giao hàng nhanh!"
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="John Doe"
                className="rounded-full w-10 h-10"
              />
              <div>
                <div className="font-bold text-sm">John Doe</div>
                <div className="text-xs text-gray-500">Công ty ABC</div>
              </div>
            </div>
            <div className="text-sm italic text-gray-700">
              "Giày rất đẹp, sẽ quay lại mua nữa!"
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="Stephen Doe"
                className="rounded-full w-10 h-10"
              />
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
            <img
              src="https://cdn.nhandan.vn/images/fa391366f89db5a67559939572e33e64fb0be6ed83558c63424374077d876b1f22e75ecde216a7f5e23446739cc1371abedbf23dd69f2682b1e8dd0c97579983/57-finale-cdf-trophee.jpg"
              alt="Banner 1"
              className="w-full h-48 object-cover rounded-lg"
            />
            <img
              src="https://www.sporter.vn/wp-content/uploads/2023/06/Chi-tiet-ao-bong-da-psg-san-nha-2023-0.jpg"
              alt="Banner 2"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Sản phẩm mới */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">🆕 Sản phẩm mới</h2>

            {/* Danh sách sản phẩm */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {data &&
                data.length > 0 &&
                data.map((product: Product) => (
                  <div
                    key={product._id}
                    className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div onClick={() => handleProductClick(product._id)}>
                      <img
                        src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${product.image}`}
                        alt={product.name}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                      />
                      <div className="p-4 space-y-1">
                        <h3 className="text-gray-800 font-semibold text-sm line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-blue-600 font-bold text-lg">
                          {new Intl.NumberFormat("vi-VN").format(product.price)}
                          ₫
                        </p>
                      </div>
                    </div>
                    <div className="p-4 pt-0 space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-full text-sm bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        Thêm vào giỏ
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckout(product);
                        }}
                        className="w-full text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Loading cho load more */}
            {isLoading && page > 0 && (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Nút Xem thêm */}
            {products?.pageCurrent < products?.totalPage && !isLoading && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMore}
                  className="border border-black bg-white text-black px-6 py-2 rounded hover:bg-black hover:text-white transition-colors text-sm"
                  disabled={isLoading}
                >
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* Sản phẩm nổi bật */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              ⭐ Sản phẩm nổi bật
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Thẻ sản phẩm 1 */}
              <div className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300">
                <img
                  src="https://via.placeholder.com/300x300?text=Áo+Real+Madrid"
                  alt="Áo Real Madrid"
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 space-y-1">
                  <h3 className="text-gray-800 font-semibold text-sm">
                    Áo Real Madrid 2024
                  </h3>
                  <p className="text-blue-600 font-bold">480.000₫</p>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300">
                  <button className="bg-white text-sm px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors">
                    Mua ngay
                  </button>
                  <button className="bg-white text-sm px-3 py-1 rounded hover:bg-green-600 hover:text-white transition-colors">
                    Chi tiết
                  </button>
                  <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-colors">
                    Yêu thích
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bán chạy nhất */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              🔥 Bán chạy nhất
            </h2>
            <div className="bg-white p-4 rounded shadow flex space-x-4 hover:shadow-lg transition-shadow">
              <img
                src="https://via.placeholder.com/120"
                alt="Áo MU Bán chạy"
                className="rounded w-28 h-28 object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  Áo MU Bán chạy
                </h3>
                <p className="text-blue-600 font-bold mt-1">450.000₫</p>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          {/* Blog */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              📝 Blog mới nhất
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Top 5 áo đấu đẹp 2024
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Cùng khám phá 5 mẫu áo đá bóng nổi bật nhất năm...
                </p>
                <a
                  href="#"
                  className="text-blue-600 text-sm hover:underline transition-colors"
                >
                  Đọc thêm
                </a>
              </div>
              <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Hướng dẫn chọn size áo chuẩn
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Không biết chọn size? Đây là bài viết dành cho bạn...
                </p>
                <a
                  href="#"
                  className="text-blue-600 text-sm hover:underline transition-colors"
                >
                  Đọc thêm
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePages;