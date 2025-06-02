import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./sildes/counterSlide";

export const store = configureStore({
    reducer: {
        counter: counterReducer 
    },
})