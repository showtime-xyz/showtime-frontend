import { useCallback } from "react";

import { Zap } from "@showtime-xyz/universal.icon";

import { deleteAppCache } from "app/lib/delete-cache";

import { toast } from "design-system/toast";

import { AccountSettingItem } from "./settings-account-item";

export const SettingClearAppCache = () => {
  const clearAppCache = useCallback(() => {
    deleteAppCache();
    toast.success("Cleared!");
  }, []);
  return (
    <AccountSettingItem
      title="Clear App cache"
      onPress={clearAppCache}
      buttonText="Clear Up"
      Icon={Zap}
    />
  );
};
