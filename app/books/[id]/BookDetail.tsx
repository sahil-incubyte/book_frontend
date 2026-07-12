"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_BOOK } from "@/lib/graphql/books";
import { EditBookForm } from "./EditBookForm";
import { DeleteBookButton } from "./DeleteBookButton";

export function BookDetail({ id }: { id: string }) {
  const { data, loading, error } = useQuery(GET_BOOK, {
    variables: { id },
  });

  if (loading) return <p className="text-gray-500">Loading book…</p>;

  if (error) {
    return (
      <p className="text-red-800">Couldn&apos;t load book: {error.message}</p>
    );
  }

  const book = data?.book;
  if (!book) return <p className="text-gray-500">Book not found.</p>;

  return (
    <article className="space-y-2">
      <Link href="/books" className="text-sm text-blue-600 hover:underline">
        ← All books
      </Link>
      <h1 className="text-2xl font-semibold">{book.title}</h1>
      <p className="text-gray-700">by {book.author}</p>
      <p className="text-gray-500">₹{book.price}</p>
      <p className="text-xs text-gray-400">
        Added {new Date(book.createdAt).toLocaleDateString()}
      </p>
      <EditBookForm book={book} />
      <DeleteBookButton id={book.id} />
    </article>
  );
}
