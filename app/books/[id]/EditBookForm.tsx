"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_BOOK, type Book } from "@/lib/graphql/books";

export function EditBookForm({ book }: { book: Book }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [price, setPrice] = useState(String(book.price));
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [updateBook, { loading, error }] = useMutation(UPDATE_BOOK);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await updateBook({
      variables: { id: book.id, title, author, price: Number(price) },
    });
    setValidationErrors(result.data?.updateBook.errors ?? []);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3 rounded border border-gray-200 p-4">
      <p className="text-sm font-medium text-gray-500">Edit this book</p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        required
        className="w-full rounded border border-gray-300 px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save changes"}
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
