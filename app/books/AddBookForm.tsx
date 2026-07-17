"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
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
    <Card.Root mb={6}>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Field.Root required>
              <Field.Label>
                Title <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Pragmatic Programmer"
                required
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Author <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Andy Hunt"
                required
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                Price <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 499"
                type="number"
                required
              />
            </Field.Root>

            <Button
              type="submit"
              colorPalette="blue"
              loading={loading}
              loadingText="Adding…"
              alignSelf="flex-start"
            >
              Add book
            </Button>

            {error && (
              <Text color="fg.error" fontSize="sm">
                Something went wrong: {error.message}
              </Text>
            )}

            {validationErrors.length > 0 && (
              <Alert.Root status="error" borderRadius="md">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Couldn&apos;t add book</Alert.Title>
                  <Alert.Description>
                    <Stack as="ul" gap={1} listStyleType="disc" ps={5}>
                      {validationErrors.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </Stack>
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}
          </Stack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
