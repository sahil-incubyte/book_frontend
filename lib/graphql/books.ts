import { gql } from "@apollo/client";

// Fetches every book. Mirrors the `books` query we ran in GraphiQL.
export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      price
    }
  }
`;

// A single book as returned by the API.
// GraphQL ID -> string, Int (price) -> number.
export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
};

// The shape of the whole GetBooks response `data` object.
// The key `books` matches the field name in the query above.
export type GetBooksData = {
  books: Book[];
};

// Fetches one book by id. `$id: ID!` declares a required variable.
export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      author
      price
      createdAt
    }
  }
`;

// The detail view asks for one extra field beyond the list.
export type BookWithDates = Book & {
  createdAt: string;
};

export type GetBookData = {
  book: BookWithDates | null;
};

export type GetBookVars = {
  id: string;
};

// Creates a book. The backend uses Relay-style mutations, so all arguments are
// wrapped in a single `input` object. Returns the new book plus a list of
// validation errors (empty on success) — we surface `errors` in Step 3.5.
export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!, $price: Int!) {
    createBook(input: { title: $title, author: $author, price: $price }) {
      book {
        id
        title
        author
        price
      }
      errors
    }
  }
`;

export type CreateBookData = {
  createBook: {
    book: Book | null;
    errors: string[];
  };
};

export type CreateBookVars = {
  title: string;
  author: string;
  price: number;
};

// Updates a book. `id` is required; the other fields are optional (partial update).
// Returning `id` + changed fields lets Apollo auto-update its normalized cache.
export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String, $author: String, $price: Int) {
    updateBook(input: { id: $id, title: $title, author: $author, price: $price }) {
      book {
        id
        title
        author
        price
      }
      errors
    }
  }
`;

export type UpdateBookData = {
  updateBook: {
    book: Book | null;
    errors: string[];
  };
};

export type UpdateBookVars = {
  id: string;
  title?: string;
  author?: string;
  price?: number;
};

// Deletes a book. We only need the id back to know which one was removed.
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(input: { id: $id }) {
      book {
        id
      }
      errors
    }
  }
`;

export type DeleteBookData = {
  deleteBook: {
    book: { id: string } | null;
    errors: string[];
  };
};

export type DeleteBookVars = {
  id: string;
};
