import { useMutateContext } from "app/context/mutate-context";
import { axios } from "app/lib/axios";
import { NFT } from "app/types";

export const useRefreshMedadata = () => {
  const { mutate } = useMutateContext();
  const refreshMetadata = async (nft?: NFT) => {
    if (nft) {
      const { data } = await axios({
        url: "/v1/refresh_metadata/" + nft.nft_id,
        method: "POST",
        data: {},
      });

      mutate(data);
      return data as NFT;
    }
  };

  return refreshMetadata;
};
