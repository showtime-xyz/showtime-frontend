import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
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

  const [walletAddress, setWalletAddress] = useParam("walletAddress");

  return (
    <BottomSheetModalProvider>
      <ErrorBoundary>
        <Profile walletAddress={walletAddress as string} />
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
});

export { ProfileScreen };
