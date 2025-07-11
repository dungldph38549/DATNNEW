import axiosInstance from "./axiosConfig";

// Product
export const fetchProducts = async () => {
  const res = await axiosInstance.get('/product/getAll');
  return res.data;
};

// Order
export const createOrder = async (payload) => {
  const res = await axiosInstance.post('/order', payload);
  return res.data;
};

export const getOrdersByUserOrGuest = async ({ id, isGuest }) => {
  const paramName = isGuest ? 'guestId' : 'userId';
  const res = await axiosInstance.get(`/order/user?${paramName}=${id}`);
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await axiosInstance.get(`/order/${id}`);
  return res.data;
};

export const updateOrder = async (id, payload) => {
  const res = await axiosInstance.patch(`/order/${id}`, payload);
  return res.data;
};

export const deleteOrderById = async ({ id }) => {
  const res = await axiosInstance.delete(`/order/${id}`);
  return res.data;
};