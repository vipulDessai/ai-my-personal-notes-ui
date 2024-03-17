import axios from "axios";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

export const getData = async (url: string, payload: any, headers?: any) => {
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
    headers,
  });

  return client.query({
    query: gql`
      ${payload}
    `,
  });
};

export const postData = async <T>(url: string, payload: any, headers?: any) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers,
    data: payload,
  };
  const r = await axios.request<T>(config);
  return r.data;
};

axios.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line no-unused-vars
    const { headers } = config;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
