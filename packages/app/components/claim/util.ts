import { useCallback } from "react";

import { Alert } from "@showtime-xyz/universal.alert";
import { useRouter } from "@showtime-xyz/universal.router";

const usePrimaryWalletAlert = () => {
  const router = useRouter();
  const showPrimaryWalletAlert = useCallback(() => {
    Alert.alert(
      "Choose a primary wallet",
      "Please choose which wallet will receive your drop. You only have to do this once.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Choose wallet",
          onPress: async () => {
            router.push("/settings");
          },
        },
      ]
    );
  }, [router]);

  return showPrimaryWalletAlert;
};

export default usePrimaryWalletAlert;
