import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Table, Button, Tag, Spin, message } from 'antd';
import Swal from 'sweetalert2';
import { getAllOrders, deleteOrderById, acceptOrRejectReturn } from './../api/index';
import { ORDER_STATUS_LABELS } from '../const/index.ts';
import AdminOrderDetailPage from './AdminOrderDetail.jsx';

export default function Order() {
  const queryClient = useQueryClient();
  const [orderSelected, setOrderSelected] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => getAllOrders(page - 1, limit),
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xoá đơn hàng này?',
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
        await deleteOrderById({ id });
        queryClient.refetchQueries({ queryKey: ['admin-orders'] });
        Swal.fire('Đã xoá!', 'Đơn hàng đã được xoá.', 'success');
      } catch (err) {
        Swal.fire('Thất bại', 'Không thể xoá đơn hàng.', 'error');
      }
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => (
        <span className="text-green-600 font-semibold">
          {value.toLocaleString('vi-VN')}₫
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'red';
        if (status === 'pending') color = 'gold';
        else if (status === 'confirmed') color = 'blue';
        else if (status === 'shipped') color = 'purple';
        else if (status === 'delivered') color = 'green';

        return <Tag color={color}>{ORDER_STATUS_LABELS[status] || status}</Tag>;
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => {
        let color = 'red';
        if (paymentStatus === 'paid') color = 'green';

        return (
          <Tag color={color}>
            {paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => {
              setOrderSelected(record._id);
            }}
          >
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  if (orderSelected) {
    return (
      <AdminOrderDetailPage
        id={orderSelected}
        onClose={() => setOrderSelected(null)}
      />
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow w-100">
      <h2 className="text-2xl font-semibold mb-4">Danh sách Đơn hàng</h2>
      {isLoading ? (
        <Spin tip="Đang tải đơn hàng..." />
      ) : isError ? (
        <p className="text-red-500">Lỗi khi tải danh sách đơn hàng</p>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data.data?.map((order) => ({
              ...order,
              key: order._id,
            }))}
            pagination={{
              current: page,
              total: data.total,
              pageSize: limit,
              onChange: (newPage) => setPage(newPage),
            }}
            bordered
          />
        </div>
      )}
    </div>
  );
}
