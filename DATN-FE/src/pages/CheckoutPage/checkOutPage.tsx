import React from 'react';

const CheckoutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thanh toán</h2>

      {/* Thông tin giao hàng */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin người nhận</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Họ tên" className="p-2 border rounded-md" />
          <input type="email" placeholder="Email" className="p-2 border rounded-md" />
          <input type="text" placeholder="Số điện thoại" className="p-2 border rounded-md" />
          <input type="text" placeholder="Địa chỉ giao hàng" className="p-2 border rounded-md col-span-2" />
        </div>
      </div>

      {/* Phương thức giao hàng */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Phương thức giao hàng</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="radio" name="shipping" defaultChecked />
            <span>Giao hàng tiêu chuẩn (3-5 ngày) - Miễn phí</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="shipping" />
            <span>Giao hàng nhanh (1-2 ngày) - 30.000₫</span>
          </label>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Phương thức thanh toán</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" defaultChecked />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" />
            <span>Thẻ tín dụng/Ghi nợ</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" />
            <span>Ví điện tử Momo/ZaloPay</span>
          </label>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="mb-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tóm tắt đơn hàng</h3>
        <div className="flex justify-between mb-1">
          <span>Tạm tính:</span>
          <span>600.000₫</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Phí giao hàng:</span>
          <span>0₫</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-green-600">600.000₫</span>
        </div>
      </div>

      {/* Nút đặt hàng */}
      <button className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 font-semibold text-lg">
        ĐẶT HÀNG
      </button>
    </div>
  );
};

export default CheckoutPage;
