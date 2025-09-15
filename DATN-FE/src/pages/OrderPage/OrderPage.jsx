import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { comfirmDelivery, getOrdersByUserOrGuest } from "../../api/index.js";
import { createReturnRequest } from "../../api/index.js";
import { useNavigate } from "react-router-dom";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD } from "../../const/index.ts";
import { Table, Button, Tag, Spin, Typography, message, Modal } from "antd";
import ReturnOrderModal from "../../components/ReturnOrderModal/ReturnOrderModal.jsx";

const { Title, Text } = Typography;

const OrderPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const [page, setPage] = React.useState(1);
  const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const limit = 10;

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["list-order", user.id, user.isGuest, page],
    queryFn: ({ queryKey }) => {
      const [, id, isGuest] = queryKey;
      return getOrdersByUserOrGuest({ id, isGuest, page, limit });
    },
    enabled: !!user.id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id }) => comfirmDelivery(id),
    onSuccess: () => {
      message.success("Cập nhật thành công");
      queryClient.invalidateQueries({ queryKey: ["list-order"] });
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || "Lỗi khi cập nhật");
    },
  });

  const returnMutation = useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      message.success("Gửi yêu cầu hoàn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["list-order"] });
      setIsReturnModalOpen(false);
      setSelectedOrder(null);
    },
    onError: (err) => {
      message.error(
        err?.response?.data?.message || "Lỗi khi gửi yêu cầu hoàn hàng"
      );
    },
  });

  const handleUpdateSubmit = (id) => {
    updateMutation.mutate({ id });
  };

  const handleOpenReturnModal = (order) => {
    setSelectedOrder(order);
    setIsReturnModalOpen(true);
  };

  const handleReturnSubmit = async (returnData) => {
    try {
      await returnMutation.mutateAsync(returnData);
    } catch (error) {
      console.error("Return request failed:", error);
    }
  };

  const canReturn = (order) => {
    if (order.status !== "delivered") return false;

    const deliveredDate = order.deliveredAt
      ? new Date(order.deliveredAt)
      : new Date(order.updatedAt || order.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));

    return diffDays <= 7 && !order.hasReturnRequest;
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text code>{id.slice(-8)}</Text>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      render: (status, order) => {
        let color = "red";
        let text = ORDER_STATUS_LABELS[status];

        if (status === "pending") color = "gold";
        else if (status === "confirmed") color = "blue";
        else if (status === "shipped") color = "purple";
        else if (status === "delivered") {
          color = "green";
          text = "Đã nhận";
        } else if (status === "return-request") color = "orange";
        else if (status === "canceled") color = "red";

        return (
          <div>
            <Tag color={color}>{text}</Tag>
            {order.hasReturnRequest && (
              <Tag color="orange" className="ml-1">
                Có yêu cầu hoàn hàng
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <Tag color="blue">{PAYMENT_METHOD[method]}</Tag>,
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) =>
        status === "paid" ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => <Text strong>{amount.toLocaleString("vi-VN")}₫</Text>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, order) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => navigate(`/order/${order._id}`)}>
            Chi tiết
          </Button>

          {order.status === "shipped" && (
            <Button
              type="link"
              danger
              onClick={() => handleUpdateSubmit(order._id)}
              loading={updateMutation.isLoading}
            >
              Đã nhận
            </Button>
          )}

          {canReturn(order) && (
            <Button type="link" onClick={() => handleOpenReturnModal(order)}>
              Hoàn hàng
            </Button>
          )}

          {order.hasReturnRequest && (
            <Button type="link" onClick={() => navigate("/return-orders")}>
              Xem hoàn hàng
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-10 mb-10">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Đơn hàng của tôi</Title>
        <Button type="default" onClick={() => navigate("/return-orders")}>
          Quản lý hoàn hàng
        </Button>
      </div>

      {isLoading ? (
        <Spin size="large" className="mt-10" />
      ) : isError ? (
        <Text type="danger" className="mt-10 block">
          Lỗi khi tải đơn hàng.
        </Text>
      ) : orders.data?.length === 0 ? (
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
          scroll={{ x: "max-content" }}
        />
      )}

      <ReturnOrderModal
        visible={isReturnModalOpen}
        onCancel={() => {
          setIsReturnModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleReturnSubmit}
        order={selectedOrder}
        loading={returnMutation.isLoading}
      />
    </div>
  );
};

export default OrderPage;