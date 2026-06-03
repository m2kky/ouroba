import { createSlice } from "@reduxjs/toolkit";

const storage =
  typeof window !== "undefined"
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const getStoredJson = (key, fallback = []) => {
  const value = storage.getItem(key);
  if (!value || value === "null" || value === "undefined") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    storage.removeItem(key);
    return fallback;
  }
};

const initialState = {
  favoriteItems: getStoredJson("favoriteItems", []),
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorites(state, action) {
      const newItem = action.payload;
      state.favoriteItems.push(newItem);
      console.log("newItem", newItem);
      storage.setItem(
        "favoriteItems",
        JSON.stringify(
          state.favoriteItems && Array.isArray(state.favoriteItems)
            ? state.favoriteItems
            : []
        )
      );
    },
    removeFromFavorites(state, action) {
      const itemIdToRemove = action.payload;
      console.log(itemIdToRemove, state.favoriteItems[0]);
      state.favoriteItems = state.favoriteItems.filter(
        (item) => item?.id !== itemIdToRemove
      );
      storage.setItem(
        "favoriteItems",
        JSON.stringify(
          state.favoriteItems && Array.isArray(state.favoriteItems)
            ? state.favoriteItems
            : []
        )
      );
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;

export default favoriteSlice.reducer;
