import favoritesReducer, {
  toggleFavorite,
  clearFavorites,
} from "@/lib/store/favoritesSlice";

test("toggleFavorite adds an id that isn't in the list", () => {
  const next = favoritesReducer({ ids: [] }, toggleFavorite("1"));
  expect(next.ids).toEqual(["1"]);
});

test("toggleFavorite removes an id that is already in the list", () => {
  const next = favoritesReducer({ ids: ["1", "2"] }, toggleFavorite("1"));
  expect(next.ids).toEqual(["2"]);
});

test("clearFavorites empties the list", () => {
  const next = favoritesReducer({ ids: ["1", "2"] }, clearFavorites());
  expect(next.ids).toEqual([]);
});
