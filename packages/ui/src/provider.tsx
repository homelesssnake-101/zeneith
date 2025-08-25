"use client";
import { Provider } from "react-redux";
import { store } from "@repo/redux/store";


export function AppProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
