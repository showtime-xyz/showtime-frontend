import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { HeaderRight } from "app/components/header";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { ProfileStackParams } from "app/navigation/types";
import { ProfileScreen } from "app/screens/profile";

const ProfileStack = createStackNavigator<ProfileStackParams>();

function ProfileNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();

  return (
    <ProfileStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerLeft: () => null,
        headerRight: HeaderRight,
      })}
    >
      <ProfileStack.Screen
        name="profile"
        component={ProfileScreen}
        initialParams={{
          username: user?.data?.profile?.username ?? userAddress,
        }}
        getId={({ params }) => params?.username}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileNavigator;
