import { Platform, Share as RNShare, ShareAction } from "react-native";

import { toast } from "design-system/toast";

export const useShare = () => {
  const share = async ({ url }: { url: string }): Promise<ShareAction> => {
    if (Platform.OS === "web") {
      if (navigator.canShare?.({ url })) {
        await navigator.share({
          url,
        });
      } else {
        navigator.clipboard.writeText(url);
        toast.success("Copied!");
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
