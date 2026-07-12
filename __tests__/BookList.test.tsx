import { screen } from "@testing-library/react";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS } from "@/lib/graphql/books";
import { BookList } from "@/app/books/BookList";

const twoBooksMock: MockLink.MockedResponse = {
  request: { query: GET_BOOKS },
  result: {
    data: {
      books: [
        { __typename: "Book", id: "1", title: "Test-Driven Development", author: "Kent Beck", price: 30 },
        { __typename: "Book", id: "2", title: "Domain-Driven Design", author: "Eric Evans", price: 50 },
      ],
    },
  },
};

test("renders the books returned by the query", async () => {
  renderWithProviders(<BookList />, { mocks: [twoBooksMock] });

  // While loading (before the mock resolves), no titles are shown yet.
  expect(screen.queryByText("Test-Driven Development")).not.toBeInTheDocument();

  // Once the query resolves, both books appear.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();
});

test("shows the empty state when no books come back", async () => {
  const emptyMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS },
    result: { data: { books: [] } },
  };

  renderWithProviders(<BookList />, { mocks: [emptyMock] });

  expect(await screen.findByText("No books yet.")).toBeInTheDocument();
});

test("shows the error state when the query fails", async () => {
  const errorMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS },
    error: new Error("Network down"),
  };

  renderWithProviders(<BookList />, { mocks: [errorMock] });

  expect(await screen.findByText(/Couldn't load books/)).toBeInTheDocument();
});
