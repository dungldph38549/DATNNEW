import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table, Button, Tag, Typography, message, Modal, Space } from "antd";
import { EyeOutlined, TruckOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getUserReturnRequests,
  updateReturnShipping,
  cancelReturnRequest,
} from "../../api/index";
import {
  RETURN_STATUS_LABELS,
  RETURN_STATUS,
} from "../../constants/returnStatus";
import ReturnShippingModal from "../../components/ReturnShippingModal/ReturnShippingModal";

const { Title, Text } = Typography;

const ReturnOrdersPage = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [shippingModalVisible, setShippingModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const { data: returns = [], isLoading } = useQuery({
    queryKey: ["return-orders", user.id, page],
    queryFn: () => getUserReturnRequests({ userId: user.id, page, limit: 10 }),
    enabled: !!user.id,
  });

  const updateShippingMutation = useMutation({
    mutationFn: updateReturnShipping,
    onSuccess: () => {
      message.success("Cập nhật thông tin vận chuyển thành công");
      queryClient.invalidateQueries({ queryKey: ["return-orders"] });
      setShippingModalVisible(false);
      setSelectedReturn(null);
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelReturnRequest,
    onSuccess: () => {
      message.success("Hủy yêu cầu hoàn hàng thành công");
      queryClient.invalidateQueries({ queryKey: ["return-orders"] });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleUpdateShipping = (returnRequest) => {
    setSelectedReturn(returnRequest);
    setShippingModalVisible(true);
  };

  const handleCancelReturn = (returnId) => {
    Modal.confirm({
      title: "Xác nhận hủy yêu cầu hoàn hàng",
      content: "Bạn có chắc chắn muốn hủy yêu cầu hoàn hàng này?",
      onOk: () => cancelMutation.mutate(returnId),
    });
  };

  const columns = [
    {
      title: "Mã hoàn hàng",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <Text code>{id.slice(-8)}</Text>,
    },
    {
      title: "Đơn hàng",
      dataIndex: ["order", "_id"],
      key: "orderId",
      render: (orderId) => <Text code>{orderId?.slice(-8)}</Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const getColor = () => {
          switch (status) {
            case RETURN_STATUS.PENDING:
              return "orange";
            case RETURN_STATUS.APPROVED:
              return "blue";
            case RETURN_STATUS.SHIPPED:
              return "purple";
            case RETURN_STATUS.RECEIVED:
              return "green";
            case RETURN_STATUS.REFUNDED:
              return "success";
            case RETURN_STATUS.REJECTED:
              return "red";
            default:
              return "default";
          }
        };

        return <Tag color={getColor()}>{RETURN_STATUS_LABELS[status]}</Tag>;
      },
    },
    {
      title: "Số tiền hoàn",
      dataIndex: "refundAmount",
      key: "refundAmount",
      render: (amount) => (
        <Text strong>{amount?.toLocaleString("vi-VN")}₫</Text>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() =>
              window.open(`/return-orders/${record._id}`, "_blank")
            }
          >
            Chi tiết
          </Button>

          {record.status === RETURN_STATUS.APPROVED &&
            !record.trackingNumber && (
              <Button
                type="link"
                icon={<TruckOutlined />}
                onClick={() => handleUpdateShipping(record)}
              >
                Cập nhật vận đơn
              </Button>
            )}

          {record.status === RETURN_STATUS.PENDING && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleCancelReturn(record._id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-10 mb-10">
      <Title level={2}>Yêu cầu hoàn hàng</Title>

      <Table
        columns={columns}
        dataSource={returns.data || []}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          current: page,
          total: returns.total || 0,
          pageSize: 10,
          onChange: setPage,
        }}
        scroll={{ x: "max-content" }}
      />

      <ReturnShippingModal
        visible={shippingModalVisible}
        onCancel={() => {
          setShippingModalVisible(false);
          setSelectedReturn(null);
        }}
        onSubmit={(data) => updateShippingMutation.mutate(data)}
        returnRequest={selectedReturn}
        loading={updateShippingMutation.isLoading}
      />
    </div>
  );
};

export default ReturnOrdersPage;
