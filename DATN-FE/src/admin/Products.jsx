import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Space, Spin } from 'antd';
import Swal from 'sweetalert2';
import ProductDetail from './ProductDetail.jsx';
import { getAllProducts, deleteProductById, restoreProductById } from './../api/index';

export default function Products() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [productSelected, setProductSelected] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => getAllProducts({ page: page - 1, limit }),
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xoá sản phẩm này?',
      text: 'Hành động này không thể hoàn tác!',
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
        setPage(1);
      } catch (err) {
        Swal.fire('Thất bại', 'Không thể khôi phục sản phẩm.', 'error');
      }
    }
  };

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
      )}
    </div>
  );
}
