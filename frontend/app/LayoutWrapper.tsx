"use client";

import ItemLoader from "@/lib/ItemLoader";
import { persister, store } from "@/store/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import AuthCheck from "@/store/Provider/AuthProvider";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <Toaster />
        <AuthCheck>
          {children}
        </AuthCheck>
      </PersistGate>
    </Provider>
  );
}
