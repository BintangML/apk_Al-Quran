import { configureStore } from "@reduxjs/toolkit";
import quranReducer from "../features/quran/quranSlice";

export const store = configureStore({
  reducer: {
    quran: quranReducer,
  },
});