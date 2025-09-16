import { v4 as uuidv4 } from "uuid";

export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidVietnamesePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, ""); 
  return /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/.test(cleanPhone);
};

export const getOrCreateGuestId = (): string => {
  if (typeof window === "undefined" || !window.localStorage) {
    return uuidv4();
  }

  try {
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  } catch (error) {
    console.warn("Cannot access localStorage:", error);
    return uuidv4();
  }
};

// Enum trạng thái đơn hàng
export enum ORDER_STATUS {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELED = "canceled",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  RETURN_REQUEST = "return-request",
}

export const ORDER_STATUS_LABELS: Record<ORDER_STATUS, string> = {
  [ORDER_STATUS.PENDING]: "Đang xử lý",
  [ORDER_STATUS.CONFIRMED]: "Đã xác nhận",
  [ORDER_STATUS.SHIPPED]: "Đang giao",
  [ORDER_STATUS.DELIVERED]: "Đã giao",
  [ORDER_STATUS.CANCELED]: "Đã hủy",
  [ORDER_STATUS.ACCEPTED]: "Chấp nhận hoàn hàng",
  [ORDER_STATUS.REJECTED]: "Từ chối hoàn hàng",
  [ORDER_STATUS.RETURN_REQUEST]: "Yêu cầu hoàn hàng",
};

// Enum phương thức thanh toán
export enum PAYMENT_METHOD {
  COD = "cod",
  VNPAY = "vnpay",
}

export const PAYMENT_METHOD_LABELS: Record<PAYMENT_METHOD, string> = {
  [PAYMENT_METHOD.COD]: "Thanh toán khi nhận hàng",
  [PAYMENT_METHOD.VNPAY]: "VNPay",
};

// Lấy link ảnh từ server
export const GET_IMAGE = (pathName: string): string => {
  if (!pathName || typeof pathName !== "string") {
    return "";
  }

  const baseUrl = process.env.REACT_APP_API_URL_BACKEND;
  if (!baseUrl) {
    console.warn("REACT_APP_API_URL_BACKEND is not defined");
    return pathName;
  }

  const cleanPath = pathName.startsWith("/") ? pathName.slice(1) : pathName;
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}/image/${cleanPath}`;
};

// Format số điện thoại VN
export const formatVietnamesePhone = (phone: string): string => {
  if (!phone) return "";

  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  if (cleanPhone.startsWith("0") && cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 4)} ${cleanPhone.slice(4, 7)} ${cleanPhone.slice(7)}`;
  }

  if (cleanPhone.startsWith("+84") && cleanPhone.length === 12) {
    return `+84 ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6, 9)} ${cleanPhone.slice(9)}`;
  }

  return phone;
};

// Màu sắc cho từng trạng thái đơn hàng
export const getStatusColor = (status: ORDER_STATUS): string => {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "orange";
    case ORDER_STATUS.CONFIRMED:
      return "blue";
    case ORDER_STATUS.SHIPPED:
      return "purple";
    case ORDER_STATUS.DELIVERED:
      return "green";
    case ORDER_STATUS.CANCELED:
    case ORDER_STATUS.REJECTED:
      return "red";
    case ORDER_STATUS.ACCEPTED:
      return "cyan";
    case ORDER_STATUS.RETURN_REQUEST:
      return "gold";
    default:
      return "default";
  }
};
