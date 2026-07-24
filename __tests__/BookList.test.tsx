import { screen } from "@testing-library/react";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS } from "@/lib/graphql/books";
import { BookList } from "@/app/books/BookList";

const twoBooksMock: MockLink.MockedResponse = {
  request: { query: GET_BOOKS, variables: { search: undefined } },
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
  renderWithProviders(<BookList search="" />, { mocks: [twoBooksMock] });

  // While loading (before the mock resolves), no titles are shown yet.
  expect(screen.queryByText("Test-Driven Development")).not.toBeInTheDocument();

  // Once the query resolves, both books appear.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();
});

test("shows the calm empty state when the list is empty and no filters are active", async () => {
  const emptyMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS, variables: { search: undefined } },
    result: { data: { books: [] } },
  };

  renderWithProviders(<BookList search="" />, { mocks: [emptyMock] });

  expect(await screen.findByText("No books yet.")).toBeInTheDocument();
  expect(
    screen.queryByText("No results match your filters"),
  ).not.toBeInTheDocument();
});

test("shows the no-results alert when a search filter is active but nothing matches", async () => {
  const noMatchMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS, variables: { search: "zzz" } },
    result: { data: { books: [] } },
  };

  renderWithProviders(<BookList search="zzz" />, { mocks: [noMatchMock] });

  expect(
    await screen.findByText("No results match your filters"),
  ).toBeInTheDocument();
  // The distinguishing action of the filtered empty state.
  expect(
    screen.getByRole("button", { name: "Clear filters" }),
  ).toBeInTheDocument();
  // Never the calm message when filters are active.
  expect(screen.queryByText("No books yet.")).not.toBeInTheDocument();
});

test("shows the no-results alert when a price bound is active but nothing matches", async () => {
  const noMatchMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS, variables: { search: undefined, minPrice: 9999 } },
    result: { data: { books: [] } },
  };

  renderWithProviders(<BookList search="" minPrice={9999} />, {
    mocks: [noMatchMock],
  });

  expect(
    await screen.findByText("No results match your filters"),
  ).toBeInTheDocument();
  expect(screen.queryByText("No books yet.")).not.toBeInTheDocument();
});

test("keeps the calm empty state when only a non-default sort is applied", async () => {
  // Sort is excluded from filtersActive, so an empty list under a sort-only
  // request must still read as "No books yet.", not the filtered alert.
  const sortedEmptyMock: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, sortBy: "TITLE", sortDirection: "ASC" },
    },
    result: { data: { books: [] } },
  };

  renderWithProviders(
    <BookList search="" sortBy="TITLE" sortDirection="ASC" />,
    { mocks: [sortedEmptyMock] },
  );

  expect(await screen.findByText("No books yet.")).toBeInTheDocument();
  expect(
    screen.queryByText("No results match your filters"),
  ).not.toBeInTheDocument();
});

test("shows the error state when the query fails", async () => {
  const errorMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS, variables: { search: undefined } },
    error: new Error("Network down"),
  };

  renderWithProviders(<BookList search="" />, { mocks: [errorMock] });

  expect(await screen.findByText(/Couldn't load books/)).toBeInTheDocument();
});

test("sends the trimmed search term as the query variable", async () => {
  const searchMock: MockLink.MockedResponse = {
    request: { query: GET_BOOKS, variables: { search: "Gibson" } },
    result: {
      data: {
        books: [
          { __typename: "Book", id: "3", title: "Neuromancer", author: "William Gibson", price: 40 },
        ],
      },
    },
  };

  renderWithProviders(<BookList search="  Gibson  " />, { mocks: [searchMock] });

  expect(await screen.findByText("Neuromancer")).toBeInTheDocument();
});
