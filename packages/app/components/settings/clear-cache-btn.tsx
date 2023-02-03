import { useCallback } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Zap } from "@showtime-xyz/universal.icon";

import { deleteAppCache } from "app/lib/delete-cache";

import { AccountSettingItem } from "./settings-account-item";

export const SettingClearAppCache = () => {
  const Alert = useAlert();
  const clearAppCache = useCallback(() => {
    Alert.alert("Clear app cache?", "", [
      {
        text: "Confirm",
        onPress: async () => {
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
    <AccountSettingItem
      title="Clear App cache"
      onPress={clearAppCache}
      buttonText="Clear Up"
      Icon={Zap}
    />
  );
};
