import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS } from "@/lib/graphql/books";
import { BookBrowser } from "@/app/books/BookBrowser";

const tdd = {
  __typename: "Book" as const,
  id: "1",
  title: "Test-Driven Development",
  author: "Kent Beck",
  price: 30,
};
const ddd = {
  __typename: "Book" as const,
  id: "2",
  title: "Domain-Driven Design",
  author: "Eric Evans",
  price: 50,
};

// BookBrowser always sends the default sort (Newest first); Apollo's MockLink
// strips undefined-valued keys, so search/price stay optional but the sort pair
// must appear in every mock rendered through BookBrowser.
const unfilteredMock: MockLink.MockedResponse = {
  request: {
    query: GET_BOOKS,
    variables: { search: undefined, sortBy: "CREATED_AT", sortDirection: "DESC" },
  },
  result: { data: { books: [tdd, ddd] } },
};

const filteredMock: MockLink.MockedResponse = {
  request: {
    query: GET_BOOKS,
    variables: { search: "Kent", sortBy: "CREATED_AT", sortDirection: "DESC" },
  },
  result: { data: { books: [tdd] } },
};

function searchInput() {
  return screen.getByPlaceholderText("Search by title or author");
}

test("typing a search term narrows the list to matching books", async () => {
  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock, filteredMock],
  });

  // Initially the full, unfiltered list is shown.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();

  fireEvent.change(searchInput(), { target: { value: "Kent" } });

  // The matching book stays, the non-matching one disappears.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText("Domain-Driven Design")).not.toBeInTheDocument(),
  );
});

test("clearing the search box restores the full unfiltered list", async () => {
  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock, filteredMock],
  });

  await screen.findByText("Domain-Driven Design");

  fireEvent.change(searchInput(), { target: { value: "Kent" } });
  await waitFor(() =>
    expect(screen.queryByText("Domain-Driven Design")).not.toBeInTheDocument(),
  );

  fireEvent.change(searchInput(), { target: { value: "" } });

  // Back to the unfiltered set (served from the Apollo cache for search=undefined).
  expect(await screen.findByText("Domain-Driven Design")).toBeInTheDocument();
  expect(screen.getByText("Test-Driven Development")).toBeInTheDocument();
});
