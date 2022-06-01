import { Platform, Share as RNShare, ShareAction } from "react-native";

import { useToast } from "@showtime-xyz/universal.toast";

export const useShare = () => {
  const toast = useToast();

  const share = async ({ url }: { url: string }): Promise<ShareAction> => {
    if (Platform.OS === "web") {
      if (navigator.canShare?.({ url })) {
        await navigator.share({
          url,
        });
      } else {
        navigator.clipboard.writeText(url);

        toast?.show({ message: "Copied!", hideAfter: 5000 });
      }
      return {
        action: "sharedAction",
        activityType: "web",
      };
    } else {
      const result = await RNShare.share({
        url,
      });

      return result;
    }
  };

  return share;
};
