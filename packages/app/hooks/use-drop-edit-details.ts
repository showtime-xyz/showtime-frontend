import { Alert } from "@showtime-xyz/universal.alert";

import { axios } from "app/lib/axios";

import { toast } from "design-system/toast";

export type EditDropDetailParams = {
  name: string;
  description: string;
};

export const useDropEditDetails = () => {
  const editDropDetails = async (
    editionAddress?: string,
    params?: EditDropDetailParams
  ) => {
    const res = await axios({
      url: `/v1/creator-airdrops/edition/draft/${editionAddress}/edit`,
      method: "POST",
      data: {
        ...params,
      },
    }).catch((error) => {
      Alert.alert("Oops, An error occurred.", error?.message);
    });
    if (res) {
      toast.success("Updated!");
      return res;
    }
  };

  return {
    editDropDetails,
  };
};
