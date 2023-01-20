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
          // expo-image
          // await Image.clearDiskCache();
          // await Image.clearMemoryCache();
          // fast-image
          FastImage.clearDiskCache();
          FastImage.clearMemoryCache();
        },
        style: "destructive",
      },
      {
        text: "Cancel",
      },
    ]);
  }, [Alert]);

  return (
    <Button size="small" onPress={clearAppCache}>
      <Text>Clear Cache</Text>
    </Button>
  );
};
