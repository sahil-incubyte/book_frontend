import { AddBookForm } from "./AddBookForm";
import { BookList } from "./BookList";

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-semibold">Books</h1>
      <AddBookForm />
      <BookList />
    </main>
  );
}
