"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_BOOKS, type GetBooksData } from "@/lib/graphql/books";

export function BookList() {
  const { data, loading, error, refetch } = useQuery<GetBooksData>(GET_BOOKS);

  if (loading) {
    return <BooksSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-medium">Couldn&apos;t load books.</p>
        <p className="mt-1 text-sm">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const books = data?.books ?? [];

  if (books.length === 0) {
    return <p className="text-gray-500">No books yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {books.map((book) => (
        <li key={book.id}>
          <Link
            href={`/books/${book.id}`}
            className="block rounded border border-gray-200 p-3 hover:bg-gray-50"
          >
            <span className="font-medium">{book.title}</span> — {book.author}{" "}
            <span className="text-gray-500">(₹{book.price})</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function BooksSkeleton() {
  return (
    <ul className="space-y-2" aria-hidden>
      {[0, 1, 2].map((row) => (
        <li key={row} className="h-11 animate-pulse rounded bg-gray-100" />
      ))}
    </ul>
  );
}
