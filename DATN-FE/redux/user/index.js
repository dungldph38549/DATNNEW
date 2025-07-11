import { createSlice } from "@reduxjs/toolkit";
import { getOrCreateGuestId } from "../../const/index.ts";

const initialState = {
  id: getOrCreateGuestId(),
  name: "",
  email: "",
  isGuest: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
        id: action.payload._id,
        isGuest: false,
      };
    },
    clearUser: () => initialState,
    updateUserInfo: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { initializeUser, setUser, clearUser, updateUserInfo } = userSlice.actions;

export default userSlice.reducer;
