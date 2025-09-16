import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comfirmDelivery, getOrderById, updateOrder } from '../../api/index';
import { ORDER_STATUS_LABELS } from '../../const/index.ts';
import Swal from 'sweetalert2';
import { message, Table, Tag } from 'antd';

const OrderDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['order-detail', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  const { order, history } = data || {};

  const [editInfo, setEditInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateOrderMutation } = useMutation({
    mutationFn: (payload) => updateOrder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['order-detail', id]);
      Swal.fire('Thành công', 'Cập nhật đơn hàng thành công!', 'success');
      setIsEditing(false);
    },
    onError: () => {
      Swal.fire('Lỗi', 'Không thể cập nhật đơn hàng', 'error');
    },
  });

  const handleInputChange = (field, value) => {
    setEditInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    updateOrderMutation(editInfo);
  };

  const handleCancelOrder = () => {
    Swal.fire({
      title: 'Hủy đơn hàng?',
      text: 'Bạn chắc chắn muốn hủy đơn này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hủy đơn',
      cancelButtonText: 'Thoát',
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderMutation({ status: 'canceled' });
      }
    });
  };

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'newStatus',
      key: 'newStatus',
      render: (newStatus) => {
        let color = 'red';
        if (newStatus === 'pending') color = 'gold';
        else if (newStatus === 'confirmed') color = 'blue';
        else if (newStatus === 'shipped') color = 'purple';
        else if (newStatus === 'delivered') color = 'green';

        return <Tag color={color}>{ORDER_STATUS_LABELS[newStatus] || newStatus}</Tag>;
      }
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => {
        return <Tag color='green'>{paymentStatus === 'paid' ? 'Đã thanh toán' : ''}</Tag>;
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Thời gian',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => new Date(text).toLocaleString('vi-VN'),
    },
  ];

  const updateMutation = useMutation({
    mutationFn: ({ id }) => comfirmDelivery(id),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['list-order'] });
      navigate('/orders');
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });
  const handleUpdateSubmit = (id) => {
    updateMutation.mutate({ id });
  };

  if (isLoading) return <div className="text-center mt-10">Đang tải chi tiết đơn hàng...</div>;
  if (isError || !order) return <div className="text-center mt-10 text-red-500">Không tìm thấy đơn hàng.</div>;

  const canEdit = order.status === 'pending';


  return (

    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mb-10 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chi tiết đơn hàng</h2>
        <div className='flex justify-between'>
          <div className="text-gray-700 space-y-2">
            <p><strong>Mã đơn:</strong> {order._id}</p>
            <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><strong>Trạng thái đơn hàng:</strong> <span className="text-green-600">{order.status === 'delivered' ? 'Đã nhận' : ORDER_STATUS_LABELS[order.status]}</span></p>
            <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod === 'cod' ? 'COD' : 'VNPay'}</p>
            <p><strong>Trạng thái thanh toán:</strong> {order.paymentStatus === 'paid' ?
              <span className="text-green-600">Đã thanh toán</span> :
              <span className="text-red-600">Chưa thanh toán</span>
            }</p>
            <p><strong>Giao hàng:</strong> {order.shippingMethod === 'fast' ? 'Giao nhanh' : 'Tiêu chuẩn'}</p>
          </div>
          <div>
            {
              order.status === 'shipped' &&
              <button
                className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'
                onClick={() => handleUpdateSubmit(order._id)}
              >Đã nhận được hàng</button>
            }
          </div>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-800">Thông tin người nhận</h3>
            {canEdit && !isEditing && (
              <button
                onClick={() => {
                  setEditInfo({
                    fullName: order.fullName,
                    email: order.email,
                    phone: order.phone,
                    address: order.address,
                  });
                  setIsEditing(true);
                }}
                className="text-blue-600 text-sm hover:underline"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="Họ tên"
                value={editInfo.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
              <input
                type="email"
                className="border p-2 rounded"
                placeholder="Email"
                value={editInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded"
                placeholder="SĐT"
                value={editInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              <input
                type="text"
                className="border p-2 rounded col-span-2"
                placeholder="Địa chỉ"
                value={editInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              <div className="col-span-2 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleSaveChanges}
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <p><strong>Họ tên:</strong> {order.fullName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>SĐT:</strong> {order.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.address}</p>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Sản phẩm</h3>
          <div className="divide-y">
            {order.products.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-4">
                  <img
                    src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${item.productId.image}`}
                    alt={item.productId.name} className="w-16 h-16 rounded border"
                  />
                  <div>
                    <p className="font-semibold line-clamp-1">{item.productId.name}</p>
                    <p className="font-semibold mt-1">{Object.entries(item.attributes || {}).map(([key, value]) => (
                      <Tag key={key} color="blue" className="mb-1">
                        {key}: {value}
                      </Tag>
                    ))}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                </div>
                <div className="font-semibold">
                  {(item.quantity * item.price).toLocaleString('vi-VN')}₫
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-l mt-4 pt-2 border-t">
            <span>Phí ship:</span>
            <span className="text-green-600">{order.shippingFee.toLocaleString('vi-VN')}₫</span>
          </div>

          <div className="flex justify-between text-l mt-4 pt-2 border-t">
            <span>Giảm giá từ voucher:</span>
            <span className="text-green-600">{order.discount.toLocaleString('vi-VN')}₫</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
            <span>Tổng cộng:</span>
            <span className="text-green-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>

        {canEdit && (
          <div className="text-right mt-4">
            <button
              onClick={handleCancelOrder}
              className="text-red-600 hover:underline text-sm"
            >
              Hủy đơn hàng
            </button>
          </div>
        )}

      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6 mb-10 mt-10">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Theo dõi đơn hàng</h3>
        <Table
          columns={columns}
          dataSource={history}
          rowKey={(record, index) => index}
          pagination={false}
        />
      </div>
    </>
  );
};

export default OrderDetailPage;
