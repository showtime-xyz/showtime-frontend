import { Alert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";

export type EditDropDetailParams = {
  title: string;
  description: string;
};

export const useDropEditDetails = () => {
  const editDropDetails = async (
    editionAddress?: string,
    params?: EditDropDetailParams,
    callback?: () => void
  ) => {
    await axios({
      url: `/v1/creator-airdrops/edition/draft/${editionAddress}/edit`,
      method: "POST",
      data: {
        ...params,
      },
    }).catch((error) => {
      Alert.alert("Oops, An error occurred.", error?.message);
    });
    callback?.();
  };

  return {
    editDropDetails,
  };
};
