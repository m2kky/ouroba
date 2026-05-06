import { combineReducers } from "redux";
import languageReducer from "../languageReducer";
import favoriteReducer from "../favoriteReducer";
import cartReducer from "../cartReducer";
import offlineCartSlice from "../offlineCartReducer/OfflineCartReducer";
import refresh from "../refresh";
import siteReducer from "../siteReducer";

export default combineReducers({
  language: languageReducer,
  favourite: favoriteReducer,
  cart: cartReducer,
  refresh: refresh,
  site: siteReducer,
  offlineCart:offlineCartSlice
});
