import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderById, updateOrderInfo } from '../api/index';
import { GET_IMAGE, ORDER_STATUS_LABELS, PAYMENT_METHOD } from '../const/index.ts';
import { Table, Tag } from 'antd';
const SHIPPING_METHOD = {
  fast: 'Giao nhanh',
  standard: 'Tiêu chuẩn',
};
const AdminOrderDetailPage = ({ id, onClose }) => {

  const queryClient = useQueryClient();
  const NON_EDITABLE_STATUSES = ['shipped', 'delivered', 'canceled', 'return-request', 'accepted', 'rejected'];
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-order-detail', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  const { order, history } = data || {};
  // Local state để chỉnh sửa thông tin
  const [newStatus, setNewStatus] = useState('');
  const [editInfo, setEditInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: '',
    shippingMethod: '',
    note: '',
  });

  React.useEffect(() => {
    if (order) {
      setEditInfo({
        fullName: order.fullName,
        phone: order.phone,
        email: order.email,
        address: order.address,
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
      });
      setNewStatus(order.status);
    }
  }, [order]);

  const infoMutation = useMutation({
    mutationFn: (info) => updateOrderInfo(id, info),
    onSuccess: () => {
      Swal.fire('Thành công', 'Đã cập nhật thông tin đơn hàng!', 'success');
      queryClient.invalidateQueries(['admin-order-detail', id]);
      onClose();
      onClose();
    },
    onError: (error) => {
      if (error.response.data.message) return Swal.fire('Thất bại', error.response.data.message, 'warning');
      Swal.fire('Lỗi', 'Không thể cập nhật đơn hàng.', 'error');
    },
  });

  const handleUpdateInfo = () => {
    const updatedInfo = { ...editInfo, status: newStatus };
    if (NON_EDITABLE_STATUSES.includes(order.status)) {
      delete updatedInfo.fullName;
      delete updatedInfo.email;
      delete updatedInfo.phone;
      delete updatedInfo.address;
      delete updatedInfo.paymentMethod;
      delete updatedInfo.shippingMethod;
    }
    infoMutation.mutate(updatedInfo);
  };

  if (isLoading) return <div className="text-center mt-10">Đang tải đơn hàng...</div>;
  if (isError || !order) return <div className="text-center text-red-500">Không tìm thấy đơn hàng</div>;

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
  return (
    <div className="max-w-5xl mx-auto bg-white p-4 rounded-xl shadow" >
      {
        order &&
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Chi tiết & Chỉnh sửa Đơn hàng</h2>
            <p className='cursor-pointer text-blue-600 hover:text-blue-800 font-semibold bg-gray-200 hover:bg-gray-300 p-2 rounded' onClick={onClose}>Quay lại danh sách</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Thông tin người nhận</h3>

              {['fullName', 'email', 'phone', 'address'].map((field) => (
                <div className="mb-2" key={field}>
                  <label className="text-sm font-medium capitalize">{field}:</label>
                  <input
                    className="block w-full mt-1 p-2 border rounded"
                    value={editInfo[field]}
                    readOnly={NON_EDITABLE_STATUSES.includes(order.status)}
                    onChange={(e) => setEditInfo({ ...editInfo, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
              <p><strong>Mã đơn:</strong> {order._id}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>

              <div className="mt-2">
                <label className="text-sm font-medium">Phương thức giao hàng: </label>
                <span>{SHIPPING_METHOD[order.shippingMethod]}</span>
              </div>

              <div className="mt-2">
                <label className="text-sm font-medium">Phương thức thanh toán: </label>
                <span>{PAYMENT_METHOD[order.paymentMethod]}</span>
              </div>
              <div className="mt-2">
                <label className="text-sm font-medium">Trạng thái thanh toán: </label>
                <span>{order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
              </div>

              {/* Trạng thái */}
              <div className="mt-4 ">
                <label className="text-sm font-medium">Trạng thái đơn:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="">-- Cập nhật trạng thái --</option>
                  {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <label className="text-sm font-medium">Ghi chú:</label>
                <input
                  className="block w-full mt-1 p-2 border rounded"
                  value={editInfo.note}
                  onChange={(e) => setEditInfo({ ...editInfo, note: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={handleUpdateInfo} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Lưu thay đổi
                </button>

              </div>
            </div>
          </div>

          {/* Sản phẩm */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Danh sách sản phẩm</h3>
            <div className="grid grid-cols-5 font-bold text-gray-700 border-b pb-3 text-center">
              <span>Ảnh</span>
              <span>Tên sản phẩm</span>
              <span>Giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
            </div>
            <div className="border-t">
              {order.products.map((item, index) => (
                <div key={index} className="grid grid-cols-5 items-center py-4 border-b text-center">
                  <img src={GET_IMAGE(item.productId?.image)}
                    alt={item.productId?.name} className="w-20 h-20 object-cover rounded mx-auto" />
                  <p>
                    <p className='line-clamp-2'>
                      {item.productId?.name}
                    </p>
                    <p>{Object.entries(item.attributes || {}).map(([key, value]) => (
                      <Tag key={key} color="blue" className="mt-1">
                        {key}: {value}
                      </Tag>
                    ))}</p>
                  </p>
                  <p>{item.price?.toLocaleString('vi-VN')}₫</p>
                  <p>{item.quantity}</p>
                  <p>{(item.quantity * item.price)?.toLocaleString('vi-VN')}₫</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6 text-xl font-medium">
            <span>Phí ship: <span className="text-green-600">{(order?.shippingFee).toLocaleString('vi-VN')}₫</span></span>
          </div>

          <div className="flex justify-end mt-6 text-xl font-medium">
            <span>Giảm giá: <span className="text-green-600">{(order?.discount).toLocaleString('vi-VN')}₫</span></span>
          </div>
          {/* Tổng tiền */}
          <div className="flex justify-end mt-6 text-xl font-bold">
            <span>Tổng cộng: <span className="text-green-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span></span>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Lịch sử đơn hàng</h3>
            <Table
              columns={columns}
              dataSource={history}
              rowKey={(record, index) => index}
              pagination={false}
            />
          </div>
        </>
      }
    </div>
  );
};

export default AdminOrderDetailPage;