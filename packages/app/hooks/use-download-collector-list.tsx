import { Platform } from "react-native";

import axios from "axios";
import * as FileSystem from "expo-file-system";

import { getAccessToken } from "app/lib/access-token";
import { Logger } from "app/lib/logger";
import Share from "app/lib/react-native-share";

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
    const fetch = axios
      .get(url, {
        responseType: "blob",
        headers,
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/csv" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "Showtime_xyz_Collector_List.csv";
        link.click();

        URL.revokeObjectURL(link.href);
      });

    toast.promise(fetch, {
      loading: contractAddress
        ? "Downloading..."
        : "Downloading your allow-list…",
      success: "Downloaded successfully!",
      error: "Download failed, please try again",
    });
  } else {
    const localFilePath = `${FileSystem.documentDirectory}Showtime_xyz_Collector_List.csv`;

    const fetch = FileSystem.downloadAsync(url, localFilePath, {
      headers,
    }).then(async ({ uri }) => {
      Logger.log("CSV downloaded to:", uri);
      setTimeout(() => {
        Share.open({ url: uri });
      }, 800);
    });

    toast.promise(fetch, {
      loading: contractAddress
        ? "Downloading..."
        : "Downloading your allow-list…",
      success: "Saved on your device!",
      error: "Download failed, please try again",
    });
  }
};
