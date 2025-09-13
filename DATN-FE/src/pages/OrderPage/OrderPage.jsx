import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getOrdersByUserOrGuest } from '../../api/index';
import { useNavigate } from 'react-router-dom'; 
import { ORDER_STATUS_LABELS, PAYMENT_METHOD } from '../../const/index.ts';
const OrderPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['list-order', user.id, user.isGuest],
    queryFn: ({ queryKey }) => {
      const [, id, isGuest] = queryKey;
      return getOrdersByUserOrGuest({ id, isGuest });
    },
    enabled: !!user.id,
  });

  if (isLoading) return <div className="text-center mt-10">Đang tải đơn hàng...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Lỗi khi tải đơn hàng.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 italic">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 border px-4 text-left">Mã đơn</th>
              <th className="py-2 border px-4 text-left">Ngày đặt</th>
              <th className="py-2 border px-4 text-left">Trạng thái</th>
              <th className="py-2 border px-4 text-left">Thanh toán</th>
              <th className="py-2 border px-4 text-left">Tổng tiền</th>
              <th className="py-2 border px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border">{order._id}</td>
                <td className="py-2 px-4 border">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-2 px-4 border text-green-600">{ORDER_STATUS_LABELS[order.status]}</td>
                <td className="py-2 px-4 border text-blue-600">
                  {PAYMENT_METHOD[order.paymentMethod]}
                </td>
                <td className="py-2 px-4 border font-semibold">
                  {order.totalAmount}₫
                </td>
                <td className="py-2 px-4 border text-center" onClick={() => navigate(`/order/${order._id}`)}>
                  <button className="text-blue-500 hover:underline">Xem chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderPage;