"use client";

import { Button } from "@chakra-ui/react";
import { useMutation } from "@apollo/client/react";
import { DELETE_BOOK } from "@/lib/graphql/books";

export function DeleteButton({ id }: { id: string }) {
  const [deleteBook, { loading }] = useMutation(DELETE_BOOK, {
    // The result we expect. Apollo applies this to the cache immediately, then
    // reconciles with the server response (rolling back if it disagrees).
    optimisticResponse: {
      deleteBook: {
        book: { id },
        errors: [],
      },
    },
    // Remove the book from the cache. Its ref in ROOT_QUERY.books becomes
    // dangling and Apollo filters it out of the list automatically.
    update(cache, { data }) {
      const deletedId = data?.deleteBook?.book?.id;
      if (!deletedId) return;
      cache.evict({ id: cache.identify({ __typename: "Book", id: deletedId }) });
      cache.gc();
    },
  });

  function handleClick() {
    if (!window.confirm("Delete this book?")) return;
    deleteBook({ variables: { id } });
  }

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      aria-label="Delete book"
      colorPalette="red"
      variant="outline"
      size="xs"
      ml={3}
      flexShrink={0}
    >
      Delete
    </Button>
  );
}
