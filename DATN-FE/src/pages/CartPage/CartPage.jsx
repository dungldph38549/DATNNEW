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

      {/* Cart Items */}
      <div className="border-t mt-3">
        {carts.length === 0 ? (
          <p className="text-center text-gray-500 italic py-6">Giỏ hàng trống.</p>
        ) : (
          carts.map((item, index) => (
            <div
              key={`${item.productId}-${item.sku || 'default'}`}
              className="grid grid-cols-8 items-center py-4 border-b text-center"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected(item.productId, item.sku || null)}
                onChange={() => handleSelect(item.productId, item.sku || null)}
                className="mx-auto"
                style={{ width: 24, height: 24 }}
              />

              {/* Image */}
              <img
                src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${item.image}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mx-auto"
              />
              
                {/* Name + Attributes */}
              <div className="text-left px-2">
                <p className="text-sm font-semibold whitespace-pre-line">
                  {item.name}
                  {item.attributes &&
                    Object.entries(item.attributes).length > 0 && (
                      <>
                        {' ('}
                        {Object.entries(item.attributes)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(', ')}
                        {')'}
                      </>
                    )}
                </p>
              </div>

                {/* Quantity Controls */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() =>
                    handleChangeQuantity(item.productId, item.sku || null, -1)
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() =>
                    handleChangeQuantity(item.productId, item.sku || null, 1)
                  }
                  disabled={item.quantity >= checkStock(item.productId, item.sku)}
                >
                  +
                </button>
              </div>

               {/* Price */}
              <p className="text-lg font-semibold">{item.price.toLocaleString('vi-VN')}₫</p>

              {/* Total per item */}
              <p className="text-lg font-semibold">
                {(item.quantity * item.price).toLocaleString('vi-VN')}₫
              </p>

                  {/* Remove button */}
              <button
                className="text-red-500 font-bold text-xl"
                onClick={() => handleRemove(item.productId, item.sku || null)}
                aria-label={`Xóa ${item.name} khỏi giỏ hàng`}
              >
                ×
              </button>
              

           

            
             
            </div>
          ))
        )}
      </div>
       {/* Payment Summary */}
      <div className="border-t pt-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800">Tóm tắt thanh toán</h3>

        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-700 text-lg">Tổng cộng:</p>
          <p className="text-green-500 text-xl font-bold">
            {subtotal.toLocaleString('vi-VN')}₫
          </p>
        </div>

        <button
          className={`mt-4 w-full bg-yellow-500 text-white py-2 rounded-md font-semibold ${
            selectedItems.length ? 'hover:bg-yellow-600' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          TIẾN HÀNH THANH TOÁN
        </button>

        <p className="text-sm text-gray-500 text-center mt-2">
          Thanh toán bằng nhiều địa chỉ!
        </p>
      </div>
    </div>
  );
};

export default CartPage;

