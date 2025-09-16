import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { isValidEmail, isValidVietnamesePhone } from '../../const/index.ts';
import {
  changeQuantity,
  removeProduct,
  clearProduct
} from "../../redux/checkout/checkoutSlice.js";
import { checkVoucher, createOrder, getStocks } from "../../api/index.js";

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
  if (voucherData) {
    if (voucherData.type === 'percentage') {
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
      if (paymentMethod === 'vnpay') {
        window.location.href = data.vnpayPaymentUrl;
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
      });
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
  };

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

  // ✅ Thêm check tồn kho
  const { data } = useQuery({
    queryKey: ['product-stock', products],
    queryFn: () => getStocks(products),
  });

  const checkStock = (productId, sku) => {
    const stock = data?.find((item) => {
      if (sku) {
        return item.productId === productId && item.sku === sku;
      } else {
        return item.productId === productId;
      }
    });
    return stock?.countInStock || 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thanh toán</h2>

      {/* ... giữ nguyên giao diện như bạn viết ... */}

      {/* Trong chỗ nút tăng số lượng ✅ sửa disabled */}
      {products.map((item) => (
        <button
          onClick={() =>
            dispatch(changeQuantity({ productId: item.productId, sku: item.sku || null, delta: 1 }))
          }
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          disabled={item.quantity >= checkStock(item.productId, item.sku)}
        >
          +
        </button>
      ))}

      {/* ... phần còn lại không đổi ... */}
    </div>
  );
};

export default CheckoutPage;
