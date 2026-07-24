import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS } from "@/lib/graphql/books";
import { BookBrowser } from "@/app/books/BookBrowser";

const DEFAULT_SORT = { sortBy: "CREATED_AT", sortDirection: "DESC" } as const;
const SEARCH_DEBOUNCE_MS = 300;

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
const neuromancer = {
  __typename: "Book" as const,
  id: "3",
  title: "Neuromancer",
  author: "William Gibson",
  price: 40,
};

// On mount BookBrowser issues the unfiltered query carrying only the default sort
// (search/price are empty, and MockLink strips undefined-valued keys).
const mountMock = (books: object[]): MockLink.MockedResponse => ({
  request: { query: GET_BOOKS, variables: { search: undefined, ...DEFAULT_SORT } },
  result: { data: { books } },
});

function searchInput(): HTMLInputElement {
  return screen.getByPlaceholderText(
    "Search by title or author",
  ) as HTMLInputElement;
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("reflects each keystroke in the input immediately, before the debounce settles", async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  renderWithProviders(<BookBrowser />, { mocks: [mountMock([tdd, ddd])] });

  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();

  await user.type(searchInput(), "Gibson");

  // The controlled input updates on every keystroke, with no timer advance.
  expect(searchInput().value).toBe("Gibson");
});

test("debounces search so no query is issued until typing pauses ~300ms", async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  const searchMock: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: "Gibson", ...DEFAULT_SORT },
    },
    result: { data: { books: [neuromancer] } },
  };

  renderWithProviders(<BookBrowser />, {
    // Only the mount query and the FINAL debounced query are mocked. If the
    // component queried per keystroke ("G", "Gi", ...), those requests would find
    // no mock, surface an error, and drop the mount list — failing the guards below.
    mocks: [mountMock([tdd, ddd]), searchMock],
  });

  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();

  await user.type(searchInput(), "Gibson");

  // Debounce still pending: the searched result is absent and the unfiltered
  // list is untouched, proving no per-keystroke query fired.
  expect(screen.queryByText("Neuromancer")).not.toBeInTheDocument();
  expect(screen.getByText("Test-Driven Development")).toBeInTheDocument();

  // Advancing past the debounce window forwards the settled value to the query.
  await act(async () => {
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
  });

  expect(await screen.findByText("Neuromancer")).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.queryByText("Test-Driven Development")).not.toBeInTheDocument(),
  );
});

test("clearing filters resets the search input and restores the full default list", async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  const noMatchMock: MockLink.MockedResponse = {
    request: {
      query: GET_BOOKS,
      variables: { search: "zzz", ...DEFAULT_SORT },
    },
    result: { data: { books: [] } },
  };

  renderWithProviders(<BookBrowser />, {
    mocks: [mountMock([tdd, ddd]), noMatchMock],
  });

  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();

  await user.type(searchInput(), "zzz");
  await act(async () => {
    jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
  });

  // The active-filter empty state appears with its Clear-filters action.
  const clearButton = await screen.findByRole("button", {
    name: "Clear filters",
  });

  await user.click(clearButton);

  // The visible input is cleared and the debounced search returns to unset, so
  // the full default list (served from the Apollo cache) comes back.
  expect(await screen.findByText("Test-Driven Development")).toBeInTheDocument();
  expect(screen.getByText("Domain-Driven Design")).toBeInTheDocument();
  expect(searchInput().value).toBe("");
});
