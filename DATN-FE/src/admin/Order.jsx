import { useState } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Table, Button, Tag, Spin  } from 'antd';
import Swal from 'sweetalert2';
import { getAllOrders, deleteOrderById } from './../api/index';
import { ORDER_STATUS_LABELS } from '../const/index.ts';
import AdminOrderDetailPage from './AdminOrderDetail.jsx';
import Pagination from '../components/Pagination/Pagination.tsx';

export default function Order() {
  const queryClient = useQueryClient();
  const [orderSelected, setOrderSelected] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => getAllOrders(page-1, limit),
    keepPreviousData: true,
  });

<<<<<<< HEAD
=======
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQuery({
      queryKey: ['admin-orders', page],
      queryFn: () => {
        return getAllOrders(page, 10);
      },
      keepPreviousData: true,
    });
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc muốn xoá đơn hàng này?',
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
      render: (value) => <span className="text-green-600 font-semibold">{value.toLocaleString()}₫</span>,
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
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record._id)}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  if (orderSelected) {
    return <AdminOrderDetailPage id={orderSelected} onClose={() => setOrderSelected(null)} />;
  }

  return (
    <div>
<<<<<<< HEAD
      <h2 className="text-2xl font-semibold mb-4">Danh sách Đơn hàng</h2>
      {isLoading ? (
        <Spin tip="Đang tải đơn hàng..." />
      ) : isError ? (
        <p className="text-red-500">Lỗi khi tải danh sách đơn hàng</p>
      ) : (
        <Table
          columns={columns}
          dataSource={data.data?.map((order) => ({ ...order, key: order._id }))}
          pagination={{
            current: page,
            total: data.total,
            pageSize: limit,
            onChange: (newPage) => setPage(newPage),
          }}
          bordered
        />
      )}
=======
      {
        orderSelected ? (
          <AdminOrderDetailPage id={orderSelected} onClose={() => setOrderSelected(null)} />
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">🧾 Danh sách Đơn hàng</h2>
            {isLoading ? (
              <p>Đang tải đơn hàng...</p>
              ) : isError ? (
                <p className="text-red-500">Lỗi khi tải danh sách đơn hàng</p>
              ) : 
              (
                <div>
                  <table className="min-w-full bg-white border rounded shadow text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="px-4 py-2 text-left">Mã đơn</th>
                        <th className="px-4 py-2 text-left">Khách hàng</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">SĐT</th>
                        <th className="px-4 py-2">Tổng tiền</th>
                        <th className="px-4 py-2">Trạng thái</th>
                        <th className="px-4 py-2">Ngày tạo</th>
                        <th className="px-4 py-2 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.data?.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 border-b">
                            <td className="px-4 py-2">{order._id}</td>
                            <td className="px-4 py-2">{order.fullName}</td>
                            <td className="px-4 py-2">{order.email}</td>
                            <td className="px-4 py-2">{order.phone}</td>
                            <td className="px-4 py-2 text-green-600 font-semibold">
                                {order.totalAmount.toLocaleString()}₫
                            </td>
                            <td className="px-4 py-2">
                                <span className={
                                    "px-2 py-1 rounded text-white text-xs " +
                                    (order.status === 'pending'
                                        ? 'bg-yellow-500'
                                        : order.status === 'confirmed'
                                        ? 'bg-blue-500'
                                        : order.status === 'shipped'
                                        ? 'bg-purple-500'
                                        : order.status === 'delivered'
                                        ? 'bg-green-600'
                                        : 'bg-red-500')
                                }>
                                    {ORDER_STATUS_LABELS[order.status] || order.status}
                                </span>
                            </td>
                            <td className="px-4 py-2">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-4 py-2 flex gap-2 justify-center">
                                <button
                                  className="text-blue-600 hover:underline"
                                  onClick={() => {
                                    setOrderSelected(order._id);
                                  }}
                                >
                                  Sửa
                                </button>
                                <button
                                  className="text-red-600 hover:underline"
                                  onClick={() => handleDelete(order._id)}
                                >
                                  Xoá
                                </button>
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
              )
            }
          </div>
        )
      }
      
>>>>>>> 6594ca09ba3844f0e8abef8a456871988b2e59c5
    </div>
  );
}
