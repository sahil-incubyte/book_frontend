import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { makeStore } from "@/lib/store/store";
import { toggleFavorite } from "@/lib/store/favoritesSlice";
import { FavoritesCount } from "@/app/books/FavoritesCount";

test("shows zero when there are no favorites", () => {
  renderWithProviders(<FavoritesCount />);
  expect(screen.getByText(/0 favorites/)).toBeInTheDocument();
});

test("reflects the number of favorited books", () => {
  const store = makeStore();
  store.dispatch(toggleFavorite("1"));
  store.dispatch(toggleFavorite("2"));

  renderWithProviders(<FavoritesCount />, { store });

  expect(screen.getByText(/2 favorites/)).toBeInTheDocument();
});

test("uses the singular label for exactly one favorite", () => {
  const store = makeStore();
  store.dispatch(toggleFavorite("1"));

  renderWithProviders(<FavoritesCount />, { store });

  expect(screen.getByText(/1 favorite$/)).toBeInTheDocument();
});
