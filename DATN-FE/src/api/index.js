import axiosInstance from "./axiosConfig";

// ================== Upload ==================
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

// ================== User ==================
export const loginUser = async (payload) => {
  const res = await axiosInstance.post("/user/login", payload);
  return res.data;
};

export const registerUser = async (payload) => {
  const res = await axiosInstance.post("/user/register", payload);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axiosInstance.get(`/user/${id}`);
  return res.data;
};

export const updateUserById = async (id, payload) => {
  const res = await axiosInstance.put(`/user/update/${id}`, payload);
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

// ================== Product ==================
export const fetchProducts = async (payload) => {
  const res = await axiosInstance.post("/product/user/list", payload);
  return res.data;
};

export const getStocks = async (payload) => {
  const res = await axiosInstance.post("/product/stocks", payload);
  return res.data;
};

export const relationProduct = async (brandId, categoryId, id) => {
  const res = await axiosInstance.post("/product/relationProduct", {
    brandId,
    categoryId,
    id,
  });
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axiosInstance.get(`/product/${id}`);
  return res.data;
};

export const createProduct = async (payload) => {
  // admin
  const res = await axiosInstance.post("/product/create", payload);
  return res.data;
};

export const updateProduct = async ({ id, payload }) => {
  // admin
  const res = await axiosInstance.put(`/product/update/${id}`, payload);
  return res.data;
};

export const getAllProducts = async ({
  page,
  limit,
  isListProductRemoved,
  filter,
}) => {
  const res = await axiosInstance.get(
    `/product/getAll?page=${page}&limit=${limit}&isListProductRemoved=${isListProductRemoved}&filter=${encodeURIComponent(
      JSON.stringify(filter)
    )}`
  );
  return res.data;
};

export const deleteProductById = async ({ id }) => {
  const res = await axiosInstance.delete(`/product/delete/${id}`);
  return res.data;
};

export const restoreProductById = async ({ id }) => {
  const res = await axiosInstance.put(`/product/restore/${id}`);
  return res.data;
};

// ================== Order ==================
export const createOrder = async (payload) => {
  const res = await axiosInstance.post("/order", payload);
  return res.data;
};

export const orderReturn = async () => {
  const res = await axiosInstance.get("/order/order-return");
  return res.data;
};

export const returnOrder = async (payload) => {
  const res = await axiosInstance.post("/order/returnOrderRequest", payload);
  return res.data;
};

export const acceptOrRejectReturn = async (payload) => {
  const res = await axiosInstance.post("/order/acceptOrRejectReturn", payload);
  return res.data;
};

export const checkPayment = async (payload) => {
  const res = await axiosInstance.get(`/order/return-payment?${payload}`);
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

export const confirmDelivery = async (id) => {
  const res = await axiosInstance.post(`/order/confirmDelivery/${id}`);
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
export const getUserOrders = async ({ page, limit, status, userId }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    userId,
  });

  const response = await fetch(`/api/orders/user?${params}`);
  return response.json();
};

// ===== Brand API =====
export const createBrand = async (payload) => {
  const res = await axiosInstance.post("/brand/admin/create", {
    name: payload.name,
    image: payload.image,
    status: payload.status,
  });
  return res.data;
};

export const getAllBrands = async (status) => {
  const res = await axiosInstance.get(
    `/brand/admin/list${status ? `?status=${status}` : ""}`
  );
  return res.data;
};

export const updateBrand = async ({ id, data }) => {
  const res = await axiosInstance.put(`/brand/admin/update/${id}`, {
    name: data.name,
    image: data.image,
    status: data.status,
  });
  return res.data;
};

export const deleteBrand = async ({ ids }) => {
  const res = await axiosInstance.delete("/brand/admin/delete", {
    data: { ids },
  });
  return res.data;
};

export const getBrandById = async (id) => {
  const res = await axiosInstance.get(`/brand/admin/detail/${id}`);
  return res.data;
};

// ================== Category ==================
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
  const res = await axiosInstance.delete("/category/admin/delete", {
    data: { ids },
  });
  return res.data;
};

// ================== Voucher ==================
export const createVoucher = async (payload) => {
  const res = await axiosInstance.post("/voucher/admin/create", payload);
  return res.data;
};

export const updateVoucher = async (payload) => {
  const res = await axiosInstance.put("/voucher/admin/update", payload);
  return res.data;
};

