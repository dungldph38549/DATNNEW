import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "checkout_products";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
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
      const { productId, sku } = action.payload;
      const existing = state.products.find(
        (p) => p.productId === productId && (p.sku || null) === (sku || null)
      );
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.products.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
    },
    setMultiProducts: (state, action) => {
      if (Array.isArray(action.payload)) {
        action.payload.forEach((product) => {
          const existing = state.products.find(
            (p) => p.productId === product.productId && (p.sku || null) === (product.sku || null)
          );
          if (existing) {
            existing.quantity += product.quantity || 1;
          } else {
            state.products.push({ ...product, quantity: product.quantity || 1 });
          }
        });
      }
    },
    removeProduct: (state, action) => {
      // action.payload expected: { productId, sku? }
      const { productId, sku = null } = action.payload;
      state.products = state.products.filter(
        (p) => !(p.productId === productId && (p.sku || null) === sku)
      );
    },
    changeQuantity: (state, action) => {
      const { productId, sku = null, delta } = action.payload;
      const product = state.products.find(
        (p) => p.productId === productId && (p.sku || null) === sku
      );
      if (product) {
        product.quantity = Math.max(1, product.quantity + delta);
      }
    },
    setQuantity: (state, action) => {
      const { productId, sku = null, quantity } = action.payload;
      if (quantity < 1) return;
      const product = state.products.find(
        (p) => p.productId === productId && (p.sku || null) === sku
      );
      if (product) {
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