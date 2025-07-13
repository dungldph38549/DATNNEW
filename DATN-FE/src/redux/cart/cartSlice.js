import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("cart");
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
      if(!action.payload._id) return
      const existing = state.products.find((p) => p._id === action.payload._id);
      console.log(action.payload);
      
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
    setQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((p) => p._id === id);
      if (product && quantity >= 1) {
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
