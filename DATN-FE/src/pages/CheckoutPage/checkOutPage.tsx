import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { isValidEmail, isValidVietnamesePhone } from '../../const/index.ts';
import { changeQuantity, removeProduct, clearProduct } from "../../redux/checkout/checkoutSlice";
import { createOrder } from "../../api/index.js";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state: any) => state.checkout.products);
  const user = useSelector((state: any) => state.user);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const subtotal = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shippingFee = shippingMethod === "fast" ? 30000 : 0;
  const total = subtotal + shippingFee;

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: async (data) => {
      dispatch(clearProduct()); // xóa giỏ hàng sau khi thành công
      const result = await Swal.fire({
        title: 'Đặt hàng thành công!',
        text: 'Bạn muốn xem đơn hàng chứ?',
        icon: 'success',
        confirmButtonText: 'Xem đơn hàng',
        showCancelButton: true,
        cancelButtonText: 'Tiếp tục mua sắm',
      });

      if (result.isConfirmed) {
        navigate('/orders');
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      Swal.fire({
        title: 'Lỗi!',
        text: error?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
        icon: 'error',
      });
    }
  });

  const validateForm = () => {
    const newErrors = {
      fullName: form.fullName.trim() === '' ? 'Vui lòng nhập họ tên' : '',
      email: form.email.trim() === ''
        ? 'Vui lòng nhập email'
        : !isValidEmail(form.email)
        ? 'Email không hợp lệ'
        : '',
      phone: form.phone.trim() === ''
        ? 'Vui lòng nhập số điện thoại'
        : !isValidVietnamesePhone(form.phone)
        ? 'Số điện thoại không hợp lệ'
        : '',
      address: form.address.trim() === '' ? 'Vui lòng nhập địa chỉ' : '',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isPending) return;
    const payload = {
      ...form,
      userId: user.isGuest ? null : user.id,
      guestId: user.isGuest ? user.id : null,
      paymentMethod,
      shippingMethod,
      products,
    };

    mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thanh toán</h2>

      {/* Thông tin người nhận */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin người nhận</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Họ tên"
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`p-2 border rounded-md w-full ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`p-2 border rounded-md w-full ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`p-2 border rounded-md w-full ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Địa chỉ giao hàng"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={`p-2 border rounded-md w-full ${errors.address ? 'border-red-500' : ''}`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin sản phẩm</h3>
        {products.length === 0 ? (
          <p className="text-gray-500 italic">Không có sản phẩm nào trong đơn hàng.</p>
        ) : (
          <div className="space-y-4">
            {products.map((item) => (
              <div key={item._id} className="flex justify-between items-start border-b pb-2">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                       onClick={() => dispatch(changeQuantity({ id: item._id, delta: -1 }))}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(changeQuantity({ id: item._id, delta: 1 }))}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => dispatch(removeProduct(item._id))}
                      className="ml-4 text-red-500 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <span className="font-semibold text-gray-700">
                  {(item.quantity * item.price).toLocaleString()}₫
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phương thức giao hàng */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Phương thức giao hàng</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shipping"
              value="standard"
              checked={shippingMethod === "standard"}
              onChange={(e) => setShippingMethod(e.target.value)}
            />
            <span>Giao hàng tiêu chuẩn (3-5 ngày) - Miễn phí</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="shipping"
              value="fast"
              checked={shippingMethod === "fast"}
              onChange={(e) => setShippingMethod(e.target.value)}
            />
            <span>Giao hàng nhanh (1-2 ngày) - 30.000₫</span>
          </label>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Phương thức thanh toán</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="paymentMethod"
              value="vnpay"
              disabled
              checked={paymentMethod === "vnpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="text-gray-400">Ví điện tử VNpay</span>
          </label>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="mb-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tóm tắt đơn hàng</h3>

        {products.length > 0 && (
          <div className="space-y-2 mb-4">
            {products.map((item) => (
              <div key={item._id} className="flex justify-between text-sm text-gray-700">
                <span>{item.name} (x{item.quantity})</span>
                <span>{(item.quantity * item.price).toLocaleString()}₫</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mb-1">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Phí giao hàng:</span>
          <span>{shippingFee.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-green-600">{total.toLocaleString()}₫</span>
        </div>
      </div>

      <button
        disabled={products.length === 0 || isPending}
        onClick={handleSubmit}
        className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 font-semibold text-lg disabled:opacity-50"
      >
        ĐẶT HÀNG
      </button>
    </div>
  );
};

export default CheckoutPage;
