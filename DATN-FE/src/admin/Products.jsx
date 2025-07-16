import { useState } from 'react';
<<<<<<< HEAD
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Spin } from 'antd';
import Swal from 'sweetalert2';
import ProductDetail from './ProductDetail.jsx';
import { getAllProducts, deleteProductById, restoreProductById } from './../api/index';

export default function Products() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
=======
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import ProductDetail from './ProductDetail.jsx';
import { getAllProducts, deleteProductById, restoreProductById } from './../api/index';
import Pagination from '../components/Pagination/Pagination.tsx';

export default function Products() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
  const limit = 10;
  const [productSelected, setProductSelected] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products', page],
<<<<<<< HEAD
    queryFn: () => getAllProducts({ page: page - 1, limit }),
=======
    queryFn: () => getAllProducts({ page, limit }),
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xoá sản phẩm này?',
<<<<<<< HEAD
      text: 'Hành động này không thể hoàn tác!',
=======
      text: "Hành động này không thể hoàn tác!",
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
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

<<<<<<< HEAD
  const handleRestore = async (id) => {
=======
    const handleRestore = async (id) => {
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
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
<<<<<<< HEAD
        setPage(1);
=======
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
      } catch (err) {
        Swal.fire('Thất bại', 'Không thể khôi phục sản phẩm.', 'error');
      }
    }
  };

<<<<<<< HEAD
  const columns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'countInStock',
      key: 'countInStock',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Ngày xoá',
      dataIndex: 'deletedAt',
      key: 'deletedAt',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!record.deletedAt && (
            <Button type="link" onClick={() => setProductSelected(record._id)}>Sửa</Button>
          )}
          {!record.deletedAt && (
            <Button type="link" danger onClick={() => handleDelete(record._id)}>Xoá</Button>
          )}
          {record.deletedAt && (
            <Button type="link" onClick={() => handleRestore(record._id)}>Khôi phục</Button>
          )}
        </Space>
      ),
    },
  ];

  if (productSelected) {
    return <ProductDetail productId={productSelected} onClose={() => setProductSelected(null)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Danh sách Sản phẩm</h2>
        <Button type="primary" onClick={() => setProductSelected('create')}>Tạo sản phẩm</Button>
      </div>

      {isLoading ? (
        <Spin tip="Đang tải sản phẩm..." />
      ) : isError ? (
        <p className="text-red-500">Lỗi khi tải danh sách sản phẩm</p>
      ) : (
        <Table
          columns={columns}
          dataSource={data.data.map((item) => ({ ...item, key: item._id }))}
          pagination={{
            current: page,
            total: data.total,
            pageSize: limit,
            onChange: (newPage) => setPage(newPage),
          }}
          bordered
        />
=======
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
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
      )}
    </div>
  );
}
