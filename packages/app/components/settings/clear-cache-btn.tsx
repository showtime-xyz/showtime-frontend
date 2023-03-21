import { useCallback } from "react";

import { deleteAppCache } from "app/lib/delete-cache";

import { useAlert } from "design-system/alert";
import { Zap } from "design-system/icon";

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
