import { axios } from "app/lib/axios";

export const addWalletToBackend = async ({
  address,
  signature,
  nickname,
  reassignWallet,
}: {
  address: string;
  signature: string;
  nickname?: string;
  reassignWallet?: boolean;
}) => {
  return axios({
    url: `/v2/wallet/${address}/add`,
    method: "POST",
    data: { address, signature, nickname, reassign_wallet: reassignWallet },
  });
};

export const removeWalletFromBackend = async (address: string) => {
  return axios({
    url: `/v2/wallet/${address}/remove`,
    method: "DELETE",
  });
};
