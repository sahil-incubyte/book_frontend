"use client";

import { useState } from "react";
import type { BookSortField, SortDirection } from "@/lib/gql/graphql";
import { BookFilters } from "./BookFilters";
import { BookList } from "./BookList";
import { DEFAULT_SORT_OPTION } from "./sortOptions";

export function BookBrowser() {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<BookSortField>(DEFAULT_SORT_OPTION.sortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    DEFAULT_SORT_OPTION.sortDirection,
  );
  const [clearSignal, setClearSignal] = useState(0);

  const handleSortChange = (nextSortBy: BookSortField, nextSortDirection: SortDirection) => {
    setSortBy(nextSortBy);
    setSortDirection(nextSortDirection);
  };

  const handleClearFilters = () => {
    setSearch("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortBy(DEFAULT_SORT_OPTION.sortBy);
    setSortDirection(DEFAULT_SORT_OPTION.sortDirection);
    setClearSignal((signal) => signal + 1);
  };

  return (
    <>
      <BookFilters
        key={clearSignal}
        onSearchChange={setSearch}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
      <BookList
        search={search}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}
