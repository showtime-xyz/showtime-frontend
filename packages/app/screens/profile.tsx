import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
import { useTrackPageViewed } from "app/lib/analytics";
import { mixpanel } from "app/lib/mixpanel";
import { createParam } from "app/navigation/use-param";

type Query = {
  walletAddress: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);
  useTrackPageViewed({ name: "Profile" });

  const [walletAddress, setWalletAddress] = useParam("walletAddress");

  return (
    <BottomSheetModalProvider>
      <Profile walletAddress={walletAddress as string} />
    </BottomSheetModalProvider>
  );
});

export { ProfileScreen };
