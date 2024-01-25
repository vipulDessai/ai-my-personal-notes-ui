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
    // url: "https://7ryqgloudd.execute-api.us-east-1.amazonaws.com/graphql",
    // url: "https://localhost:8081/api/values",
    url: "https://localhost:8081/graphql",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIwYmFmMGU0Ni1jMTRjLTRhN2ItYTk2ZC02NjYyNGJkM2E0OGIiLCJuYW1lIjoiaHJsZWFkZXJAZXhhbXBsZS5jb20iLCJyb2xlIjpbImhyIiwibGVhZGVyIl0sIm5iZiI6MTcwNjE5MDIwNiwiZXhwIjoxNzEzOTY2MjA2LCJpYXQiOjE3MDYxOTAyMDYsImlzcyI6Imlzc3VlciIsImF1ZCI6ImF1ZGllbmNlIn0.i0MRrHBrAaXLYjafp6X6DkHQ_Fjxq-0TlJk4Q681K60",
    },
    data: JSON.stringify({
      query: `query authorize {
        authorized
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
