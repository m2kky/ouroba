import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteItems: (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("favoriteItems")
    ? JSON.parse((typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).getItem("favoriteItems"))
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
      (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).setItem(
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
      (typeof window !== 'undefined' ? localStorage : { getItem: ()=>null, setItem: ()=>{}, removeItem: ()=>{} }).setItem(
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
