import { axios } from "../axios";

export const fetchNonce = (address) => {
  return axios({
    url: `/v2/wallet/${address}/nonce`,
    method: "GET",
  });
};
