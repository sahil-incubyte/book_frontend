"use client";

import { ApolloProvider } from "@apollo/client/react";
import { useState } from "react";
import { makeApolloClient } from "@/lib/apollo-client";

export function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Passing the factory as the useState initializer runs it exactly once per mount,
  // giving a stable client for this browser session across re-renders.
  const [client] = useState(makeApolloClient);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
