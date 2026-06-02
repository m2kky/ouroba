import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export const makeStore = (preloadedState) => configureStore({
  reducer: rootReducer,
  preloadedState,
});

export const store = makeStore();
