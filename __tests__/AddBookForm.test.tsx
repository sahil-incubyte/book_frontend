import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MockLink } from "@apollo/client/testing";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { CREATE_BOOK } from "@/lib/graphql/books";
import { AddBookForm } from "@/app/books/AddBookForm";

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  values: { title: string; author: string; price: string },
) {
  await user.type(screen.getByLabelText(/title/i), values.title);
  await user.type(screen.getByLabelText(/author/i), values.author);
  await user.type(screen.getByLabelText(/price/i), values.price);
  await user.click(screen.getByRole("button", { name: /add book/i }));
}

test("creates a book and clears the form on success", async () => {
  const user = userEvent.setup();
  const createMock: MockLink.MockedResponse = {
    request: {
      query: CREATE_BOOK,
      variables: { title: "New Book", author: "New Author", price: 25 },
    },
    result: {
      data: {
        createBook: {
          __typename: "CreateBookPayload",
          book: {
            __typename: "Book",
            id: "99",
            title: "New Book",
            author: "New Author",
            price: 25,
          },
          errors: [],
        },
      },
    },
  };

  renderWithProviders(<AddBookForm />, { mocks: [createMock] });
  await fillForm(user, { title: "New Book", author: "New Author", price: "25" });

  // Success toast appears...
  expect(await screen.findByText(/Added "New Book"/)).toBeInTheDocument();
  // ...and the form is cleared.
  expect(screen.getByLabelText(/title/i)).toHaveValue("");
});

test("shows server validation errors and keeps the entered values", async () => {
  const user = userEvent.setup();
  const invalidMock: MockLink.MockedResponse = {
    request: {
      query: CREATE_BOOK,
      variables: { title: "Bad", author: "X", price: -5 },
    },
    result: {
      data: {
        createBook: {
          __typename: "CreateBookPayload",
          book: null,
          errors: ["Price must be greater than or equal to 0"],
        },
      },
    },
  };

  renderWithProviders(<AddBookForm />, { mocks: [invalidMock] });
  await fillForm(user, { title: "Bad", author: "X", price: "-5" });

  // The validation message from the server is shown...
  expect(
    await screen.findByText("Price must be greater than or equal to 0"),
  ).toBeInTheDocument();
  // ...and the form keeps what the user typed so they can fix it.
  expect(screen.getByLabelText(/title/i)).toHaveValue("Bad");
});
