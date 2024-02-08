import axios from "axios";

export const getData = async (url: string) => {
  const r = await axios.get(url);
  return r.data;
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
