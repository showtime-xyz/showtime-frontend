import axios from "axios";
import { v4 as uuid } from "uuid";

import { axios as showtimeAPIAxios } from "app/lib/axios";

export const getPinataToken = async () => {
  return showtimeAPIAxios({
    url: "/v1/pinata/key",
    method: "POST",
    data: {},
  }).then((res) => res.token);
};

/**
 * This endpoint allows the sender to add and pin any file, or directory, to Pinata's IPFS nodes.
 * See: https://docs.pinata.cloud/api-pinning/pin-file
 */
export const pinFileToIPFS = async ({ formData, token }) => {
  return axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/form-data`,
      },
    }
  );
};

/**
 * This endpoint allows the sender to add and pin any JSON object they wish to Pinata's IPFS nodes.
 * See: https://docs.pinata.cloud/api-pinning/pin-json
 */
export const pinJSONToIPFS = async ({ content, token }) => {
  return axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    { pinataMetadata: { name: uuid() }, pinataContent: content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
