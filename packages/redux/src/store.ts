import { configureStore } from "@reduxjs/toolkit";
export * from "react-redux";
import balanceReducer from "./slices/balanceslice";
import friendsReducer from "./slices/friendssclice";
import userReducer from "./slices/userslice";
export const store = configureStore({
    reducer: {
        balance: balanceReducer,
        friends: friendsReducer,
        user: userReducer
    },
});
