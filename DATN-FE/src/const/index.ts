import { v4 as uuidv4 } from 'uuid';

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const isValidVietnamesePhone = (phone: string) => {
  return /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/.test(phone);
};

export const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem('guest_id');
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem('guest_id', guestId);
  }
  return guestId;
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Đang xử lý',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã hủy',
};

export const PAYMENT_METHOD: Record<string, string> = {
  cod: 'COD',
  vnpay: 'VNPay',
};

export const GET_IMAGE = (path_name: string) => {
  return process.env.REACT_APP_API_URL_BACKEND + '/image/' + path_name;
};
