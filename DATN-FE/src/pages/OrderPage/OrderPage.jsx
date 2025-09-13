import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { comfirmDelivery, getOrdersByUserOrGuest } from '../../api/index';
import { useNavigate } from 'react-router-dom';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD } from '../../const/index.ts';
import { Table, Button, Tag, Spin, Typography, message } from 'antd';

const { Title, Text } = Typography;

const OrderPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['list-order', user.id, user.isGuest, page],
    queryFn: ({ queryKey }) => {
      const [, id, isGuest] = queryKey;
      return getOrdersByUserOrGuest({ id, isGuest, page, limit });
    },
    enabled: !!user.id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id }) => comfirmDelivery( id ),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['list-order'] })
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });

   const handleUpdateSubmit = (id) => {
    updateMutation.mutate({ id });
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'red';
        if (status === 'pending') color = 'gold';
        else if (status === 'confirmed') color = 'blue';
        else if (status === 'shipped') color = 'purple';
        else if (status === 'delivered') color = 'green';

        return <Tag color={color}>{status === 'delivered' ? 'Đã nhận' : ORDER_STATUS_LABELS[status]}</Tag>;
      },
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => <Tag color="blue">{PAYMENT_METHOD[method]}</Tag>,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) =>
        status === 'paid' ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <Text strong>{amount.toLocaleString('vi-VN')}₫</Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, order) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/order/${order._id}`)}
          >
            Chi tiết
          </Button>
          {order.status === 'shipped' && (
            <Button type="link" danger onClick={() => handleUpdateSubmit(order._id)}>
              Đã nhận
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-10 mb-10">
      <Title level={2}>Đơn hàng của tôi</Title>

      {isLoading ? (
        <Spin size="large" className="mt-10" />
      ) : isError ? (
        <Text type="danger" className="mt-10 block">
          Lỗi khi tải đơn hàng.
        </Text>
      ) : orders.data.length === 0 ? (
        <Text type="secondary" italic>
          Bạn chưa có đơn hàng nào.
        </Text>
      ) : (
        <Table
          columns={columns}
          dataSource={orders.data}
          rowKey="_id"
          pagination={{
            pageSize: limit,
            total: orders.total,
            current: page,
            onChange: (newPage) => setPage(newPage),
          }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
};

export default OrderPage;
