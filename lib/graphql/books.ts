// Facade over the code-generated documents (see codegen.ts + the *.graphql files).
// Components import friendly names from here; the operations themselves live in the
// .graphql files and their types are generated into lib/gql/graphql.ts.
export {
  GetBooksDocument as GET_BOOKS,
  GetBookDocument as GET_BOOK,
  CreateBookDocument as CREATE_BOOK,
  UpdateBookDocument as UPDATE_BOOK,
  DeleteBookDocument as DELETE_BOOK,
} from "@/lib/gql/graphql";

import type { GetBooksQuery } from "@/lib/gql/graphql";

// The whole GetBooks response shape (used to type cache.updateQuery).
export type GetBooksData = GetBooksQuery;

// A single book as returned by the list query.
export type Book = GetBooksQuery["books"][number];
