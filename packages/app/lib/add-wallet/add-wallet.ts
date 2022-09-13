import { axios } from "app/lib/axios";

export const addWalletToBackend = async ({
  address,
  signature,
  nickname,
}: {
  address: string;
  signature: string;
  nickname?: string;
}) => {
  return axios({
    url: `/v2/wallet/${address}/add`,
    method: "POST",
    data: { address, signature, nickname },
  });
};

export const removeWalletFromBackend = async (address: string) => {
  return axios({
    url: `/v2/wallet/${address}/remove`,
    method: "DELETE",
  });
};
