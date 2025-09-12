import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from "react-redux";
import { fetchProducts, getActiveVouchers, getAllBrands, getAllCategories } from '../../api/index';
import dayjs from 'dayjs';

const HomePages = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [brandSelected, setBrandSelected] = useState('');
  const [categorySelected, setCategorySelected] = useState('');
  const keyword = useSelector(state => state.general.keyword);
  const [sort, setSort] = useState('createdAt');
  const {
    data: products,
    isLoading,
  } = useQuery({
    queryKey: ['list-products', page, brandSelected, categorySelected, keyword, sort],
    queryFn: () => fetchProducts({
      page,
      limit: 50,
      brandId: brandSelected,
      categoryId: categorySelected,
      sort,
      keyword,
    }),
    keepPreviousData: true,
  });

  useEffect(() => {
    setPage(0);
    setData([]);
  }, [brandSelected, categorySelected, keyword, sort]);

  useEffect(() => {
    if (products?.data) {
      setData(prev => {
        if (page === 0) return products.data;
        const existingIds = new Set(prev.map(p => p._id));
        const newData = products.data.filter(p => !existingIds.has(p._id));
        return [...prev, ...newData];
      });
    }
  }, [products, page]);

  const handleLoadMore = () => setPage(prev => prev + 1);

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: () => getAllBrands('active'),
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories('active'),
    keepPreviousData: true,
  });

  const { data: vouchers } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => getActiveVouchers(),
    keepPreviousData: true,
  });

  const bannerImages = [
    "https://cf.shopee.vn/file/vn-50009109-727a24a85a60935da5ccb9008298f681",
    "https://shopthearena.com/cdn/shop/files/auto-paris-saint-germain-collection-mobile_800x.jpg?v=1614601115",
    "https://cf.shopee.vn/file/vn-50009109-727a24a85a60935da5ccb9008298f681",
    "https://cf.shopee.vn/file/vn-11134258-7ras8-mbow8y1dv1qm87",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000); // chuyển slide mỗi 4 giây

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 bg-gray-100 pt-8">
      <div>
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          {bannerImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Banner ${index}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            />
          ))}
        </div>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 py-8 bg-gray-100">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Brands */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-3">Thương hiệu</h2>
            <ul className="space-y-2 text-sm text-gray-700" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {brands?.data?.map((brand) => (
                <div
                  key={brand._id}
                  onClick={() => setBrandSelected(brand._id)}
                  style={{ backgroundColor: brandSelected === brand._id ? '#e5e7eb' : 'white' }}
                  className='px-3 py-2 flex items-center rounded cursor-pointer hover:text-blue-600'
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${brand.image}`}
                    alt={brand.name}
                    className="rounded mr-3"
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>{brand.name}</span>
                </div>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-3">Danh mục</h2>
            <ul className="text-sm text-gray-600 space-y-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {categories?.data?.map((category) => (
                <div
                  key={category._id}
                  onClick={() => setCategorySelected(category._id)}
                  style={{ backgroundColor: categorySelected === category._id ? '#e5e7eb' : 'white' }}
                  className='px-3 py-2 flex items-center rounded cursor-pointer hover:text-blue-600'
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${category.image}`}
                    alt={category.name}
                    className="rounded mr-3"
                    style={{ width: '24px', height: '24px' }}
                  />
                  <span>{category.name}</span>
                </div>
              ))}
            </ul>
          </div>

          {/* voucher */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-3">Mã giảm giá</h2>
            <ul className="text-sm text-gray-600 space-y-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {vouchers?.data?.map((voucher) => (
                <div
                  key={voucher._id}
                  className='px-3 py-2 flex rounded cursor-pointer border'
                >
                  <img className='rounded' style={{ width: '65px', height: '65px', backgroundColor: '#ee4d2d', marginRight: '10px' }} alt="voucher" src="https://down-vn.img.susercontent.com/file/vn-11134004-7ras8-m4re2imocx9s72" />
                  <div>
                    <p className='font-bold' style={{fontSize: '20px'}}>Giảm {voucher.type === 'fixed' ? voucher.value + 'đ' : voucher.value + '%'}</p>
                    <p className='font-medium mt-1' style={{fontSize: '16px'}}>{voucher.code}</p>
                    <p className='opacity-50' style={{fontSize: '14px'}}>{dayjs(voucher.startDate).format('DD/MM/YYYY')} - {dayjs(voucher.endDate).format('DD/MM/YYYY')}</p>
                  </div>
                </div>
              ))} 
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-3 space-y-10">
          <div className="space-y-4">
            <div className='md:flex align-center pb-3'>
              <h2 className="text-xl font-bold text-gray-800 mr-10">Sắp xếp theo:</h2>
              <button className={` ${sort === 'createdAt' ? 'bg-blue-500 text-white' : 'bg-white text-black'} mr-4 px-4 py-2 rounded hover:bg-blue-500 hover:text-white shadow`} onClick={() => { setSort('createdAt') }}>
                Mới nhất
              </button>
              <button className={` ${sort === 'sold' ? 'bg-blue-500 text-white' : 'bg-white text-black'} mr-4 px-4 py-2 rounded hover:bg-blue-500 hover:text-white shadow`} onClick={() => { setSort('sold') }}>
                Bán chạy
              </button>
              <button className={` ${sort === 'priceIncre' ? 'bg-blue-500 text-white' : 'bg-white text-black'} mr-4 px-4 py-2 rounded hover:bg-blue-500 hover:text-white shadow`} onClick={() => { setSort('priceIncre') }}>
                Giá từ thấp đến cao
              </button>
              <button className={` ${sort === 'priceDecre' ? 'bg-blue-500 text-white' : 'bg-white text-black'} mr-4 px-4 py-2 rounded hover:bg-blue-500 hover:text-white shadow`} onClick={() => { setSort('priceDecre') }}>
                Giá từ cao đến thấp
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {isLoading && (
                <div className="flex justify-center items-center h-40 col-span-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              )}

              {data?.map((product) => {
                const item = product.hasVariants
                  ? (product.variants.reduce((max, v) => (v.sold || 0) > (max.sold || 0)
                    ? v
                    : max, product.variants[0]))
                  : product;
                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/detail/${product._id}`)}
                    className="group relative bg-white border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer hover:-translate-y-1 duration-200"
                    style={{ height: '320px' }}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${product.image}`}
                      alt={product.name}
                      loading="lazy"
                      style={{ height: '230px', width: '100%', objectFit: 'cover' }}
                    />
                    <div className="p-3 flex flex-col justify-between" style={{ height: '90px' }}>
                      <h3 className="text-gray-800 font-semibold text-sm line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex justify-between text-sm mt-1">
                        <p className="text-blue-600 font-bold">{item.price.toLocaleString()}₫</p>
                        <p className="text-gray-600">Đã bán: {(item.sold || 0).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                    {/* <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
                      <button className="bg-white text-sm px-3 py-1 rounded hover:bg-blue-600 hover:text-white">Mua ngay</button>
                      <button className="bg-white text-sm px-3 py-1 rounded hover:bg-red-600 hover:text-white">Thêm vào giỏ hàng</button>
                    </div> */}
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {(products?.pageCurrent ?? 0) < (products?.totalPage ?? 0) && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleLoadMore}
                  className="border border-black bg-white text-black px-6 py-2 rounded hover:bg-black hover:text-white transition text-sm"
                >
                  Xem thêm sản phẩm
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePages;
