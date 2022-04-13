import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { mixpanel } from "app/lib/mixpanel";
import { createParam } from "app/navigation/use-param";

type Query = {
  username: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);

  const [username] = useParam("username");
  const cleanedUsername = username?.replace(/@/g, "");
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();

  return (
    <BottomSheetModalProvider>
      <ErrorBoundary>
        <Profile
          username={
            cleanedUsername ?? user?.data?.profile?.username ?? userAddress
          }
        />
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
});

export { ProfileScreen };
