import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS } from "@/lib/graphql/books";
import { BookBrowser } from "@/app/books/BookBrowser";

const refactoring = {
  __typename: "Book" as const,
  id: "1",
  title: "Refactoring",
  author: "Martin Fowler",
  price: 10,
};
const tdd = {
  __typename: "Book" as const,
  id: "2",
  title: "Test-Driven Development",
  author: "Kent Beck",
  price: 30,
};
const ddd = {
  __typename: "Book" as const,
  id: "3",
  title: "Domain-Driven Design",
  author: "Eric Evans",
  price: 50,
};
const sicp = {
  __typename: "Book" as const,
  id: "4",
  title: "Structure and Interpretation",
  author: "Harold Abelson",
  price: 80,
};

// The component always sends search/minPrice/maxPrice keys plus the default sort;
// Apollo's MockLink treats undefined-valued keys as absent, so an unfiltered
// request matches a mock keyed on { search: undefined } + the default sort pair.
const DEFAULT_SORT = { sortBy: "CREATED_AT", sortDirection: "DESC" } as const;

const unfilteredMock = (books: object[]): MockLink.MockedResponse => ({
  request: { query: GET_BOOKS, variables: { search: undefined, ...DEFAULT_SORT } },
  result: { data: { books } },
});

function minPriceInput() {
  return screen.getByPlaceholderText("e.g. 100");
}
function maxPriceInput() {
  return screen.getByPlaceholderText("e.g. 1000");
}
function searchInput() {
  return screen.getByPlaceholderText("Search by title or author");
}

test("entering a minimum price narrows the list to books at or above it", async () => {
  const atLeast40: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, minPrice: 40, ...DEFAULT_SORT },
    },
    result: { data: { books: [ddd] } },
  };

  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock([tdd, ddd]), atLeast40],
  });

  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();

  fireEvent.change(minPriceInput(), { target: { value: "40" } });

  expect(await screen.findByText("Domain-Driven Design")).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.queryByText("Test-Driven Development"),
    ).not.toBeInTheDocument(),
  );
});

test("entering a maximum price narrows the list to books at or below it", async () => {
  const atMost40: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, maxPrice: 40, ...DEFAULT_SORT },
    },
    result: { data: { books: [tdd] } },
  };

  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock([tdd, ddd]), atMost40],
  });

  expect(await screen.findByText("Domain-Driven Design")).toBeInTheDocument();

  fireEvent.change(maxPriceInput(), { target: { value: "40" } });

  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText("Domain-Driven Design")).not.toBeInTheDocument(),
  );
});

test("entering both a minimum and maximum price narrows to the inclusive range", async () => {
  // Typing min first, then max, produces two successive queries.
  const minOnly: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, minPrice: 30, ...DEFAULT_SORT },
    },
    result: { data: { books: [tdd, ddd, sicp] } },
  };
  const minAndMax: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, minPrice: 30, maxPrice: 50, ...DEFAULT_SORT },
    },
    result: { data: { books: [tdd, ddd] } },
  };

  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock([refactoring, tdd, ddd, sicp]), minOnly, minAndMax],
  });

  expect(await screen.findByText("Refactoring")).toBeInTheDocument();

  fireEvent.change(minPriceInput(), { target: { value: "30" } });
  fireEvent.change(maxPriceInput(), { target: { value: "50" } });

  // Boundary books (30 and 50) stay; below-min and above-max drop out.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText("Refactoring")).not.toBeInTheDocument(),
  );
  expect(
    screen.queryByText("Structure and Interpretation"),
  ).not.toBeInTheDocument();
});

test("clearing a price input sends the bound as unset rather than zero", async () => {
  const atLeast40: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, minPrice: 40, ...DEFAULT_SORT },
    },
    result: { data: { books: [ddd] } },
  };
  // Guard: if an empty input were sent as 0 instead of undefined, this mock
  // would match and the list would come back empty.
  const zeroMin: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: undefined, minPrice: 0, ...DEFAULT_SORT },
    },
    result: { data: { books: [] } },
  };

  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock([tdd, ddd]), atLeast40, zeroMin],
  });

  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();

  fireEvent.change(minPriceInput(), { target: { value: "40" } });
  await waitFor(() =>
    expect(
      screen.queryByText("Test-Driven Development"),
    ).not.toBeInTheDocument(),
  );

  fireEvent.change(minPriceInput(), { target: { value: "" } });

  // The unfiltered set returns (min sent as undefined), not an empty zero-bound list.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();
});

test("a price bound combines with an active search, sending both variables", async () => {
  const xp = {
    __typename: "Book" as const,
    id: "5",
    title: "Extreme Programming Explained",
    author: "Kent Beck",
    price: 20,
  };
  const searchOnly: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: "Kent", ...DEFAULT_SORT },
    },
    result: { data: { books: [tdd, xp] } },
  };
  const searchAndMax: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: "Kent", maxPrice: 25, ...DEFAULT_SORT },
    },
    result: { data: { books: [xp] } },
  };

  renderWithProviders(<BookBrowser />, {
    mocks: [unfilteredMock([tdd, ddd, xp]), searchOnly, searchAndMax],
  });

  expect(await screen.findByText("Domain-Driven Design")).toBeInTheDocument();

  fireEvent.change(searchInput(), { target: { value: "Kent" } });
  expect(
    await screen.findByText("Extreme Programming Explained"),
  ).toBeInTheDocument();

  fireEvent.change(maxPriceInput(), { target: { value: "25" } });

  // Only the Kent Beck book within the price bound survives both constraints.
  expect(
    await screen.findByText("Extreme Programming Explained"),
  ).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.queryByText("Test-Driven Development"),
    ).not.toBeInTheDocument(),
  );
  expect(screen.queryByText("Domain-Driven Design")).not.toBeInTheDocument();
});
