import axiosInstance from "./axiosConfig";

export const uploadImage = async (payload) => {
  const res = await axiosInstance.post('/upload', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};
export const uploadImages = async (payload) => {
  const res = await axiosInstance.post('/uploads/multiple', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

// Product
export const fetchProducts = async (page, limit) => {
  const res = await axiosInstance.get(`/product/user/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axiosInstance.get('/product/' + id);
  return res.data;
};

export const createProduct = async (payload) => { // admin
  const res = await axiosInstance.post('/product/create', payload);
  return res.data;
};

export const updateProduct = async ({ id, payload }) => { // admin
  const res = await axiosInstance.put('/product/update/' + id, payload);
  return res.data;
};

export const getAllProducts = async ({ page, limit }) => {
  const res = await axiosInstance.get(`/product/getAll?page=${page}&limit=${limit}`);
  return res.data;
};

export const deleteProductById = async ({ id }) => {
  const res = await axiosInstance.delete('/product/delete/' + id);
  return res.data;
};

export const restoreProductById = async ({ id }) => {
  const res = await axiosInstance.put('/product/restore/' + id);
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

export const getAllOrders = async (page, limit) => { // admin
  const res = await axiosInstance.get(`/order?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateOrderInfo  = async (id, data) => {  // admin
  const res = await axiosInstance.put(`/order/${id}`, data);
  return res.data;
}
