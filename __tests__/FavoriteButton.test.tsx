import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { FavoriteButton } from "@/app/books/FavoriteButton";

test("toggles favorite state when clicked", async () => {
  const user = userEvent.setup();
  const { store } = renderWithProviders(<FavoriteButton id="1" />);

  const addButton = screen.getByRole("button", { name: /add to favorites/i });
  expect(addButton).toHaveTextContent("☆");

  await user.click(addButton);

  // The button now reflects the favorited state...
  expect(
    screen.getByRole("button", { name: /remove from favorites/i }),
  ).toHaveTextContent("★");
  // ...and the store was actually updated.
  expect(store.getState().favorites.ids).toContain("1");
});
