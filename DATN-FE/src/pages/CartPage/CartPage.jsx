import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeQuantity, removeProduct } from '../../redux/cart/cartSlice';
import { setMultiProducts } from '../../redux/checkout/checkoutSlice';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { getStocks } from '../../api/index';

// Helper để so sánh sản phẩm (vì sku có thể null)
const isSameItem = (a, b) =>
  a.productId === b.productId && (a.sku || null) === (b.sku || null);

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.cart.products);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelect = (productId, sku) => {
    const exists = selectedItems.find((item) =>
      isSameItem(item, { productId, sku })
    );
    if (exists) {
      setSelectedItems((prev) =>
        prev.filter((item) => !isSameItem(item, { productId, sku }))
      );
    } else {
      setSelectedItems((prev) => [...prev, { productId, sku }]);
    }
  };

  const handleRemove = (productId, sku) => {
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
        dispatch(removeProduct({ productId, sku }));
        setSelectedItems((prev) =>
          prev.filter((item) => !isSameItem(item, { productId, sku }))
        );

        Swal.fire({
          icon: 'success',
          title: 'Đã xoá khỏi giỏ hàng!',
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
  };

  const handleChangeQuantity = (productId, sku, delta) => {
    dispatch(changeQuantity({ productId, sku, delta }));
  };

  const isSelected = (productId, sku) =>
    selectedItems.some((item) => isSameItem(item, { productId, sku }));

  const subtotal = carts.reduce((sum, item) => {
    return isSelected(item.productId, item.sku || null)
      ? sum + item.quantity * item.price
      : sum;
  }, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng chọn sản phẩm để thanh toán',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const selectedProducts = carts.filter((item) =>
      selectedItems.some((s) => isSameItem(item, s))
    );

    dispatch(setMultiProducts(selectedProducts));

    selectedItems.forEach(({ productId, sku }) => {
      dispatch(removeProduct({ productId, sku }));
    });

    navigate('/checkoutpage');
  };

  const { data } = useQuery({
    queryKey: ['product-stock', carts],
    queryFn: () => getStocks(carts),
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Giỏ hàng</h2>

      {/* Header */}
      <div className="grid grid-cols-8 font-bold text-gray-700 border-b pb-3 text-center">
        <span>Chọn</span>
        <span>Ảnh</span>
        <span>Tên sản phẩm</span>
        <span>Số lượng</span>
        <span>Giá</span>
        <span>Thành tiền</span>
        <span>Xoá</span>
      </div>

   

  
    </div>
  );
};

export default CartPage;
