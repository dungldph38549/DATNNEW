import axios from "axios";
import axiosInstance from "./axiosConfig";

export const uploadImage = async (payload) => {
  const res = await axiosInstance.post('/upload', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};
export const uploadImages = async (payload) => {
  const res = await axiosInstance.post('/uploads/multiple', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
};

// User
export const loginUser = async (payload) => {
  const res = await axiosInstance.post('/user/login', payload);
  return res.data;
};
export const registerUser = async (payload) => {
  const res = await axiosInstance.post('/user/register', payload);
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axiosInstance.get('/user/' + id);
  return res.data;
};

export const updateUserById = async (id, payload) => {
  const res = await axiosInstance.put('/user/update/' + id, payload);
  return res.data;
};

export const updateCustomerById = async (payload) => {
  const res = await axiosInstance.put('/user/update', payload);
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
  const res = await axiosInstance.post(`/product/relationProduct`, { brandId, categoryId, id });
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

export const getAllProducts = async ({ page, limit, isListProductRemoved, filter }) => {
  const res = await axiosInstance.get(`/product/getAll?page=${page}&limit=${limit}&isListProductRemoved=${isListProductRemoved}&filter=${JSON.stringify(filter)}`);
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

export const returnOrder = async (payload) => {
  const res = await axiosInstance.post(`/order/returnOrderRequest/`, payload);
  return res.data;
};

export const acceptOrRejectReturn = async (payload) => {
  const res = await axiosInstance.post(`/order/acceptOrRejectReturn/`, payload);
  return res.data;
}

export const checkPayment = async (payload) => {
  const res = await axiosInstance.get('/order/return-payment?'+payload);
  return res.data;
};

export const getOrdersByUserOrGuest = async ({ id, isGuest, page, limit }) => {
  const paramName = isGuest ? 'guestId' : 'userId';
  const res = await axiosInstance.get(`/order/user?${paramName}=${id}&page=${page}&limit=${limit}`);
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

export const getAllOrders = async (page, limit) => { // admin
  const res = await axiosInstance.get(`/order?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateOrderInfo  = async (id, data) => {  // admin
  const res = await axiosInstance.put(`/order/${id}`, data);
  return res.data;
}

// brand
export const createBrand = async (payload) => {
  const res = await axiosInstance.post('/brand/admin/create', payload);
  return res.data;
};

export const getAllBrands = async (status) => {
  const res = await axiosInstance.get(`/brand/admin/list${status ? `?status=${status}` : ''}`);
  return res.data;
};

export const updateBrand = async (payload) => {
  const res = await axiosInstance.put('/brand/admin/update', payload);
  return res.data;
};

export const deleteBrand = async ({ids}) => {
  const res = await axiosInstance.delete('/brand/admin/delete', {ids});
  return res.data;
};

export const getBrandById = async (id) => {
  const res = await axiosInstance.get('/brand/admin/detail/' + id);
  return res.data;
};

// category
export const createCategory = async (payload) => {
  const res = await axiosInstance.post('/category/admin/create', payload);
  return res.data;
};

export const getAllCategories = async (status) => {
  const res = await axiosInstance.get(`/category/admin/list${status ? `?status=${status}` : ''}`);
  return res.data;
};

export const updateCategory = async (payload) => {
  const res = await axiosInstance.put('/category/admin/update', payload);
  return res.data;
};

export const deleteCategory = async ({ids}) => {
  const res = await axiosInstance.delete('/category/admin/delete', {ids});
  return res.data;
};

// voucher
export const createVoucher = async (payload) => {
  const res = await axiosInstance.post('/voucher/admin/create', payload);
  return res.data;
};

export const updateVoucher = async (payload) => {
  const res = await axiosInstance.put('/voucher/admin/update', payload);
  return res.data;
};

export const deleteVoucher = async ({ids}) => {
  const res = await axiosInstance.delete('/voucher/admin/delete', {ids});
  return res.data;
};

export const getAllVouchers = async ({status, code, page, limit}) => {
  const res = await axiosInstance.get(`/voucher/admin/list?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${code ? `&code=${code}` : ''}`);
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
  const res = await axiosInstance.get('/voucher/detail/' + id);
  return res.data;
};

// Review

export const createReview = async (payload) => {
  const res = await axiosInstance.post('/review/create', payload);
  return res.data;
};

export const repliesReview = async (payload) => {
  const res = await axiosInstance.post('/review/replies', payload);
  return res.data;
};

export const getreviewById = async (productId) => {
  const res = await axiosInstance.get(`/review/${productId}`);
  return res.data;
};
// Tạo yêu cầu hoàn hàng
export const createReturnRequest = async (data) => {
  const response = await axiosInstance.post("/return-orders", data);
  return response.data;
};

// Lấy danh sách yêu cầu hoàn hàng của user
export const getUserReturnRequests = async ({
  userId,
  page = 1,
  limit = 10,
}) => {
  const response = await axiosInstance.get("/return-orders/user", {
    params: { userId, page, limit },
  });
  return response.data;
};

// Lấy chi tiết yêu cầu hoàn hàng
export const getReturnRequestDetail = async (returnId) => {
  const response = await axiosInstance.get(`/return-orders/${returnId}`);
  return response.data;
};

// Cập nhật thông tin gửi hàng hoàn
export const updateReturnShipping = async ({
  returnId,
  trackingNumber,
  shippingProvider,
}) => {
  const response = await axiosInstance.put(
    `/return-orders/${returnId}/shipping`,
    {
      trackingNumber,
      shippingProvider,
    }
  );
  return response.data;
};

// Hủy yêu cầu hoàn hàng (chỉ khi đang pending)
export const cancelReturnRequest = async (returnId) => {
  const response = await axiosInstance.delete(`/return-orders/${returnId}`);
  return response.data;
};
// api/index.js - Fixed API functions

// Constants
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper functions
const getToken = () => {
  try {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  } catch (error) {
    console.warn("Storage access error:", error);
    return null;
  }
};

const getCurrentUserId = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id || payload.sub;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Generic API request function with improved error handling
const makeAPIRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body,
    params,
    skipAuth = false,
    ...otherOptions
  } = options;

  try {
    let url = `${API_BASE_URL}${endpoint}`;

    // Add query parameters if provided
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    // Build headers
    const headers = {
      "Content-Type": "application/json",
      ...otherOptions.headers,
    };

    // Add authorization header if not skipping auth
    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers,
      ...otherOptions,
    };

    // Add body for POST/PUT/PATCH requests
    if (body && ["POST", "PUT", "PATCH"].includes(method)) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // Handle different status codes
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      let errorData = null;

      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData.msg ||
            errorMessage;
        } else {
          errorMessage =
            (await response.text()) || response.statusText || errorMessage;
        }
      } catch (e) {
        console.warn("Could not parse error response:", e);
      }

      // Handle specific status codes
      if (response.status === 401) {
        // Clear invalid token
        try {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        } catch (e) {
          console.warn("Could not clear tokens:", e);
        }
        throw new Error("Unauthorized - Please login again");
      } else if (response.status === 403) {
        throw new Error("Forbidden - You do not have permission");
      } else if (response.status === 404) {
        throw new Error("Resource not found");
      } else if (response.status >= 500) {
        throw new Error("Server error - Please try again later");
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle different response types
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      return jsonData;
    }
    return await response.text();
  } catch (error) {
    // Network or other errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error("Network error:", error);
      throw new Error("Network error - Please check your internet connection");
    }

    console.error(`API Request Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// ==============================================================================
// RETURN MANAGEMENT APIs
// ==============================================================================

export const returnAPI = {
  // Get all return requests with pagination and filtering
  getAll: async (page = 1, limit = 10, status = "") => {
    try {
      return await makeAPIRequest("/orders/admin/returns", {
        params: { page, limit, status },
      });
    } catch (error) {
      console.error("Error fetching return requests:", error);
      throw error;
    }
  },

  // Get specific return request details
  getById: async (orderId) => {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    try {
      return await makeAPIRequest(`/orders/admin/returns/${orderId}`);
    } catch (error) {
      console.error(`Error fetching return request ${orderId}:`, error);
      throw error;
    }
  },

  // Accept or reject return request
  processReturn: async ({ id, note = "", status, refundAmount }) => {
    if (!id || !status) {
      throw new Error("ID and status are required");
    }

    const normalizedStatus = status.toLowerCase();
    if (!["accepted", "rejected"].includes(normalizedStatus)) {
      throw new Error('Status must be either "accepted" or "rejected"');
    }

    try {
      return await makeAPIRequest("/orders/admin/returns/accept-reject", {
        method: "POST",
        body: {
          id,
          note: note || "",
          status: normalizedStatus,
          refundAmount: refundAmount || 0,
        },
      });
    } catch (error) {
      console.error("Error processing return request:", error);
      throw error;
    }
  },

  // Get return statistics
  getStatistics: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      return await makeAPIRequest("/orders/admin/returns/statistics", {
        params,
      });
    } catch (error) {
      console.error("Error fetching return statistics:", error);
      throw error;
    }
  },
};

// ==============================================================================
// WALLET MANAGEMENT APIs (Admin)
// ==============================================================================

export const walletAdminAPI = {
  // Get all wallets with pagination and search
  getAll: async (page = 1, limit = 10, search = "") => {
    try {
      return await makeAPIRequest("/wallet/admin/all", {
        params: { page, limit, search },
      });
    } catch (error) {
      console.error("Error fetching all wallets:", error);
      throw error;
    }
  },

  // Get specific user's wallet
  getUserWallet: async (userId) => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      return await makeAPIRequest(`/wallet/user/${userId}`);
    } catch (error) {
      console.error(`Error fetching wallet for user ${userId}:`, error);
      throw error;
    }
  },

  // Get user's wallet transactions
  getUserTransactions: async (userId, page = 1, limit = 10, type = "") => {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      return await makeAPIRequest(`/wallet/user/${userId}/transactions`, {
        params: { page, limit, type },
      });
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      throw error;
    }
  },

  // Withdraw money from user's wallet
  withdraw: async ({ userId, amount, description = "" }) => {
    if (!userId || !amount) {
      throw new Error("User ID and amount are required");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error("Amount must be a positive number");
    }

    try {
      return await makeAPIRequest("/wallet/admin/withdraw", {
        method: "POST",
        body: {
          userId,
          amount: numAmount,
          description: description || "",
        },
      });
    } catch (error) {
      console.error("Error withdrawing money:", error);
      throw error;
    }
  },
};

// ==============================================================================
// WALLET APIs (User)
// ==============================================================================

export const walletUserAPI = {
  // Get current user's wallet
  getMy: async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      return await makeAPIRequest(`/wallet/user/${userId}`);
    } catch (error) {
      console.error("Error fetching user wallet:", error);
      throw error;
    }
  },

  // Get current user's wallet transactions
  getMyTransactions: async (page = 1, limit = 10, type = "") => {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      return await makeAPIRequest(`/wallet/user/${userId}/transactions`, {
        params: { page, limit, type },
      });
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      throw error;
    }
  },
};

