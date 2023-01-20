import { useCallback } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";

import { deleteAppCache } from "app/lib/delete-cache";

export const ClearCacheBtn = () => {
  const Alert = useAlert();
  const clearAppCache = useCallback(() => {
    Alert.alert("Clear app cache?", "", [
      {
        text: "Confirm",
        onPress: async () => {
          // expo-image
          // await Image.clearDiskCache();
          // await Image.clearMemoryCache();
          // fast-image
          deleteAppCache();
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
