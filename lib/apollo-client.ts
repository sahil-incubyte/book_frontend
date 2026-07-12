import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// Builds a fresh Apollo Client. The provider calls this once per browser session
// rather than sharing a module-level singleton, so server rendering never reuses
// one client (and its cache) across different requests.
export function makeApolloClient() {
  return new ApolloClient({
    // Relative path: the browser calls same-origin /graphql, which Next.js proxies
    // to the Rails backend (see the rewrite in next.config.ts).
    link: new HttpLink({ uri: "/graphql" }),
    cache: new InMemoryCache(),
  });
}
