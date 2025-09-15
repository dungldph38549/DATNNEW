import React, {  useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
import { useMutation, useQuery } from '@tanstack/react-query';
=======
import { useMutation } from '@tanstack/react-query';
>>>>>>> 1d8791b76dc9ed52559d7716952435fbeaf3202a
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { isValidEmail, isValidVietnamesePhone } from '../../const/index.ts';
import {
  changeQuantity,
  removeProduct,
  clearProduct
} from "../../redux/checkout/checkoutSlice.js";
<<<<<<< HEAD
import { checkVoucher, createOrder, getStocks } from "../../api/index.js";
=======
import { checkVoucher, createOrder } from "../../api/index.js";
>>>>>>> 1d8791b76dc9ed52559d7716952435fbeaf3202a

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.checkout.products);
  const user = useSelector((state) => state.user);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherData, setVoucherData] = useState(null);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const subtotal = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shippingFee = shippingMethod === "fast" ? 30000 : 0;
  let discount = 0;
  if(voucherData){
    if(voucherData.type === 'percentage'){
      discount = subtotal * voucherData.value / 100;
    } else {
      discount = voucherData.value;
    }
  }
  const total = subtotal + shippingFee - discount;

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: async (data) => {
      dispatch(clearProduct());
      if(paymentMethod === 'vnpay') {
        window.location.href = data.vnpayPaymentUrl
      } else {
        const result = await Swal.fire({
          title: 'Đặt hàng thành công!',
          text: 'Bạn muốn xem đơn hàng chứ?',
          icon: 'success',
          confirmButtonText: 'Xem đơn hàng',
          showCancelButton: true,
          cancelButtonText: 'Tiếp tục mua sắm',
        });
        navigate(result.isConfirmed ? '/orders' : '/');
      }
    },
    onError: (error) => {
      Swal.fire({
        title: 'Thất bại!',
        text: error?.response.data.message || 'Có lỗi xảy ra, vui lòng thử lại.',
        icon: 'error',
      });
    }
  });

  const { mutate: checkVoucherApi } = useMutation({
    mutationFn: checkVoucher,
    onSuccess: async (data) => {
      setForm({
        ...form,
        voucherCode
      })
      setVoucherData(data.data);
      await Swal.fire({
        title: 'Áp dụng mã giảm giá thành công!',
        icon: 'success',
      });

    },
    onError: (error) => {
      Swal.fire({
        title: 'Thất bại!',
        text: error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
        icon: 'warning',
      });
    }
  });

  const handleCheckVoucher = () => {
    checkVoucherApi(voucherCode);
  }

  const validateForm = () => {
    const newErrors = {
      fullName: form.fullName.trim() === '' ? 'Vui lòng nhập họ tên' : '',
      email: form?.email?.trim() === ''
        ? 'Vui lòng nhập email'
        : !isValidEmail(form.email)
        ? 'Email không hợp lệ'
        : '',
      phone: form?.phone?.trim() === ''
        ? 'Vui lòng nhập số điện thoại'
        : !isValidVietnamesePhone(form.phone)
        ? 'Số điện thoại không hợp lệ'
        : '',
      address: form.address.trim() === '' ? 'Vui lòng nhập địa chỉ' : '',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = (e) => {
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
      discount,
      totalAmount: total,
      shippingFee: shippingMethod === "fast" ? 30000 : 0
    };

    mutate(payload);
  };

<<<<<<< HEAD
  const { data } = useQuery({
    queryKey: ['product-stock', products],
    queryFn: () => getStocks(products),
  });

  const checkStock = (productId, sku) => {
    const stock = data?.find((item) => {
      if(sku) {
        return item.productId === productId && item.sku === sku
      }else {
        return item.productId === productId
      }
    });
    return stock?.countInStock;
  };

=======
>>>>>>> 1d8791b76dc9ed52559d7716952435fbeaf3202a
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

      {/* Mã giảm giá */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Mã giảm giá</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Nhập mã giảm giá..."
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="p-2 border rounded-md flex-1"
          />
          <button
            type="button"
            onClick={handleCheckVoucher}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Áp dụng
          </button>
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
              <div
                key={`${item.productId}-${item.sku || 'default'}`}
                className="flex justify-between items-start border-b pb-2"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.name}
                    {Object.keys(item.attributes || {}).length > 0 && (
                      <span className="text-sm text-gray-500 ml-1">
                        (
                          {item.sku}: {Object.entries(item.attributes)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                        )
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() =>
                        dispatch(changeQuantity({ productId: item.productId, sku: item.sku || null, delta: -1 }))
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(changeQuantity({ productId: item.productId, sku: item.sku || null, delta: 1 }))
                      }
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
<<<<<<< HEAD
                      disabled={item.quantity >= checkStock(item.productId, item.sku)}
=======
                      disabled={item.quantity >= item.countInStock}
>>>>>>> 1d8791b76dc9ed52559d7716952435fbeaf3202a
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        dispatch(removeProduct({ productId: item.productId, sku: item.sku || null }))
                      }
                      className="ml-4 text-red-500 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <span className="font-semibold text-gray-700">
                  {(item.quantity * item.price).toLocaleString('vi-VN')}₫
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
              checked={paymentMethod === "vnpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>Ví điện tử VNPay</span>
          </label>
        </div>
      </div>

      {/* Tóm tắt đơn hàng */}
      <div className="mb-6 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Tóm tắt đơn hàng</h3>

        <div className="space-y-2 mb-4">
          {products.map((item) => (
            <div
              key={`${item.productId}-${item.sku || 'default'}`}
              className="flex justify-between text-sm text-gray-700"
            >
              <span>{item.name} (x{item.quantity})</span>
              <span>{(item.quantity * item.price).toLocaleString('vi-VN')}₫</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-1">
          <span>Tạm tính:</span>
          <span>{subtotal.toLocaleString('vi-VN')}₫</span>
        </div>
        {  discount > 0 &&
            <div className="flex justify-between mb-1">
              <span>Giảm giá:</span>
              <span>{discount.toLocaleString('vi-VN')}₫</span>
            </div>
        }
        <div className="flex justify-between mb-1">
          <span>Phí giao hàng:</span>
          <span>{shippingFee.toLocaleString('vi-VN')}₫</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng:</span>
          <span className="text-green-600">{total.toLocaleString('vi-VN')}₫</span>
        </div>
      </div>

      {/* Nút đặt hàng */}
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
