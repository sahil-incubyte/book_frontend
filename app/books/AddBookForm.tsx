"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_BOOK,
  GET_BOOKS,
  type CreateBookData,
  type CreateBookVars,
} from "@/lib/graphql/books";

export function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");

  const [createBook, { loading, error }] = useMutation<
    CreateBookData,
    CreateBookVars
  >(CREATE_BOOK, {
    // After a successful create, re-run GET_BOOKS so the list picks up the new
    // book. awaitRefetchQueries keeps `loading` true until that refetch finishes.
    refetchQueries: [{ query: GET_BOOKS }],
    awaitRefetchQueries: true,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createBook({
      variables: { title, author, price: Number(price) },
    });
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
    </form>
  );
}
