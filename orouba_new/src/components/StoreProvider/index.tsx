"use client";
import React, { useLayoutEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../../store";
import { change2 } from "../../store/languageReducer";

type StoreProviderProps = {
  children: React.ReactNode;
  initialLanguage: string;
};

export default function StoreProvider({
  children,
  initialLanguage,
}: StoreProviderProps) {
  const normalizedLanguage = initialLanguage === "ar" ? "ar" : "en";
  const [store] = useState(() =>
    makeStore({
      language: { language: normalizedLanguage },
    })
  );

  useLayoutEffect(() => {
    if (store.getState().language.language !== normalizedLanguage) {
      store.dispatch(change2(normalizedLanguage));
    }
    localStorage.setItem("ouroubaLanguage", normalizedLanguage);
  }, [normalizedLanguage, store]);

  return <Provider store={store}>{children}</Provider>;
}
