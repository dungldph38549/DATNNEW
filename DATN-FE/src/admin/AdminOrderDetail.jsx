import React, { useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrderById, updateOrderInfo } from "../api/index";
import {
  GET_IMAGE,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD,
} from "../const/index.ts";
import {
  Table,
  Tag,
  Card,
  Divider,
  Spin,
  Avatar,
  Space,
  Button,
  Input,
  Select,
  Form,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  TruckOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const SHIPPING_METHOD = {
  fast: "Giao nhanh",
  standard: "Tiêu chuẩn",
};

const AdminOrderDetailPage = ({ id, onClose }) => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  // Các trạng thái luôn không cho sửa
  const NON_EDITABLE_STATUSES = [
    "delivered",
    "canceled",
    "return-request",
    "accepted",
    "rejected",
  ];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-order-detail", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  const { order, history } = data || {};
  const [editMode, setEditMode] = useState(false);

  React.useEffect(() => {
    if (order) {
      form.setFieldsValue({
        fullName: order.fullName,
        phone: order.phone,
        email: order.email,
        address: order.address,
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        status: order.status,
        note: order.note || "",
      });
    }
  }, [order, form]);

  const infoMutation = useMutation({
    mutationFn: (info) => updateOrderInfo(id, info),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đã cập nhật thông tin đơn hàng",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["admin-order-detail", id]);
      setEditMode(false);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Không thể cập nhật đơn hàng";
      Swal.fire({
        icon: "error",
        title: "Thất bại!",
        text: message,
      });
    },
  });

  const handleSave = () => {
  form.validateFields().then((values) => {
    // Chỉ chặn khi đang giao mà chưa thanh toán
    if (order.status === "shipped" && order.paymentStatus !== "paid") {
      Swal.fire({
        icon: "warning", 
        title: "Không thể cập nhật",
        text: "Đơn hàng đang giao nhưng chưa thanh toán, không thể chỉnh sửa!",
      });
      return;
    }

    // Các trạng thái đặc biệt chỉ cho sửa status + note
    if (NON_EDITABLE_STATUSES.includes(order.status) || 
        (order.status === "shipped" && order.paymentStatus === "paid")) {
      const updatedInfo = {
        status: values.status,
        note: values.note,
      };
      infoMutation.mutate(updatedInfo);
    } else {
      // Cho phép sửa tất cả thông tin
      infoMutation.mutate(values);
    }
  });
};

  // Check quyền chỉnh sửa
