import { BookDetail } from "./BookDetail";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <BookDetail id={id} />
    </main>
  );
}
