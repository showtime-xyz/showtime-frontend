import { Platform } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";
import { createParam } from "app/navigation/use-param";

type Query = {
  username: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = withColorScheme(() => {
  useTrackPageViewed({ name: "Profile" });
  const [username] = useParam("username");
  const cleanedUsername =
    username && username !== "" ? username?.replace(/@/g, "") : null;
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();

  return (
    <BottomSheetModalProvider>
      <ErrorBoundary>
        <Profile
          username={
            Platform.select({
              web: cleanedUsername ?? userAddress,
              default:
                cleanedUsername ?? user?.data?.profile?.username ?? userAddress,
            }) as string
          }
        />
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
});

export { ProfileScreen };
