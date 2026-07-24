import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // Introspect the live Rails backend for the schema.
  schema: "http://localhost:3002/graphql",
  // Operations live in standalone .graphql files.
  documents: ["lib/graphql/**/*.graphql"],
  generates: {
    "lib/gql/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typed-document-node",
      ],
      config: {
        // Map the Rails ISO8601DateTime scalar to a TS string.
        scalars: {
          ISO8601DateTime: "string",
        },
        // Emit enums as plain string-union types. This keeps a single
        // representation shared by the schema and operation plugins (avoids the
        // duplicate `enum` + `type` declarations the two plugins otherwise emit).
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
