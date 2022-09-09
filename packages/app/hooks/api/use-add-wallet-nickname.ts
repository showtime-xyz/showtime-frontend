import { useSWRConfig } from "swr";

import { axios } from "app/lib/axios";
import { MY_INFO_ENDPOINT } from "app/providers/user-provider";

export const useAddWalletNickname = () => {
  const { mutate } = useSWRConfig();
  const editWalletNickName = async (
    walletAddress: string,
    nickname: string
  ) => {
    mutate(MY_INFO_ENDPOINT, async () => {
      await axios({
        url: `/v2/wallet/${walletAddress}/nickname`,
        method: "PATCH",
        data: { nickname },
      });
    });
  };

  return { editWalletNickName };
};
