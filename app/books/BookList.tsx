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
import { DeleteButton } from "./DeleteButton";
import { FavoriteButton } from "./FavoriteButton";

export function BookList() {
  const { data, loading, error, refetch } = useQuery(GET_BOOKS);

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
    return <Text color="fg.muted">No books yet.</Text>;
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

function BooksSkeleton() {
  return (
    <Stack gap={2} aria-hidden>
      {[0, 1, 2].map((row) => (
        <Skeleton key={row} height="11" borderRadius="md" />
      ))}
    </Stack>
  );
}
