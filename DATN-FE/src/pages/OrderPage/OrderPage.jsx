import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { comfirmDelivery, getOrdersByUserOrGuest, returnOrder, uploadImage } from '../../api/index';
import { useNavigate } from 'react-router-dom';
import { ORDER_STATUS_LABELS, PAYMENT_METHOD } from '../../const/index.ts';
import { Table, Button, Tag, Spin, Typography, message, Modal, Input, Form, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const [page, setPage] = React.useState(1);
  const limit = 10;

  // state cho popup hoàn hàng
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  const [returnNote, setReturnNote] = React.useState('');
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['list-order', user.id, user.isGuest, page],
    queryFn: ({ queryKey }) => {
      const [, id, isGuest] = queryKey;
      return getOrdersByUserOrGuest({ id, isGuest, page, limit });
    },
    enabled: !!user.id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id }) => comfirmDelivery(id),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: ['list-order'] });
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });

  const returnMutation = useMutation({
    mutationFn: ({ id, note, image }) =>
      returnOrder({ id, note, image }),
    onSuccess: () => {
      message.success('Hoàn hàng thành công');
      queryClient.invalidateQueries({ queryKey: ['list-order'] });
      setIsReturnModalOpen(false);
      setReturnNote('');
      setSelectedOrderId(null);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    },
  });

  const handleUpdateSubmit = (id) => {
    updateMutation.mutate({ id });
  };

  const handleOpenReturnModal = (id) => {
    setSelectedOrderId(id);
    setIsReturnModalOpen(true);
  };

  const [form] = Form.useForm();

  const handleReturnSubmit = () => {
    form.validateFields().then((values) => {
      if (!returnNote.trim()) {
        return message.warning('Vui lòng nhập lý do hoàn hàng');
      }
      returnMutation.mutate({
        id: selectedOrderId,
        note: returnNote,
        image: values.image,
      });
    });
  };

  const handleMainUpload = async ({ file }) => {
    const formD = new FormData();
    formD.append('file', file);
    const res = await uploadImage(formD);
    form.setFieldsValue({ image: res.path });
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
        else if (status === 'return-request') color = 'orange';
        else if (status === 'canceled') color = 'red';

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
        status === 'paid' ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="red">Chưa thanh toán</Tag>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <Text strong>{amount.toLocaleString('vi-VN')}₫</Text>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, order) => {
        const deliveredDate = order.deliveredAt
          ? new Date(order.deliveredAt)
          : new Date(order.updatedAt || order.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));
        const canReturn = order.status === 'delivered' && diffDays <= 3;

        return (
          <>
            <Button type="link" onClick={() => navigate(`/order/${order._id}`)}>
              Chi tiết
            </Button>
            {order.status === 'shipped' && (
              <Button type="link" danger onClick={() => handleUpdateSubmit(order._id)}>
                Đã nhận
              </Button>
            )}
            {canReturn && (
              <Button type="link" onClick={() => handleOpenReturnModal(order._id)}>
                Hoàn hàng
              </Button>
            )}
          </>
        );
      },
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
      ) : !orders || orders.data.length === 0 ? (
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

      {/* Modal nhập lý do hoàn hàng */}
      <Modal
        title="Hoàn hàng"
        open={isReturnModalOpen}
        onOk={handleReturnSubmit}
        onCancel={() => setIsReturnModalOpen(false)}
        confirmLoading={returnMutation.isLoading}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Lý do" required>
            <Input.TextArea
              rows={4}
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              placeholder="Nhập lý do..."
            />
          </Form.Item>

          <Form.Item name="image" label="Ảnh chính" className="mt-4">
            <Upload customRequest={handleMainUpload} showUploadList={false} accept="image/*">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.image !== cur.image}>
              {({ getFieldValue }) =>
                getFieldValue('image') ? (
                  <img
                    src={`${process.env.REACT_APP_API_URL_BACKEND}/image/${getFieldValue('image')}`}
                    alt="Preview"
                    style={{ width: 120, marginTop: 10 }}
                  />
                ) : null
              }
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderPage;
