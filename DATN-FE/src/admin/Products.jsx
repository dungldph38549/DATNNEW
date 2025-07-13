import { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import ProductDetail from './ProductDetail.jsx';
import { getAllProducts, deleteProductById, restoreProductById } from './../api/index';
import Pagination from '../components/Pagination/Pagination.tsx';

export default function Products() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const limit = 10;
  const [productSelected, setProductSelected] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => getAllProducts({ page, limit }),
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xoá sản phẩm này?',
      text: "Hành động này không thể hoàn tác!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
    });

    if (result.isConfirmed) {
      try {
        await deleteProductById({ id });
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        Swal.fire('Đã xoá!', 'Sản phẩm đã được xoá.', 'success');
      } catch (err) {
        Swal.fire('Thất bại', 'Không thể xoá sản phẩm.', 'error');
      }
    }
  };

    const handleRestore = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn khôi phục sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Khôi phục',
      cancelButtonText: 'Huỷ',
    });

    if (result.isConfirmed) {
      try {
        await restoreProductById({ id });
        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        Swal.fire('Đã khôi phục!', 'Sản phẩm đã được khôi phục.', 'success');
      } catch (err) {
        Swal.fire('Thất bại', 'Không thể khôi phục sản phẩm.', 'error');
      }
    }
  };

  if (isLoading) return <p>Đang tải sản phẩm...</p>;
  if (isError) return <p className="text-red-500">Lỗi khi tải danh sách sản phẩm</p>;
  return (
    <div>
      {productSelected ? (
        <ProductDetail productId={productSelected} onClose={() => setProductSelected(null)} />
      ) : (
        <div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">📦 Danh sách Sản phẩm</h2>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setProductSelected('create')}
                  >
                  Tạo sản phẩm
                </button>
            </div>
            <div className='mt-4'>
                <table className="min-w-full bg-white border rounded shadow text-sm">
                <thead>
                    <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 text-left">Mã sản phẩm</th>
                    <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                    <th className="px-4 py-2 text-left">Danh mục</th>
                    <th className="px-4 py-2 text-left">Giá tiền</th>
                    <th className="px-4 py-2 text-left">Tồn kho</th>
                    <th className="px-4 py-2 text-left">Ngày tạo</th>
                    <th className="px-4 py-2 text-left">Ngày xóa</th>
                    <th className="px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data.data.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-2">{product._id}</td>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">{product.type}</td>
                        <td className="px-4 py-2">{product.price}</td>
                        <td className="px-4 py-2">{product.countInStock}</td>
                        <td className="px-4 py-2">
                        {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-2">
                        {product.deletedAt && new Date(product.deletedAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-4 py-2 flex gap-2 justify-center">
                        {!product.deletedAt && (
                          <button
                              className="text-blue-600 hover:underline"
                              onClick={() => setProductSelected(product._id)}
                          >
                              Sửa
                          </button>
                          
                        )}
                        {!product.deletedAt &&  (<button
                            className="text-red-600 hover:underline"
                            onClick={() => handleDelete(product._id)}
                        >
                            Xoá
                        </button>)}
                            {product.deletedAt &&  (<button
                            className="text-red-600 hover:underline"
                            onClick={() => handleRestore(product._id)}
                        >
                            Khôi phục
                        </button>)}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>

                <Pagination
                  page={page}
                  totalPages={data.totalPage}
                  onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
        </div>
      )}
    </div>
  );
}
