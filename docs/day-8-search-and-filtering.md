# Day 8 — Search, Filter & Sort UI (Frontend)

Adds a client-side filter bar to the books page: a **debounced search box**,
**min/max price** inputs, and a **sort dropdown** — all driving the extended
`books` GraphQL query (see the `book_api` companion doc for the backend). Built
spec-first with Bee across four vertical slices.

Final state: **30 tests, 0 failures** across 11 suites.

## Why

The books list showed every book with no way to search, narrow, or reorder it.
This adds the UI for that, while keeping three things right:

1. Typing must feel **instant** but must not fire a query on every keystroke.
2. "Unset" must be distinct from "empty" and "zero" (an empty price box is *no
   bound*, not `0`).
3. An empty result needs the **right** empty state — "you have no books" is a
   different message from "your filters matched nothing."

## What changed

### 1. State ownership — a client container (`BookBrowser.tsx`)

A new `"use client"` container owns the whole filter tuple
`{ search, minPrice, maxPrice, sortBy, sortDirection }` and renders
`<BookFilters/>` and `<BookList/>` as siblings. Classic **props down, changes
up** — no Redux, because the state is page-scoped and ephemeral.

`app/books/page.tsx` stays a **Server Component** and just renders
`<BookBrowser/>`, preserving the RSC boundary.

### 2. Controls (`BookFilters.tsx`)

- **Search input** — an `InputGroup` with a search icon. The visible field is
  backed by a local `searchInput` state so it updates on every keystroke with
  zero lag. Each change is *also* pushed into an rxjs `Subject`, whose
  `debounceTime(300)` output is what actually updates shared state (see
  decision A). This is the codebase's first rxjs usage — now the reference
  pattern.
- **Min / Max price** — `Input type="number"` with a `₹` start element.
  `parsePriceInput` returns `undefined` for empty/blank input, **never `0`**.
- **Sort dropdown** — a single `NativeSelect` with six pre-combined options
  (Title A–Z / Z–A, Price Low→High / High→Low, Newest / Oldest), each mapping
  to a `(sortBy, sortDirection)` pair. Defaults to **Newest first**
  (`CREATED_AT` / `DESC`), matching the backend default. The option table lives
  in `sortOptions.ts`.

### 3. List + two empty states (`BookList.tsx`)

- Passes all five variables into `useQuery(GET_BOOKS, { variables })`. Blank
  search is sent as `undefined`; unset prices are `undefined`.
- Derives
  `filtersActive = search.trim() !== "" || minPrice != null || maxPrice != null`
  — **sort is intentionally excluded** (a re-sorted empty catalog isn't "no
  results", it's just empty).
- Empty list + `!filtersActive` → the calm **"No books yet."** text.
- Empty list + `filtersActive` → an `Alert status="info"` **"No results match
  your filters"** plus a **Clear filters** button.
- Clearing resets search + price + sort and remounts `BookFilters` (via a
  `key={clearSignal}` bump in `BookBrowser`) so the live search field visibly
  clears too — not just the shared state.

### 4. GraphQL operation + codegen

- `lib/graphql/getBooks.graphql` gains
  `search`/`minPrice`/`maxPrice`/`sortBy`/`sortDirection` variables.
- `codegen.ts` sets `enumsAsTypes: true` so the schema's new enums emit as
  string-union types (avoids a duplicate-declaration `tsc` break now that the
  schema has its first enums). Regenerate with `npm run codegen` (introspects
  the live backend at `http://localhost:3002/graphql`).

## Key design decisions

**A. Debounce the query, not the visible input.** The trap with a debounced
controlled input is debouncing the value the user *sees*, which makes typing
feel laggy. The fix: the visible input is plain React state (instant), and a
*separate* rxjs `Subject` — created lazily in a `useRef` so it survives
re-renders as one stable instance — carries the debounced value that drives the
query. The subscription is torn down on unmount. Only search is debounced;
price and sort update immediately.

**B. "Unset" ≠ "empty" ≠ "zero".** An empty price box becomes `undefined`, so
the argument is omitted and no bound is applied. If it sent `0`, the query would
filter to books priced ≥ ₹0 — a silent bug. Normalize at the boundary
(`parsePriceInput`, and the `undefined` mapping in `BookList`).

**C. `filtersActive` excludes sort.** Sorting never removes rows, so sorting an
empty library must not claim "no results match your filters." Only search and
price count toward `filtersActive`.

**D. Reset via remount.** Clearing filters bumps `clearSignal`, used as
`key={clearSignal}` on `<BookFilters/>`. React remounts the component, which
re-initializes its local `searchInput` (and creates a fresh rxjs `Subject`,
discarding any in-flight debounced value). This is the idiomatic way to reset
child-local state without a `setState`-in-`useEffect` cascade.

## Files

- `app/books/BookBrowser.tsx` — filter-state container; `handleClearFilters` +
  `clearSignal`.
- `app/books/BookFilters.tsx` — search (rxjs `Subject` + `debounceTime`), price
  (`parsePriceInput`), sort controls.
- `app/books/BookList.tsx` — variable passing; `filtersActive`; two empty
  states; `NoResults`.
- `app/books/sortOptions.ts` — the six combined sort options + `sortValueOf`.
- `app/books/page.tsx` — renders `<BookBrowser/>` (stays a Server Component).
- `lib/graphql/getBooks.graphql`, `lib/gql/graphql.ts`, `codegen.ts` — query
  variables + generated types.

## Tests

`npm test` → 30 tests, 0 failures. Coverage includes:

- Search variable passing (trimmed → `undefined` when empty), narrow, and
  clear.
- Price: min/max narrow the list; **empty input sent as unset, not `0`** (guard
  mock keyed on `minPrice: 0` proves it); price combines with search.
- Sort: control defaults to "Newest first" and the mount query carries
  `CREATED_AT`/`DESC`; changing it re-orders and sends the new pair.
- **Debounce** (`BookSearchDebounce.test.tsx`, fake timers): no query per
  keystroke; the query fires only after ~300ms; the visible input updates
  immediately. RED-verified — removing `debounceTime` fails the test.
- **Two empty states**: calm "No books yet." when unfiltered; the info Alert
  when a search or price filter matches nothing; **sort-only stays calm**;
  Clear filters resets the input and restores the full list.

## Slice-by-slice

| Slice | Frontend delta | Tests added |
|-------|----------------|-------------|
| 1 — Search | `BookBrowser` + `BookFilters` search input; variable wiring | +3 |
| 2 — Price | Min/Max inputs; empty → unset | +5 |
| 3 — Sort | `NativeSelect` + `sortOptions.ts`; default "Newest first" | +2 |
| 4 — Polish | rxjs debounce; two empty states + Clear filters | +6 |

## Try it yourself

With the backend running (`bin/rails server -p 3002`), start the app
(`npm run dev`) and open the books page:

1. Type in the search box — the list updates only after you pause (~300ms) and
   matches title *or* author.
2. Set a min/max price and combine it with search — results narrow by both.
3. Change the sort dropdown — the list reorders.
4. Search for `zzz` — you get "No results match your filters" + **Clear
   filters**; click it to reset.

## Follow-up ideas

- **URL-persisted filters** via Next.js `searchParams` — makes a filtered view
  shareable and reload-proof (the architecture doc's named trigger to move off
  local state).
- **Result count + pagination** — surfaces the limits of the single-key cache.
