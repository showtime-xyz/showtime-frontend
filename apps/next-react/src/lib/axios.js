import Axios from "axios";

const axios = Axios.create({
  withCredentials: true,
  headers: {
    "x-requested-with": "XMLHttpRequest",
  },
});

export default axios;
export const isCancel = (err) => Axios.isCancel(err);
export const CancelToken = Axios.CancelToken;
