import type { CodegenConfig } from "@graphql-codegen/cli";

// To bypass self-signed certificate issue with localhost
// refer - https://github.com/jasonkuhrt/graphql-request/issues/125
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const config: CodegenConfig = {
  overwrite: true,
  // TODO: pick the url automatically based on the env
  // schema: "https://7ryqgloudd.execute-api.us-east-1.amazonaws.com/graphql",
  schema: "http://localhost:8081/graphql",
  documents: ["src/components/**/*.tsx", "src/pages/**/*.tsx"],
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
