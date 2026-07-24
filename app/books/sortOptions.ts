import type { BookSortField, SortDirection } from "@/lib/gql/graphql";

// The six pre-combined sort choices offered in the UI, each mapping a single
// human-readable label to the (sortBy, sortDirection) enum pair the backend expects.
// Encoding the pair as "FIELD:DIRECTION" lets the native <select> carry both values
// in one option value.
export type SortOption = {
  value: string;
  label: string;
  sortBy: BookSortField;
  sortDirection: SortDirection;
};

export const SORT_OPTIONS: readonly SortOption[] = [
  { value: "CREATED_AT:DESC", label: "Newest first", sortBy: "CREATED_AT", sortDirection: "DESC" },
  { value: "CREATED_AT:ASC", label: "Oldest first", sortBy: "CREATED_AT", sortDirection: "ASC" },
  { value: "TITLE:ASC", label: "Title (A–Z)", sortBy: "TITLE", sortDirection: "ASC" },
  { value: "TITLE:DESC", label: "Title (Z–A)", sortBy: "TITLE", sortDirection: "DESC" },
  { value: "PRICE:ASC", label: "Price (low to high)", sortBy: "PRICE", sortDirection: "ASC" },
  { value: "PRICE:DESC", label: "Price (high to low)", sortBy: "PRICE", sortDirection: "DESC" },
];

export const DEFAULT_SORT_OPTION = SORT_OPTIONS[0];

export function sortValueOf(sortBy: BookSortField, sortDirection: SortDirection): string {
  return `${sortBy}:${sortDirection}`;
}
