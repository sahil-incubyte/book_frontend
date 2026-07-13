# Book Frontend Curriculum

A Next.js + Apollo Client frontend for the `book_api` Rails GraphQL backend.

## Tech Stack
- Next.js 16.2 (App Router) + React 19 + TypeScript
- Apollo Client (GraphQL)
- Tailwind CSS v4
- Redux Toolkit / Context API for global state
- Jest + React Testing Library for testing

## Backend (already built — `../book_api`)
- Endpoint: `POST /graphql`, explorer at `/graphiql`
- `Book`: id, title, author, price (Int), createdAt, updatedAt
- Queries: `books`, `book(id)`
- Mutations: `createBook`, `updateBook`, `deleteBook` — each returns `{ book, errors }`

---

## Module 1: Foundation & Apollo Client Setup
Goal: A running Next.js app wired to the GraphQL backend via Apollo.
- [x] Step 1.1: Run the Next.js dev server; confirm the backend is reachable
- [x] Step 1.2: Configure the GraphQL endpoint (env var + port strategy)
- [x] Step 1.3: Install Apollo Client and graphql
- [x] Step 1.4: Create the Apollo Client instance
- [x] Step 1.5: Provide Apollo to the app (client provider + root layout)

## Module 2: Queries — Fetching Data
Goal: Read books from the API and render them, with loading/error handling.
- [x] Step 2.1: Explore the schema in GraphiQL; write the `books` query
- [x] Step 2.2: Define the query with `gql` and TypeScript types
- [x] Step 2.3: Build a `BookList` component with `useQuery`
- [x] Step 2.4: Handle loading and error states properly
- [x] Step 2.5: Book detail page with the `book(id)` query (dynamic route)

## Module 3: Mutations — Writing Data
Goal: Create, update, and delete books; handle server validation errors.
- [x] Step 3.1: "Add book" form with `useMutation`
- [x] Step 3.2: Refresh the list after create (refetch)
- [x] Step 3.3: Update a book
- [x] Step 3.4: Delete a book
- [x] Step 3.5: Surface server-side validation errors (`{ errors }`)

## Module 4: Apollo Cache Management & Optimistic Updates
Goal: Understand and control the normalized cache.
- [x] Step 4.1: Inspect the normalized cache (cache IDs)
- [x] Step 4.2: Update the cache directly after mutations (no refetch)
- [x] Step 4.3: Optimistic UI for delete (list, with cache.evict)

## Module 5: Global State — Context vs Redux
Goal: Manage app-wide state and know which tool fits.
- [x] Step 5.1: Learn when to reach for Context vs Redux
- [x] Step 5.2: Implement a global feature with Context (notifications/toasts)
- [x] Step 5.3: Add a Redux Toolkit slice (favorites); compare trade-offs

## Module 6: Testing with Jest & React Testing Library
Goal: Confident component tests, including mocked GraphQL.
- [x] Step 6.1: Set up Jest + RTL for Next.js
- [x] Step 6.2: Test a presentational component (FavoritesCount) + render helper
- [x] Step 6.3: Test `BookList` with Apollo `MockedProvider`
- [x] Step 6.4: Test mutation flow and error states (AddBookForm)
- [x] Step 6.5: Measure and improve coverage (reducer + FavoriteButton)

## Module 7: Refactor to GraphQL Code Generator
Goal: Replace hand-written queries/types with generated, schema-accurate code.
- [x] Step 7.1: Set up graphql-codegen (reads .graphql files, Apollo v4-safe)
- [x] Step 7.2: Move operations to .graphql files; books.ts re-exports generated docs
- [x] Step 7.3: Delete now-redundant hand-written types

## Module 8: Ship It
Goal: Document and publish.
- [ ] Step 8.1: Write README and push to GitHub
