import React from 'react';

const CartPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">

      {/* Header */}
      <div className="grid grid-cols-7 font-bold text-gray-700 border-b pb-3 text-center">
        <span>Remove</span>
        <span>Image</span>
        <span>Product Name</span>
        <span>Edit</span>
        <span>Quantity</span>
        <span>Subtotal</span>
        <span>Grand Total</span>
      </div>

      {/* Cart Items */}
      <div className="border-t mt-3">
        <div className="grid grid-cols-7 items-center py-4 border-b text-center">
          <button className="text-red-500"><i className="fa fa-trash"></i></button>
          <img src="http://127.0.0.1:5500/shop-flipmart/assets/images/products/p1.jpg" alt="Top" className="w-30 h-30 object-cover rounded mx-auto" />
          <div>
            <p className="text-sm font-semibold whitespace-nowrap">Floral Print Buttoned Top</p>
            <p className="text-gray-500 text-sm mt-1">COLOR: blue</p>
          </div>
          <button className="text-blue-500 text-lg mx-auto">Edit</button>
          <input type="number" value="1" className="w-16 border p-1 text-center mx-auto" />
          <p className="text-lg font-semibold">$300.00</p>
          <p className="text-lg font-semibold">$300.00</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="border-t mt-3">
        <div className="grid grid-cols-7 items-center py-4 border-b text-center">
          <button className="text-red-500"><i className="fa fa-trash"></i></button>
          <img src="http://127.0.0.1:5500/shop-flipmart/assets/images/products/p2.jpg" alt="Top" className="w-30 h-30 object-cover rounded mx-auto" />
          <div>
            <p className="text-sm font-semibold whitespace-nowrap">Floral Print Buttoned Top</p>
            <p className="text-gray-500 text-sm mt-1">COLOR: blue</p>
          </div>
          <button className="text-blue-500 text-lg mx-auto">Edit</button>
          <input type="number" value="1" className="w-16 border p-1 text-center mx-auto" />
          <p className="text-lg font-semibold">$300.00</p>
          <p className="text-lg font-semibold">$300.00</p>
        </div>
      </div>

      {/* Estimate Shipping & Tax */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Ước tính chi phí vận chuyển và thuế</h3>
            <p className="text-sm text-gray-500">Nhập điểm đến của bạn để tính phí vận chuyển và thuế.</p>

            <div className="mt-4 space-y-3">
              <select className="w-full p-2 border rounded-md text-gray-700">
                <option>-- Chọn quốc gia --</option>
                <option>Việt Nam</option>
                <option>Hoa Kỳ</option>
              </select>

              <select className="w-full p-2 border rounded-md text-gray-700">
                <option>-- Chọn tùy chọn --</option>
                <option>Kerala</option>
                <option>Andhra Pradesh</option>
                <option>Karnataka</option>
                <option>Tiểu bang Madhya Pradesh</option>
                <option>Hà Nội</option>
                <option>Hồ Chí Minh</option>
                <option>Đà Nẵng</option>
                <option>Cần Thơ</option>
              </select>


              <input type="text" placeholder="Mã bưu chính/Zip" className="w-full p-2 border rounded-md" />

              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">NHẬN BÁO GIÁ</button>
            </div>
          </div>

          {/* Discount Code */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Mã giảm giá</h3>
            <p className="text-sm text-gray-500">Nhập mã phiếu giảm giá của bạn để áp dụng khuyến mãi.</p>

            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Phiếu giảm giá của bạn.." className="flex-1 p-2 border rounded-md" />
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">ÁP DỤNG COUPON</button>
            </div>
          </div>


          {/* Payment Summary */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Tóm tắt thanh toán</h3>

            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-700 text-lg">Tổng cộng:</p>
              <p className="text-green-500 text-xl font-bold">$600.00</p>
            </div>

            <button className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 font-semibold">
              TIẾN HÀNH THANH TOÁN
            </button>

            <p className="text-sm text-gray-500 text-center mt-2">Thanh toán bằng nhiều địa chỉ!</p>
          </div>
    </div>

    
  );
};

export default CartPage;