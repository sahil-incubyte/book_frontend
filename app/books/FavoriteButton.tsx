"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleFavorite } from "@/lib/store/favoritesSlice";

export function FavoriteButton({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  // This component re-renders only when THIS book's favorite status changes.
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(id));

  return (
    <button
      onClick={() => dispatch(toggleFavorite(id))}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      className="px-2 text-lg text-yellow-500"
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
