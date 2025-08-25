import { configureStore } from "@reduxjs/toolkit";
export * from "react-redux";
import balanceReducer from "./slices/balanceslice";
export const store = configureStore({
    reducer: {
        balance: balanceReducer
    },
});
