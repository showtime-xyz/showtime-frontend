import { useCallback } from "react";

import FastImage from "react-native-fast-image";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";

import { deleteCache as deleteMMKVCache } from "app/lib/delete-cache";

export const ClearCacheBtn = () => {
  const Alert = useAlert();
  const clearAppCache = useCallback(() => {
    Alert.alert("Clear app cache?", "", [
      {
        text: "Confirm",
        onPress: async () => {
          deleteMMKVCache();
          await FastImage.clearMemoryCache();
          await FastImage.clearDiskCache();
        },
        style: "destructive",
      },
      {
        text: "Cancel",
      },
    ]);
  }, [Alert]);

  if (!__DEV__) return null;

  return (
    <Button size="small" onPress={clearAppCache}>
      <Text>Clear Cache</Text>
    </Button>
  );
};