// ==============================================================================
// BACKWARD COMPATIBILITY (Legacy functions)
// ==============================================================================

// Maintain backward compatibility for existing code
export const getAllReturnRequests = returnAPI.getAll;
export const getReturnRequest = returnAPI.getById;
// export const acceptOrRejectReturn = returnAPI.processReturn;
export const getReturnStatistics = returnAPI.getStatistics;

export const getAllWallets = walletAdminAPI.getAll;
export const getUserWallet = walletAdminAPI.getUserWallet;
export const getWalletTransactions = walletAdminAPI.getUserTransactions;
export const withdrawMoney = walletAdminAPI.withdraw;

export const getMyWallet = walletUserAPI.getMy;
export const getMyWalletTransactions = walletUserAPI.getMyTransactions;

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    try {
      const token = getToken();
      if (!token) return false;

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp ? payload.exp > currentTime : true;
      } catch (e) {
        return false;
      }
    } catch (error) {
      console.warn("Error checking authentication:", error);
      return false;
    }
  },

  // Clear authentication
  clearAuth: () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.warn("Error clearing auth:", error);
    }
  },

  // Get current user info from token
  getCurrentUser: () => {
    const token = getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Format error message for display
  formatError: (error) => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.error) return error.error;
    return "An unexpected error occurred";
  },

  // Check if error is network related
  isNetworkError: (error) => {
    return (
      error?.message?.includes("Network error") ||
      error?.message?.includes("fetch") ||
      error?.name === "TypeError"
    );
  },
};

// Default export with organized structure
export default {
  return: returnAPI,
  walletAdmin: walletAdminAPI,
  walletUser: walletUserAPI,
  utils: apiUtils,
};
