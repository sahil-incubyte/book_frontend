"use client";

import NextLink from "next/link";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Button,
  Card,
  Link,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GET_BOOKS } from "@/lib/graphql/books";
import type { BookSortField, SortDirection } from "@/lib/gql/graphql";
import { DeleteButton } from "./DeleteButton";
import { FavoriteButton } from "./FavoriteButton";

type BookListProps = {
  search: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: BookSortField;
  sortDirection?: SortDirection;
  onClearFilters?: () => void;
};

export function BookList({
  search,
  minPrice,
  maxPrice,
  sortBy,
  sortDirection,
  onClearFilters,
}: BookListProps) {
  const trimmedSearch = search.trim();
  const filtersActive =
    trimmedSearch !== "" || minPrice != null || maxPrice != null;
  const { data, loading, error, refetch } = useQuery(GET_BOOKS, {
    variables: {
      search: trimmedSearch === "" ? undefined : trimmedSearch,
      minPrice,
      maxPrice,
      sortBy,
      sortDirection,
    },
  });

  if (loading) {
    return <BooksSkeleton />;
  }

  if (error) {
    return (
      <Alert.Root status="error" borderRadius="md">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Couldn&apos;t load books.</Alert.Title>
          <Alert.Description>{error.message}</Alert.Description>
          <Button
            mt={3}
            size="sm"
            colorPalette="red"
            alignSelf="flex-start"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </Alert.Content>
      </Alert.Root>
    );
  }

  const books = data?.books ?? [];

  if (books.length === 0) {
    return filtersActive ? (
      <NoResults onClearFilters={onClearFilters} />
    ) : (
      <Text color="fg.muted">No books yet.</Text>
    );
  }

  return (
    <Stack gap={2}>
      {books.map((book) => (
        <Card.Root
          key={book.id}
          flexDirection="row"
          alignItems="center"
          pr={3}
          _hover={{ bg: "bg.subtle" }}
        >
          <FavoriteButton id={book.id} />
          <Link asChild flex="1" py={3} _hover={{ textDecoration: "none" }}>
            <NextLink href={`/books/${book.id}`}>
              <Text as="span" fontWeight="medium">
                {book.title}
              </Text>{" "}
              — {book.author}{" "}
              <Text as="span" color="fg.muted">
                (₹{book.price})
              </Text>
            </NextLink>
          </Link>
          <DeleteButton id={book.id} />
        </Card.Root>
      ))}
    </Stack>
  );
}

function NoResults({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <Alert.Root status="info" borderRadius="md">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>No results match your filters</Alert.Title>
        <Alert.Description>
          Try adjusting your search or price range, or clear the filters to see
          all books.
        </Alert.Description>
        <Button
          mt={3}
          size="sm"
          variant="outline"
          colorPalette="brand"
          alignSelf="flex-start"
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </Alert.Content>
    </Alert.Root>
  );
}

function BooksSkeleton() {
  return (
    <Stack gap={2} aria-hidden>
      {[0, 1, 2].map((row) => (
        <Skeleton key={row} height="11" borderRadius="md" />
      ))}
    </Stack>
  );
}
