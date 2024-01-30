import axios from "axios";

export const getData = async (url: string) => {
  const r = await axios.get(url);
  return r.data;
};

export const postData = async (url: string, payload: any, headers?: any) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers,
    data: payload,
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
