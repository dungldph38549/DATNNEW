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
      const existing = state.products.find((p) => p._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.products.push({ ...action.payload, quantity: 1 });
      }
    },
    setMultiProducts: (state, action) => {
      if(action.payload?.length) {
        action.payload.forEach(product => {
          const existing = state.products.find((p) => p._id === product._id);
          if (existing) {
            existing.quantity += product.quantity;
          } else {
            state.products.push({ ...product, quantity: product.quantity });
          }
        });
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
  setMultiProducts,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
