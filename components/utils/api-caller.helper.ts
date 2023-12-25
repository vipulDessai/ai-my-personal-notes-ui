import axios from "axios";

export const getData = async (url) => {
  const r = await axios.get(url);
  return r.data;
};
