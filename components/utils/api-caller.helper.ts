import axios from "axios";

export const getData = async (url: string) => {
  const r = await axios.get(url);
  return r.data;
};

export const postData = async (url: string, payload: any) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    // url: "https://7ryqgloudd.execute-api.us-east-1.amazonaws.com/api/values",
    url: "https://7ryqgloudd.execute-api.us-east-1.amazonaws.com/graphql",
    // url: "https://localhost:62926/api/values",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      query: `query {
        books {
          id
          author {
            name
          }
        }
      }`,
      variables: {},
    }),
  };
  const r = await axios.request(config);
  return r.data;
};

axios.interceptors.request.use(
  (config) => {
    const { headers } = config;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