const isEditable = () => {
  if (!order) return false;

  // Các trạng thái hoàn toàn không cho sửa
  if (NON_EDITABLE_STATUSES.includes(order.status)) return false;

  // Chỉ chặn khi đang giao NHƯNG chưa thanh toán
  if (order.status === "shipped" && order.paymentStatus !== "paid") {
    return false;
  }

  return true;
};

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "gold",
      confirmed: "blue",
      shipped: "purple",
      delivered: "green",
      canceled: "red",
      "return-request": "orange",
      accepted: "cyan",
      rejected: "magenta",
    };
    return colorMap[status] || "default";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: <ClockCircleOutlined />,
      confirmed: <CheckCircleOutlined />,
      shipped: <TruckOutlined />,
      delivered: <CheckCircleOutlined />,
      canceled: <ExclamationCircleOutlined />,
    };
    return iconMap[status] || <ClockCircleOutlined />;
  };

  const historyColumns = [
    {
      title: "Trạng thái",
      dataIndex: "newStatus",
      key: "newStatus",
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {ORDER_STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus) =>
        paymentStatus === "paid" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã thanh toán
          </Tag>
        ) : (
          <Tag color="default">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) =>
        note || <span className="text-gray-400">Không có ghi chú</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => (
        <Space>
          <CalendarOutlined />
          {new Date(text).toLocaleString("vi-VN")}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spin size="large" />
        <span className="ml-3 text-gray-600">
          Đang tải thông tin đơn hàng...
        </span>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <ExclamationCircleOutlined className="text-6xl text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Không tìm thấy đơn hàng
        </h3>
        <p className="text-gray-500">
          Đơn hàng có thể đã bị xóa hoặc không tồn tại
        </p>
        <Button type="primary" onClick={onClose} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="mb-6 shadow-sm border-0">
        <div className="flex justify-between items-center">
          <div>
            <Space size="middle">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onClose}
                className="flex items-center"
              >
                Quay lại
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Chi tiết đơn hàng #{order._id?.slice(-8)}
                </h1>
                <Space className="text-gray-500">
                  <CalendarOutlined />
                  <span>
                    Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </span>
                </Space>
              </div>
            </Space>
          </div>
          <Space>
            <Tag
              icon={getStatusIcon(order.status)}
              color={getStatusColor(order.status)}
              className="px-3 py-1"
            >
              {ORDER_STATUS_LABELS[order.status]}
            </Tag>
            {isEditable() && (
              <Button
                type={editMode ? "default" : "primary"}
                icon={editMode ? <SaveOutlined /> : <EditOutlined />}
                onClick={editMode ? handleSave : () => setEditMode(true)}
                loading={infoMutation.isPending}
              >
                {editMode ? "Lưu thay đổi" : "Chỉnh sửa"}
              </Button>
            )}
          </Space>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Customer Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined className="text-blue-500" />
                <span>Thông tin người nhận</span>
              </Space>
            }
            className="h-full shadow-sm border-0"
          >
            <Form form={form} layout="vertical" disabled={!editMode}>
              <Form.Item
                label={
                  <Space>
                    <UserOutlined />
                    Họ và tên
                  </Space>
                }
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <MailOutlined />
                    Email
                  </Space>
                }
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <PhoneOutlined />
                    Số điện thoại
                  </Space>
                }
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <EnvironmentOutlined />
                    Địa chỉ giao hàng
                  </Space>
                }
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <TextArea rows={3} size="large" />
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Order Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined className="text-green-500" />
                <span>Thông tin đơn hàng</span>
              </Space>
            }
            className="h-full shadow-sm border-0"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Space>
                  <FileTextOutlined />
                  <span className="font-medium">Mã đơn hàng:</span>
                </Space>
                <code className="bg-white px-2 py-1 rounded border">
                  {order._id}
                </code>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Space>
                  <TruckOutlined />
                  <span className="font-medium">Phương thức giao hàng:</span>
                </Space>
                <Tag color="blue">{SHIPPING_METHOD[order.shippingMethod]}</Tag>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Space>
                  <CreditCardOutlined />
                  <span className="font-medium">Phương thức thanh toán:</span>
                </Space>
                <Tag color="purple">{PAYMENT_METHOD[order.paymentMethod]}</Tag>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Space>
                  <CheckCircleOutlined />
                  <span className="font-medium">Trạng thái thanh toán:</span>
                </Space>
                <Tag
                  color={order.paymentStatus === "paid" ? "success" : "warning"}
                >
                  {order.paymentStatus === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </Tag>
              </div>

              <Form form={form} disabled={!editMode}>
                <Form.Item label="Trạng thái đơn hàng" name="status">
                  <Select size="large" placeholder="Chọn trạng thái">
                    {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                      <Option key={key} value={key}>
                        <Space>
                          {getStatusIcon(key)}
                          {label}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Ghi chú" name="note">
                  <TextArea
                    rows={3}
                    placeholder="Thêm ghi chú cho đơn hàng..."
                  />
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Products */}
      <Card
        title={
          <Space>
            <ShoppingCartOutlined className="text-purple-500" />
            <span>
              Danh sách sản phẩm ({order.products?.length || 0} sản phẩm)
            </span>
          </Space>
        }
        className="mt-6 shadow-sm border-0"
      >
        <div className="space-y-4">
          {order.products?.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Avatar
                size={80}
                shape="square"
                src={GET_IMAGE(item.productId?.image)}
                className="mr-4"
              />

              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.productId?.name}
                </h4>

                <div className="flex flex-wrap gap-2 mb-2">
                  {Object.entries(item.attributes || {}).map(([key, value]) => (
                    <Tag key={key} color="blue">
                      {key}: {value}
                    </Tag>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Space size="large">
                    <span className="text-gray-600">
                      Giá:{" "}
                      <span className="font-semibold text-blue-600">
                        {item.price?.toLocaleString("vi-VN")}₫
                      </span>
                    </span>
                    <span className="text-gray-600">
                      SL: <span className="font-semibold">{item.quantity}</span>
                    </span>
                  </Space>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {(item.quantity * item.price)?.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí giao hàng:</span>
              <span className="font-semibold text-blue-600">
                {order.shippingFee?.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-semibold text-red-500">
                -{order.discount?.toLocaleString("vi-VN")}₫
              </span>
            </div>

            <Divider className="my-3" />

            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">
                Tổng cộng:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {order.totalAmount?.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Order History */}
      <Card
        title={
          <Space>
            <HistoryOutlined className="text-orange-500" />
            <span>Lịch sử đơn hàng</span>
          </Space>
        }
        className="mt-6 shadow-sm border-0"
      >
        <Table
          columns={historyColumns}
          dataSource={history}
          rowKey={(record, index) => index}
          pagination={false}
          className="order-history-table"
          locale={{
            emptyText: (
              <div className="py-8 text-center">
                <HistoryOutlined className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">Chưa có lịch sử thay đổi</p>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default AdminOrderDetailPage;
