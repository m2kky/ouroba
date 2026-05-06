import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteItems: localStorage.getItem("favoriteItems")
    ? JSON.parse(localStorage.getItem("favoriteItems"))
    : [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorites(state, action) {
      const newItem = action.payload;
      state.favoriteItems.push(newItem);
      console.log("newItem", newItem);
      localStorage.setItem(
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
      localStorage.setItem(
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
