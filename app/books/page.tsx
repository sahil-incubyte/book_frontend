import { Container, Heading } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { AddBookForm } from "./AddBookForm";
import { BookList } from "./BookList";
import { FavoritesCount } from "./FavoritesCount";

export default function BooksPage() {
  return (
    // Chakra responsive props: padding grows from mobile (base) to desktop (md).
    <Container maxW="2xl" px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
      {/* Tailwind responsive prefixes: stack on mobile, row from the sm breakpoint up. */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Heading size={{ base: "lg", md: "xl" }}>Books</Heading>
        <div className="flex items-center gap-3">
          <FavoritesCount />
          <ColorModeButton />
        </div>
      </div>
      <AddBookForm />
      <BookList />
    </Container>
  );
}
