import { AxiosRequestConfig } from "axios";

const axios = jest.requireActual("axios");
module.exports = jest.fn(async (params: AxiosRequestConfig) => {
  if (params.url === "/v2/activity_without_auth?page=1&type_id=0&limit=5") {
    return Promise.resolve({ data: { data: [] } });
  }

  return axios(params);
});
