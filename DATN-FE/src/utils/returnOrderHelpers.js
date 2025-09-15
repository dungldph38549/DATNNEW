import { RETURN_STATUS } from "../constants/returnStatus";

export const canReturnOrder = (order) => {
  if (order.status !== "delivered") return false;

  const deliveredDate = order.deliveredAt
    ? new Date(order.deliveredAt)
    : new Date(order.updatedAt || order.createdAt);
  const now = new Date();
  const diffDays = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));

  return diffDays <= 7 && !order.hasReturnRequest;
};

export const getReturnTimeRemaining = (order) => {
  if (!canReturnOrder(order)) return 0;

  const deliveredDate = order.deliveredAt
    ? new Date(order.deliveredAt)
    : new Date(order.updatedAt || order.createdAt);
  const now = new Date();
  const diffDays = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));

  return 7 - diffDays;
};

export const isReturnRequestEditable = (returnRequest) => {
  return returnRequest.status === RETURN_STATUS.PENDING;
};

export const canUpdateShipping = (returnRequest) => {
  return (
    returnRequest.status === RETURN_STATUS.APPROVED &&
    !returnRequest.trackingNumber
  );
};

export const formatReturnAmount = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + "₫" : "0₫";
};
