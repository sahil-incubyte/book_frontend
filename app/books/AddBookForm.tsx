"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNotify } from "../notifications/NotificationProvider";
import {
  CREATE_BOOK,
  GET_BOOKS,
  type GetBooksData,
} from "@/lib/graphql/books";

export function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const notify = useNotify();

  const [createBook, { loading, error }] = useMutation(CREATE_BOOK, {
    // Instead of refetching the whole list, write the newly created book straight
    // into the cached GET_BOOKS result. No extra network request.
    update(cache, { data }) {
      const created = data?.createBook?.book;
      if (!created) return; // validation failed — nothing to insert

      cache.updateQuery<GetBooksData>({ query: GET_BOOKS }, (existing) =>
        existing ? { books: [...existing.books, created] } : existing,
      );
    },
  });

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await createBook({
      variables: { title, author, price: Number(price) },
    });

    const errors = result.data?.createBook?.errors ?? [];
    if (errors.length > 0) {
      setValidationErrors(errors);
      notify("Couldn't add book", "error");
      return; // keep the entered values so the user can fix them
    }

    setValidationErrors([]);
    notify(`Added "${title}"`);
    setTitle("");
    setAuthor("");
    setPrice("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded border border-gray-200 p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
        required
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        required
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Adding…" : "Add book"}
      </button>
      {error && (
        <p className="text-sm text-red-800">Something went wrong: {error.message}</p>
      )}
      {validationErrors.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-red-800">
          {validationErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
