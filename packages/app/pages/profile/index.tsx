import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
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
      screenOptions={{
        headerShown: false,
      }}
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
