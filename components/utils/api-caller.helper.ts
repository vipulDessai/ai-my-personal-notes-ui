import { ApolloClient, InMemoryCache } from "@apollo/client";

// TDOO: setup the @apollo/client dev tools
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
if (true) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const headers = {
  "Content-Type": "application/json",
  Authorization: "",
};
export const apiConnector = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_HOST,
  cache: new InMemoryCache(),
  headers,
});
