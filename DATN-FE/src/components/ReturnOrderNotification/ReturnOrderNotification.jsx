import React from "react";
import { notification, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { RETURN_STATUS_LABELS } from "../../constants/returnStatus";

export const showReturnOrderNotification = (returnRequest, navigate) => {
  const { status, _id } = returnRequest;

  let title = "Cập nhật yêu cầu hoàn hàng";
  let description = "";
  let type = "info";

  switch (status) {
    case "return-approved":
      title = "Yêu cầu hoàn hàng được chấp nhận";
      description = "Bạn có thể gửi hàng theo địa chỉ được cung cấp";
      type = "success";
      break;
    case "return-rejected":
      title = "Yêu cầu hoàn hàng bị từ chối";
      description = "Xem chi tiết lý do từ chối";
      type = "error";
      break;
    case "return-received":
      title = "Shop đã nhận hàng hoàn";
      description = "Tiền sẽ được hoàn lại trong 1-3 ngày làm việc";
      type = "info";
      break;
    case "return-refunded":
      title = "Đã hoàn tiền thành công";
      description = "Số tiền đã được chuyển về tài khoản của bạn";
      type = "success";
      break;
  }

  notification[type]({
    message: title,
    description,
    duration: 0,
    btn: (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          navigate(`/return-orders/${_id}`);
          notification.destroy();
        }}
      >
        Xem chi tiết
      </Button>
    ),
  });
};
