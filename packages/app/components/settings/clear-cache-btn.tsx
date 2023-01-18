import { useCallback } from "react";

import { Image } from "expo-image";

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
          await Image.clearDiskCache();
          await Image.clearMemoryCache();
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