export const deleteVoucher = async ({ ids }) => {
  const res = await axiosInstance.delete("/voucher/admin/delete", {
    data: { ids },
  });
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
  const res = await axiosInstance.get("/voucher/list");
  return res.data;
};

export const getVoucherById = async (id) => {
  const res = await axiosInstance.get(`/voucher/detail/${id}`);
  return res.data;
};

// ================== Review ==================
export const createReview = async (payload) => {
  const res = await axiosInstance.post("/review/create", payload);
  return res.data;
};

export const repliesReview = async (payload) => {
  const res = await axiosInstance.post("/review/replies", payload);
  return res.data;
};

export const getReviewById = async (productId) => {
  const res = await axiosInstance.get(`/review/${productId}`);
  return res.data;
};
export const getInventoryHistory = async (productId) => {
  const res = await axiosInstance.get(`/inventory/history/${productId}`);
  return res.data;
};

export const createInventoryTransaction = async (payload) => {
  const res = await axiosInstance.post("/inventory/transaction", payload);
  return res.data;
};
// Staff management APIs
export const createUser = async (payload) => {
  const res = await axiosInstance.post("/user/create", payload);
  return res.data;
};

export const getStaffList = async (params) => {
  const res = await axiosInstance.get("/user/staff", { params });
  return res.data;
};

export const updateStaffRole = async (id, role) => {
  const res = await axiosInstance.put(`/user/${id}/role`, { role });
  return res.data;
};

// Base URL cho staff API
const STAFF_API_BASE = "/staff";

// Lấy danh sách tất cả nhân viên
export const getAllStaff = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 1000,
      search = "",
      role = "all",
      status = "all",
      department = "all",
      position = "all",
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(role !== "all" && { role }),
      ...(status !== "all" && { status }),
      ...(department !== "all" && { department }),
      ...(position !== "all" && { position }),
    });

    const response = await axiosInstance.get(
      `${STAFF_API_BASE}?${queryParams}`
    );
    return response.data;
  } catch (error) {
    console.error("Get all staff error:", error);
    throw error;
  }
};

// Tạo nhân viên mới
export const createStaff = async (staffData) => {
  try {
    const response = await axiosInstance.post(STAFF_API_BASE, staffData);
    return response.data;
  } catch (error) {
    console.error("Create staff error:", error);
    throw error;
  }
};

// Cập nhật thông tin nhân viên
export const updateStaff = async (staffId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `${STAFF_API_BASE}/${staffId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Update staff error:", error);
    throw error;
  }
};

// Xóa nhân viên (soft delete)
export const deleteStaff = async (staffId) => {
  try {
    const response = await axiosInstance.delete(`${STAFF_API_BASE}/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Delete staff error:", error);
    throw error;
  }
};

// Lấy chi tiết nhân viên
export const getStaffById = async (staffId) => {
  try {
    const response = await axiosInstance.get(`${STAFF_API_BASE}/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Get staff by id error:", error);
    throw error;
  }
};

// Lấy thống kê nhân viên
export const getStaffStatistics = async () => {
  try {
    const response = await axiosInstance.get(`${STAFF_API_BASE}/statistics`);
    return response.data;
  } catch (error) {
    console.error("Get staff statistics error:", error);
    throw error;
  }
};

// Tìm kiếm nhân viên
export const searchStaff = async (searchTerm, filters = {}) => {
  try {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return await getAllStaff(params);
  } catch (error) {
    console.error("Search staff error:", error);
    throw error;
  }
};

// Lọc nhân viên theo phòng ban
export const getStaffByDepartment = async (department) => {
  try {
    return await getAllStaff({ department });
  } catch (error) {
    console.error("Get staff by department error:", error);
    throw error;
  }
};

// Lọc nhân viên theo vai trò
export const getStaffByRole = async (role) => {
  try {
    return await getAllStaff({ role });
  } catch (error) {
    console.error("Get staff by role error:", error);
    throw error;
  }
};

// Lấy nhân viên đang hoạt động
export const getActiveStaff = async () => {
  try {
    return await getAllStaff({ status: "active" });
  } catch (error) {
    console.error("Get active staff error:", error);
    throw error;
  }
};

// Lấy nhân viên đã ngưng hoạt động
export const getInactiveStaff = async () => {
  try {
    return await getAllStaff({ status: "inactive" });
  } catch (error) {
    console.error("Get inactive staff error:", error);
    throw error;
  }
};
