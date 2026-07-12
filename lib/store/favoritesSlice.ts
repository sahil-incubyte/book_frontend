import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FavoritesState = {
  ids: string[];
};

const initialState: FavoritesState = {
  ids: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // RTK wraps reducers in Immer, so mutating `state` here is safe — it becomes
    // an immutable update behind the scenes.
    toggleFavorite(state, action: PayloadAction<string>) {
      const bookId = action.payload;
      if (state.ids.includes(bookId)) {
        state.ids = state.ids.filter((id) => id !== bookId);
      } else {
        state.ids.push(bookId);
      }
    },
    clearFavorites(state) {
      state.ids = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
