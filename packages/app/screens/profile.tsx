import { Platform } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { createParam } from "app/navigation/use-param";

type Query = {
  username: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = withColorScheme(() => {
  const [username] = useParam("username");
  const cleanedUsername = username?.replace(/@/g, "");
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();

  return (
    <BottomSheetModalProvider>
      <ErrorBoundary>
        <Profile
          username={
            Platform.OS === "web"
              ? cleanedUsername
              : cleanedUsername ?? userAddress ?? user?.data?.profile?.username
          }
        />
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
});

export { ProfileScreen };
