import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeQuantity, removeProduct } from '../../redux/cart/cartSlice';
import { setMultiProducts } from '../../redux/checkout/checkoutSlice';
import Swal from 'sweetalert2';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector((state: any) => state.cart.products);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRemove = (id: string) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Sản phẩm sẽ bị xoá khỏi giỏ hàng.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Huỷ',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeProduct(id));
        setSelectedItems((prev) => prev.filter((i) => i !== id));

        Swal.fire({
          icon: 'success',
          title: 'Đã xoá khỏi giỏ hàng!',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
  };

  const handleChangeQuantity = (id: string, delta: number) => {
    dispatch(changeQuantity({ id, delta }));
  };

  const subtotal = carts.reduce((sum: number, item: any) => {
    return selectedItems.includes(item._id)
      ? sum + item.quantity * item.price
      : sum;
  }, 0);

  const handleCheckout = () => {
    if(selectedItems.length === 0) return
    const selectedProducts = carts.filter((item: any) =>
      selectedItems.includes(item._id)
    );
    dispatch(setMultiProducts(selectedProducts));
    selectedItems.forEach((id: string) => dispatch(removeProduct(id)));
    navigate('/checkoutpage');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Giỏ hàng</h2>

      {/* Header */}
      <div className="grid grid-cols-8 font-bold text-gray-700 border-b pb-3 text-center">
        <span>Chọn</span>
        <span>Ảnh</span>
        <span>Tên sản phẩm</span>
        <span>Loại</span>
        <span>Số lượng</span>
        <span>Giá</span>
        <span>Thành tiền</span>
        <span>Xoá</span>
      </div>

      {/* Cart Items */}
      <div className="border-t mt-3">
        {carts.length === 0 ? (
          <p className="text-center text-gray-500 italic py-6">Giỏ hàng trống.</p>
        ) : (
          carts.map((item: any) => (
            <div
              key={item._id}
              className="grid grid-cols-8 items-center py-4 border-b text-center"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => handleSelect(item._id)}
                className="mx-auto"
                style={{ width: '24px', height: '24px' }}
              />

              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mx-auto"
              />

              {/* Name */}
              <div>
                <p className="text-sm font-semibold whitespace-nowrap">{item.name}</p>
              </div>

              {/* Type */}
              <p className="text-sm text-gray-500">{item.type}</p>

              {/* Quantity Controls */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => handleChangeQuantity(item._id, -1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => handleChangeQuantity(item._id, 1)}
                  disabled={item.quantity >= item.countInStock}
                >
                  +
                </button>
              </div>

              {/* Price */}
              <p className="text-lg font-semibold">{item.price.toLocaleString()}₫</p>

              {/* Total per item */}
              <p className="text-lg font-semibold">
                {(item.quantity * item.price).toLocaleString()}₫
              </p>

              {/* Remove button */}
              <button
                className="text-red-500"
                onClick={() => handleRemove(item._id)}
              >
                X              
              </button>
            </div>
          ))
        )}
      </div>

      {/* Estimate Shipping & Tax */}
      {/* <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Ước tính chi phí vận chuyển và thuế
        </h3>
        <p className="text-sm text-gray-500">
          Nhập điểm đến của bạn để tính phí vận chuyển và thuế.
        </p>

        <div className="mt-4 space-y-3">
          <select className="w-full p-2 border rounded-md text-gray-700">
            <option>-- Chọn quốc gia --</option>
            <option>Việt Nam</option>
            <option>Hoa Kỳ</option>
          </select>

          <select className="w-full p-2 border rounded-md text-gray-700">
            <option>-- Chọn tùy chọn --</option>
            <option>Hà Nội</option>
            <option>Hồ Chí Minh</option>
            <option>Đà Nẵng</option>
            <option>Cần Thơ</option>
          </select>

          <input
            type="text"
            placeholder="Mã bưu chính/Zip"
            className="w-full p-2 border rounded-md"
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            NHẬN BÁO GIÁ
          </button>
        </div>
      </div> */}

      {/* Discount Code */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Mã giảm giá</h3>
        <p className="text-sm text-gray-500">
          Nhập mã phiếu giảm giá của bạn để áp dụng khuyến mãi.
        </p>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Phiếu giảm giá của bạn.."
            className="flex-1 p-2 border rounded-md"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            ÁP DỤNG COUPON
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Tóm tắt thanh toán</h3>

        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-700 text-lg">Tổng cộng:</p>
          <p className="text-green-500 text-xl font-bold">
            {subtotal.toLocaleString()}₫
          </p>
        </div>

        <button
          className={`mt-4 w-full bg-yellow-500 text-white py-2 rounded-md font-semibold 
            ${selectedItems.length ? 'hover:bg-yellow-600': 'opacity-50 cursor-not-allowed'}`}
          onClick={handleCheckout}
        >
          TIẾN HÀNH THANH TOÁN
        </button>

        <p className="text-sm text-gray-500 text-center mt-2" >
          Thanh toán bằng nhiều địa chỉ!
        </p>
      </div>
    </div>
  );
};

export default CartPage;
