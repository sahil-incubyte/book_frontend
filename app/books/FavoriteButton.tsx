"use client";

import { IconButton } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleFavorite } from "@/lib/store/favoritesSlice";

export function FavoriteButton({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  // This component re-renders only when THIS book's favorite status changes.
  const isFavorite = useAppSelector((state) => state.favorites.ids.includes(id));

  return (
    <IconButton
      onClick={() => dispatch(toggleFavorite(id))}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      variant="ghost"
      size="sm"
      fontSize="lg"
      color={isFavorite ? "yellow.500" : "fg.muted"}
    >
      {isFavorite ? "★" : "☆"}
    </IconButton>
  );
}
