import { fireEvent, screen, waitFor } from "@testing-library/react";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { GET_BOOKS } from "@/lib/graphql/books";
import { BookBrowser } from "@/app/books/BookBrowser";

// "Dune" was added more recently than "Anansi Boys", so the two orderings differ:
// newest-first puts Dune first; title A–Z puts Anansi Boys first. That contrast
// lets us prove the list actually re-orders when the sort option changes.
const dune = {
  __typename: "Book" as const,
  id: "1",
  title: "Dune",
  author: "Frank Herbert",
  price: 40,
};
const anansi = {
  __typename: "Book" as const,
  id: "2",
  title: "Anansi Boys",
  author: "Neil Gaiman",
  price: 25,
};

// The visible search/price inputs are empty, so MockLink strips those undefined
// keys and the request carries only the sort pair.
const newestFirstMock: MockLink.MockedResponse = {
  request: {
    query: GET_BOOKS,
    variables: { sortBy: "CREATED_AT", sortDirection: "DESC" },
  },
  result: { data: { books: [dune, anansi] } },
};

const titleAscMock: MockLink.MockedResponse = {
  request: {
    query: GET_BOOKS,
    variables: { sortBy: "TITLE", sortDirection: "ASC" },
  },
  result: { data: { books: [anansi, dune] } },
};

function sortSelect() {
  return screen.getByRole("combobox") as HTMLSelectElement;
}

function renderedTitleOrder() {
  return screen.getAllByRole("link").map((link) => link.textContent ?? "");
}

test("defaults to Newest first and sends the default sort variables on the first query", async () => {
  renderWithProviders(<BookBrowser />, { mocks: [newestFirstMock] });

  // The initial list only resolves if the request was sent with
  // sortBy=CREATED_AT / sortDirection=DESC (the only mock provided).
  expect(await screen.findByText("Dune")).toBeInTheDocument();
  expect(screen.getByText("Anansi Boys")).toBeInTheDocument();

  expect(sortSelect().value).toBe("CREATED_AT:DESC");
  expect(screen.getByDisplayValue("Newest first")).toBeInTheDocument();
});

test("selecting Title (A–Z) sends sortBy=TITLE, sortDirection=ASC and re-orders the list", async () => {
  renderWithProviders(<BookBrowser />, {
    mocks: [newestFirstMock, titleAscMock],
  });

  await screen.findByText("Dune");
  // Newest-first ordering: Dune before Anansi Boys.
  expect(renderedTitleOrder()[0]).toMatch(/Dune/);
  expect(renderedTitleOrder()[1]).toMatch(/Anansi Boys/);

  fireEvent.change(sortSelect(), { target: { value: "TITLE:ASC" } });

  // Title A–Z ordering: Anansi Boys now precedes Dune.
  await waitFor(() => {
    expect(renderedTitleOrder()[0]).toMatch(/Anansi Boys/);
  });
  expect(renderedTitleOrder()[1]).toMatch(/Dune/);
  expect(sortSelect().value).toBe("TITLE:ASC");
});
