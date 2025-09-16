import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cart";

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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const { productId, sku } = action.payload;
      if (!productId) return;
      const existing = state.products.find(
        (p) => p.productId === productId && (p.sku || null) === (sku || null)
      );
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.products.push({ ...action.payload, quantity: action.payload.quantity || 1 });
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
  },
});

export const {
  addProduct,
  removeProduct,
  changeQuantity,
  setQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;