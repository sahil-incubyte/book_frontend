"use client";

import { useEffect, useRef, useState } from "react";
import { Subject, debounceTime } from "rxjs";
import { LuSearch } from "react-icons/lu";
import {
  Card,
  Field,
  Input,
  InputGroup,
  NativeSelect,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { BookSortField, SortDirection } from "@/lib/gql/graphql";
import { SORT_OPTIONS, sortValueOf } from "./sortOptions";

const SEARCH_DEBOUNCE_MS = 300;

type BookFiltersProps = {
  onSearchChange: (value: string) => void;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  sortBy: BookSortField;
  sortDirection: SortDirection;
  onSortChange: (sortBy: BookSortField, sortDirection: SortDirection) => void;
};

function parsePriceInput(value: string): number | undefined {
  if (value.trim() === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

const rupeeElement = <Text color="fg.muted">₹</Text>;

export function BookFilters({
  onSearchChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sortBy,
  sortDirection,
  onSortChange,
}: BookFiltersProps) {
  const [searchInput, setSearchInput] = useState("");
  const searchStreamRef = useRef<Subject<string> | null>(null);
  if (searchStreamRef.current === null) {
    searchStreamRef.current = new Subject<string>();
  }

  useEffect(() => {
    const stream = searchStreamRef.current;
    if (!stream) {
      return;
    }
    const subscription = stream
      .pipe(debounceTime(SEARCH_DEBOUNCE_MS))
      .subscribe(onSearchChange);
    return () => subscription.unsubscribe();
  }, [onSearchChange]);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    searchStreamRef.current?.next(value);
  };

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((candidate) => candidate.value === value);
    if (option) {
      onSortChange(option.sortBy, option.sortDirection);
    }
  };

  return (
    <Card.Root mb={4}>
      <Card.Body>
        <Stack gap={3}>
          <Field.Root>
            <Field.Label>Search</Field.Label>
            <InputGroup startElement={<LuSearch />}>
              <Input
                value={searchInput}
                onChange={(event) => handleSearchInputChange(event.target.value)}
                placeholder="Search by title or author"
              />
            </InputGroup>
          </Field.Root>

          <Stack direction={{ base: "column", sm: "row" }} gap={3}>
            <Field.Root flex="1">
              <Field.Label>Min price</Field.Label>
              <InputGroup startElement={rupeeElement}>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={minPrice ?? ""}
                  onChange={(event) =>
                    onMinPriceChange(parsePriceInput(event.target.value))
                  }
                  placeholder="e.g. 100"
                />
              </InputGroup>
            </Field.Root>

            <Field.Root flex="1">
              <Field.Label>Max price</Field.Label>
              <InputGroup startElement={rupeeElement}>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={maxPrice ?? ""}
                  onChange={(event) =>
                    onMaxPriceChange(parsePriceInput(event.target.value))
                  }
                  placeholder="e.g. 1000"
                />
              </InputGroup>
            </Field.Root>

            <Field.Root flex="1">
              <Field.Label>Sort by</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  value={sortValueOf(sortBy, sortDirection)}
                  onChange={(event) => handleSortChange(event.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
