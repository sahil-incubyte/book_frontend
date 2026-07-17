"use client";

import { Text } from "@chakra-ui/react";
import { useAppSelector } from "@/lib/store/hooks";

export function FavoritesCount() {
  const count = useAppSelector((state) => state.favorites.ids.length);

  return (
    <Text fontSize="sm" color="fg.muted">
      ★ {count} favorite{count === 1 ? "" : "s"}
    </Text>
  );
}
