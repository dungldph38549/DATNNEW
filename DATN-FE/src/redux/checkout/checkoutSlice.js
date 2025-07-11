import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("checkout_products");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState = {
  products: loadFromLocalStorage(),
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const existing = state.products.find((p) => p._id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    changeQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const product = state.products.find((p) => p._id === id);
      if (product) {
        product.quantity = Math.max(1, product.quantity + delta);
      }
    },
    setProduct: (state, action) => {
      const product = action.payload;
      state.products = [{...product, quantity: 1}];
    },
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p._id === id);
      if (product && quantity >= 1) {
        product.quantity = quantity;
      }
    },
    clearProduct: (state) => {
      state.products = [];
    },
  },
});

export const {
  addProduct,
  removeProduct,
  changeQuantity,
  setQuantity,
  clearProduct,
  setProduct,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
