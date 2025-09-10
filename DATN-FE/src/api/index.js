import axiosInstance from "./axiosConfig";

export const uploadImage = async (payload) => {
  const res = await axiosInstance.post("/upload", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
export const uploadImages = async (payload) => {
  const res = await axiosInstance.post("/uploads/multiple", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// User
export const loginUser = async (payload) => {
  const res = await axiosInstance.post("/user/login", payload);
  return res.data;
};
export const registerUser = async (payload) => {
  const res = await axiosInstance.post("/user/register", payload);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axiosInstance.get("/user/" + id);
  return res.data;
};

export const updateUserById = async (id, payload) => {
  const res = await axiosInstance.put("/user/update/" + id, payload);
  return res.data;
};

export const updateCustomerById = async (payload) => {
  const res = await axiosInstance.put("/user/update", payload);
  return res.data;
};

export const getAllUser = async (page, limit) => {
  const res = await axiosInstance.get(`/user/list?page=${page}&limit=${limit}`);
  return res.data;
};

// Product
export const fetchProducts = async (payload) => {
  const res = await axiosInstance.post(`/product/user/list`, payload);
  return res.data;
};

export const getStocks = async (payload) => {
  const res = await axiosInstance.post(`/product/stocks`, payload);
  return res.data;
};

export const relationProduct = async (brandId, categoryId, id) => {
  const res = await axiosInstance.post(`/product/relationProduct`, {
    brandId,
    categoryId,
    id,
  });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axiosInstance.get("/product/" + id);
  return res.data;
};

export const createProduct = async (payload) => {
  // admin
  const res = await axiosInstance.post("/product/create", payload);
  return res.data;
};

export const updateProduct = async ({ id, payload }) => {
  // admin
  const res = await axiosInstance.put("/product/update/" + id, payload);
  return res.data;
};

export const getAllProducts = async ({
  page,
  limit,
  isListProductRemoved,
  filter,
}) => {
  const res = await axiosInstance.get(
    `/product/getAll?page=${page}&limit=${limit}&isListProductRemoved=${isListProductRemoved}&filter=${JSON.stringify(
      filter
    )}`
  );
  return res.data;
};

export const deleteProductById = async ({ id }) => {
  const res = await axiosInstance.delete("/product/delete/" + id);
  return res.data;
};

export const restoreProductById = async ({ id }) => {
  const res = await axiosInstance.put("/product/restore/" + id);
  return res.data;
};

// Order
export const createOrder = async (payload) => {
  const res = await axiosInstance.post("/order", payload);
  return res.data;
};

export const returnOrder = async (payload) => {
  const res = await axiosInstance.post(`/order/returnOrderRequest/`, payload);
  return res.data;
};

export const acceptOrRejectReturn = async (payload) => {
  const res = await axiosInstance.post(`/order/acceptOrRejectReturn/`, payload);
  return res.data;
};

export const checkPayment = async (payload) => {
  const res = await axiosInstance.get("/order/return-payment?" + payload);
  return res.data;
};

export const getOrdersByUserOrGuest = async ({ id, isGuest, page, limit }) => {
  const paramName = isGuest ? "guestId" : "userId";
  const res = await axiosInstance.get(
    `/order/user?${paramName}=${id}&page=${page}&limit=${limit}`
  );
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

export const comfirmDelivery = async (id) => {
  const res = await axiosInstance.post(`/order/comfirmDelivery/${id}`);
  return res.data;
};

export const deleteOrderById = async ({ id }) => {
  const res = await axiosInstance.delete(`/order/${id}`);
  return res.data;
};

export const getAllOrders = async (page, limit) => {
  // admin
  const res = await axiosInstance.get(`/order?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateOrderInfo = async (id, data) => {
  // admin
  const res = await axiosInstance.put(`/order/${id}`, data);
  return res.data;
};

// brand
export const createBrand = async (payload) => {
  const res = await axiosInstance.post("/brand/admin/create", payload);
  return res.data;
};

export const getAllBrands = async (status) => {
  const res = await axiosInstance.get(
    `/brand/admin/list${status ? `?status=${status}` : ""}`
  );
  return res.data;
};

export const updateBrand = async (payload) => {
  const res = await axiosInstance.put("/brand/admin/update", payload);
  return res.data;
};

export const deleteBrand = async ({ ids }) => {
  const res = await axiosInstance.delete("/brand/admin/delete", { ids });
  return res.data;
};

export const getBrandById = async (id) => {
  const res = await axiosInstance.get("/brand/admin/detail/" + id);
  return res.data;
};

// category
export const createCategory = async (payload) => {
  const res = await axiosInstance.post("/category/admin/create", payload);
  return res.data;
};

export const getAllCategories = async (status) => {
  const res = await axiosInstance.get(
    `/category/admin/list${status ? `?status=${status}` : ""}`
  );
  return res.data;
};

export const updateCategory = async (payload) => {
  const res = await axiosInstance.put("/category/admin/update", payload);
  return res.data;
};

export const deleteCategory = async ({ ids }) => {
  const res = await axiosInstance.delete("/category/admin/delete", { ids });
  return res.data;
};

// voucher
export const createVoucher = async (payload) => {
  const res = await axiosInstance.post("/voucher/admin/create", payload);
  return res.data;
};

export const updateVoucher = async (payload) => {
  const res = await axiosInstance.put("/voucher/admin/update", payload);
  return res.data;
};

export const deleteVoucher = async ({ ids }) => {
  const res = await axiosInstance.delete("/voucher/admin/delete", { ids });
  return res.data;
};

export const getAllVouchers = async ({ status, code, page, limit }) => {
  const res = await axiosInstance.get(
    `/voucher/admin/list?page=${page}&limit=${limit}${
      status ? `&status=${status}` : ""
    }${code ? `&code=${code}` : ""}`
  );
  return res.data;
};

export const checkVoucher = async (code) => {
  const res = await axiosInstance.post(`/voucher/check-voucher/${code}`);
  return res.data;
};

export const getActiveVouchers = async () => {
  const res = await axiosInstance.get(`/voucher/list`);
  return res.data;
};

export const getVoucherById = async (id) => {
  const res = await axiosInstance.get("/voucher/detail/" + id);
  return res.data;
};

// Review

export const createReview = async (payload) => {
  const res = await axiosInstance.post("/review/create", payload);
  return res.data;
};

export const repliesReview = async (payload) => {
  const res = await axiosInstance.post("/review/replies", payload);
  return res.data;
};

export const getreviewById = async (productId) => {
  const res = await axiosInstance.get(`/review/${productId}`);
  return res.data;
};
