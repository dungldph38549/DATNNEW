import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./sildes/counterSlide";
import checkoutReducer from "./checkout/checkoutSlice";
import cartReducer from "./cart/cartSlice";
import userReducer from "./user/index";
import generalReducer from "./general/index";

export const store = configureStore({
  reducer: {
    checkout: checkoutReducer,
    counter: counterReducer,
    user: userReducer,
    cart: cartReducer,
    general: generalReducer
  },
})

store.subscribe(() => {
  try {
    const state = store.getState();
    const products = state.checkout.products;
    localStorage.setItem("checkout_products", JSON.stringify(products));

    const user = state.user;
    localStorage.setItem("user", JSON.stringify(user));

    const cart = state.cart.products;
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Không thể lưu vào localStorage", e);
  }
});