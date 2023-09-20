import { Platform } from "react-native";

import axios from "axios";
import * as FileSystem from "expo-file-system";

import { getAccessToken } from "app/lib/access-token";
import { Logger } from "app/lib/logger";

import { toast } from "design-system/toast";

export const downloadCollectorList = async (contractAddress?: string) => {
  const url = contractAddress
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/profile/collectors/csv/${contractAddress}`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/profile/collectors/csv/all`;
  const accessToken = getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  if (Platform.OS === "web") {
    return await axios
      .get(url, {
        responseType: "blob",
        headers,
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "download.csv";
        link.click();

        URL.revokeObjectURL(link.href);

        toast.success("Downloaded successfully!");
      })
      .catch(() => {
        toast.error("Download failed, please try again");
      });
  } else {
    const localFilePath = `${FileSystem.documentDirectory}download.csv`;

    try {
      await FileSystem.downloadAsync(url, localFilePath, {
        headers,
      }).then(async ({ uri }) => {
        toast.success("Saved on your device!");
        Logger.log("CSV downloaded to:", uri);
      });
    } catch (error) {
      toast.error("Download failed, please try again");
    }
  }
};
