"use client";

import { useAppSelector } from "@/lib/store/hooks";

export function FavoritesCount() {
  const count = useAppSelector((state) => state.favorites.ids.length);

  return (
    <span className="text-sm text-gray-500">
      ★ {count} favorite{count === 1 ? "" : "s"}
    </span>
  );
}
