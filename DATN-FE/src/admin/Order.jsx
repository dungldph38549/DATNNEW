
import { useState } from 'react';
import { useQueryClient , useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { getAllOrders, deleteOrderById } from './../api/index';
import { ORDER_STATUS_LABELS } from '../const/index.ts';
import AdminOrderDetailPage from './AdminOrderDetail.jsx';
import Pagination from '../components/Pagination/Pagination.tsx';

export default function Order() {
  const queryClient = useQueryClient();
  const [orderSelected, setOrderSelected] = useState(null);

  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useQuery({
      queryKey: ['admin-orders', page],
      queryFn: () => {
        return getAllOrders(page, 10);
      },
      keepPreviousData: true,
    });
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

  return (
    <div>
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
      
    </div>
)}