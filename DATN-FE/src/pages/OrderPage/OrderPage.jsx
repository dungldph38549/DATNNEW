import React from 'react';

const OrderPage = () => {
  const orders = [
    {
      id: 'DH001',
      date: '19/06/2025',
      status: 'Đã giao',
      payment: 'Đã thanh toán',
      total: '600.000₫',
    },
    {
      id: 'DH002',
      date: '18/06/2025',
      status: 'Đang xử lý',
      payment: 'Chưa thanh toán',
      total: '450.000₫',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Đơn hàng của tôi</h2>

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
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4 border">{order.id}</td>
              <td className="py-2 px-4 border">{order.date}</td>
              <td className="py-2 px-4 border text-green-600">{order.status}</td>
              <td className="py-2 px-4 border text-blue-600">{order.payment}</td>
              <td className="py-2 px-4 border font-semibold">{order.total}</td>
              <td className="py-2 px-4 border text-center">
                <button className="text-blue-500 hover:underline">Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderPage;
