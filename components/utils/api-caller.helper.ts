import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// TDOO: setup the @apollo/client dev tools
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { GENERAL_KEYS } from "./constant";
if (true) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_HOST + "/graphql",
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(GENERAL_KEYS.APP_API_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
export const apiConnector = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/** API Data Interfaces */
export interface GetUserAuthData {
  token: string;
}
