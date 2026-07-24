import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS, DELETE_BOOK } from "@/lib/graphql/books";
import { BookList } from "@/app/books/BookList";

const booksMock: MockLink.MockedResponse = {
  request: { query: GET_BOOKS, variables: { search: undefined } },
  result: {
    data: {
      books: [
        { __typename: "Book", id: "1", title: "Harry Potter", author: "J K Rowling", price: 500 },
        { __typename: "Book", id: "2", title: "1984", author: "George Orwell", price: 400 },
      ],
    },
  },
};

const deleteMock: MockLink.MockedResponse = {
  request: { query: DELETE_BOOK, variables: { id: "1" } },
  result: {
    data: {
      deleteBook: {
        __typename: "DeleteBookPayload",
        book: { __typename: "Book", id: "1" },
        errors: [],
      },
    },
  },
};

test("removes a book from the list when its Delete button is clicked", async () => {
  const user = userEvent.setup();
  const confirmSpy = jest.spyOn(window, "confirm").mockReturnValue(true);

  renderWithProviders(<BookList search="" />, { mocks: [booksMock, deleteMock] });

  // Both books load first.
  expect(await screen.findByText("Harry Potter")).toBeInTheDocument();
  expect(screen.getByText("1984")).toBeInTheDocument();

  // Click the first row's Delete button.
  const deleteButtons = screen.getAllByRole("button", { name: /delete book/i });
  await user.click(deleteButtons[0]);

  // The deleted book disappears; the other stays.
  await waitFor(() => {
    expect(screen.queryByText("Harry Potter")).not.toBeInTheDocument();
  });
  expect(screen.getByText("1984")).toBeInTheDocument();

  confirmSpy.mockRestore();
});
