"use client";
import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../../store";

type StoreProviderProps = {
  children: React.ReactNode;
  initialLanguage: string;
};

export default function StoreProvider({
  children,
  initialLanguage,
}: StoreProviderProps) {
  const normalizedLanguage = initialLanguage === "ar" ? "ar" : "en";
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore({
      language: { language: normalizedLanguage },
    });
  }

  useEffect(() => {
    localStorage.setItem("ouroubaLanguage", normalizedLanguage);
  }, [normalizedLanguage]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
