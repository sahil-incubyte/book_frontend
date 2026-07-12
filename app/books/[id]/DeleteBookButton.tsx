"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { DELETE_BOOK, GET_BOOKS } from "@/lib/graphql/books";

export function DeleteBookButton({ id }: { id: string }) {
  const router = useRouter();

  const [deleteBook, { loading, error }] = useMutation(DELETE_BOOK, {
    // Like create, delete needs the list re-fetched so the removed book disappears.
    refetchQueries: [{ query: GET_BOOKS }],
    awaitRefetchQueries: true,
  });

  async function handleDelete() {
    if (!window.confirm("Delete this book? This cannot be undone.")) return;
    await deleteBook({ variables: { id } });
    router.push("/books");
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {loading ? "Deleting…" : "Delete book"}
      </button>
      {error && (
        <p className="mt-1 text-sm text-red-800">Couldn&apos;t delete: {error.message}</p>
      )}
    </div>
  );
}
