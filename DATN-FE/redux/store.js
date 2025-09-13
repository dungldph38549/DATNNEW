import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./sildes/counterSlide";
import checkoutReducer from "./checkout/checkoutSlice"; 
import userReducer from "./user/index"; 

export const store = configureStore({
    reducer: {
        checkout: checkoutReducer,
        counter: counterReducer,
        user: userReducer
    },
})

store.subscribe(() => {
  try {
    const state = store.getState();
    const products = state.checkout.products;
    localStorage.setItem("checkout_products", JSON.stringify(products));
  } catch (e) {
    console.error("Không thể lưu vào localStorage", e);
  }
});