import React, { useState, useEffect } from "react";
import { Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const ReturnCountdown = ({ order }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (order.status !== "delivered") return 0;

      const deliveredDate = order.deliveredAt
        ? new Date(order.deliveredAt)
        : new Date(order.updatedAt || order.createdAt);
      const now = new Date();
      const diffHours = Math.floor((now - deliveredDate) / (1000 * 60 * 60));
      const totalHours = 7 * 24; // 7 ngày

      return Math.max(0, totalHours - diffHours);
    };

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000 * 60); // Cập nhật mỗi phút

    return () => clearInterval(interval);
  }, [order]);

  if (timeRemaining <= 0 || order.hasReturnRequest) return null;

  const days = Math.floor(timeRemaining / 24);
  const hours = timeRemaining % 24;

  return (
    <Tag color="orange" icon={<ClockCircleOutlined />}>
      Có thể hoàn hàng: {days}d {hours}h
    </Tag>
  );
};

export default ReturnCountdown;
