import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";

// A factory (not a singleton) so each browser session / server request gets its
// own store — same reasoning as makeApolloClient.
export function makeStore() {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
