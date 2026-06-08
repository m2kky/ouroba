import { createSlice } from "@reduxjs/toolkit";

const storage =
  typeof window !== "undefined"
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const normalizeLanguage = (value) => (value === "ar" ? "ar" : "en");

const currentUrlPath = () =>
  typeof window === "undefined"
    ? ""
    : `${window.location.pathname}${window.location.search}${window.location.hash}`;

const samePageLanguagePath = (nextLanguage) => {
  const currentPath = currentUrlPath();
  if (!currentPath) return "";

  if (/^\/(ar|en)(?=\/|$)/.test(currentPath)) {
    return currentPath.replace(/^\/(ar|en)(?=\/|$)/, `/${nextLanguage}`);
  }

  return `/${nextLanguage}${currentPath.startsWith("/") ? currentPath : `/${currentPath}`}`;
};

const initialState = {
  language: normalizeLanguage(storage.getItem("ouroubaLanguage")),
};

const languageReducer = createSlice({
  initialState,
  name: "Language-Changer",
  reducers: {
    change: (state, action) => {
      const nextLanguage = normalizeLanguage(action?.payload);
      state.language = nextLanguage;
      storage.setItem("ouroubaLanguage", nextLanguage);

      if (typeof window !== "undefined") {
        const nextPath = samePageLanguagePath(nextLanguage);
        if (nextPath && nextPath !== currentUrlPath()) {
          window.location.href = nextPath;
        }
      }
    },
    change2: (state, action) => {
      const nextLanguage = normalizeLanguage(action?.payload);
      state.language = nextLanguage;
      storage.setItem("ouroubaLanguage", nextLanguage);
    },
  },
});

export const { change, change2 } = languageReducer.actions;
export default languageReducer.reducer;
