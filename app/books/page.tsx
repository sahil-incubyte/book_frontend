import { AddBookForm } from "./AddBookForm";
import { BookList } from "./BookList";
import { FavoritesCount } from "./FavoritesCount";

export default function BooksPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Books</h1>
        <FavoritesCount />
      </div>
      <AddBookForm />
      <BookList />
    </main>
  );
}
