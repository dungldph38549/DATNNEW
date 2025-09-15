import React from "react";
import { Steps, Tag, Card, Timeline, Button } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  RETURN_STATUS,
  RETURN_STATUS_LABELS,
} from "../../constants/returnStatus";

const ReturnStatus = ({ returnRequest }) => {
  // Kiểm tra returnRequest tồn tại
  if (!returnRequest) {
    return (
      <Card title="Trạng thái hoàn hàng" className="mb-4">
        <div className="text-center text-gray-500">
          Không có thông tin yêu cầu hoàn hàng
        </div>
      </Card>
    );
  }

  const getStatusStep = (status) => {
    switch (status) {
      case RETURN_STATUS.PENDING:
        return 0;
      case RETURN_STATUS.APPROVED:
        return 1;
      case RETURN_STATUS.SHIPPED:
        return 2;
      case RETURN_STATUS.RECEIVED:
        return 3;
      case RETURN_STATUS.REFUNDED:
        return 4;
      case RETURN_STATUS.REJECTED:
        return -1;
      default:
        return 0;
    }
  };

  const getStatusColor = (status) => {
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

  const currentStep = getStatusStep(returnRequest.status);

  if (returnRequest.status === RETURN_STATUS.REJECTED) {
    return (
      <Card title="Trạng thái hoàn hàng" className="mb-4">
        <div className="text-center">
          <CloseCircleOutlined className="text-red-500 text-4xl mb-2" />
          <div className="text-lg font-medium text-red-500 mb-2">
            Yêu cầu hoàn hàng bị từ chối
          </div>
          <div className="text-gray-600">
            Lý do: {returnRequest.rejectionReason || "Không có lý do cụ thể"}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Trạng thái hoàn hàng" className="mb-4">
      <div className="mb-4">
        <Tag color={getStatusColor(returnRequest.status)} className="mb-2">
          {RETURN_STATUS_LABELS[returnRequest.status] || returnRequest.status}
        </Tag>
      </div>

      <Steps current={currentStep} className="mb-6">
        <Steps.Step
          title="Chờ xử lý"
          icon={<ClockCircleOutlined />}
          description="Shop đang xem xét yêu cầu"
        />
        <Steps.Step
          title="Đã chấp nhận"
          icon={<CheckCircleOutlined />}
          description="Yêu cầu được chấp thuận"
        />
        <Steps.Step
          title="Gửi hàng hoàn"
          icon={<TruckOutlined />}
          description="Khách hàng gửi hàng về"
        />
        <Steps.Step
          title="Đã nhận hàng"
          icon={<CheckCircleOutlined />}
          description="Shop đã nhận hàng hoàn"
        />
        <Steps.Step
          title="Đã hoàn tiền"
          icon={<DollarOutlined />}
          description="Tiền đã được hoàn lại"
        />
      </Steps>

      {returnRequest.timeline && returnRequest.timeline.length > 0 && (
        <Timeline className="mt-4">
          {returnRequest.timeline.map((event, index) => (
            <Timeline.Item key={index}>
              <div className="font-medium">
                {event.title || "Cập nhật trạng thái"}
              </div>
              <div className="text-sm text-gray-500">
                {event.description || ""}
              </div>
              <div className="text-xs text-gray-400">
                {event.createdAt
                  ? new Date(event.createdAt).toLocaleString("vi-VN")
                  : ""}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}

      {returnRequest.status === RETURN_STATUS.APPROVED &&
        !returnRequest.trackingNumber && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <div className="font-medium text-blue-800 mb-2">
              Hướng dẫn gửi hàng hoàn:
            </div>
            <div className="text-sm text-blue-700">
              1. Đóng gói cẩn thận sản phẩm
              <br />
              2. Gửi đến địa chỉ:{" "}
              {returnRequest.returnAddress || "Chưa có địa chỉ"}
              <br />
              3. Cập nhật mã vận đơn sau khi gửi
            </div>
          </div>
        )}
    </Card>
  );
};

export default ReturnStatus;
