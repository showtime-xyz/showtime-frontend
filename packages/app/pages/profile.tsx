import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useUser } from "app/hooks/use-user";
import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { ProfileStackParams } from "app/navigation/types";
import { ProfileScreen } from "app/screens/profile";

import { useIsDarkMode } from "design-system/hooks";

const ProfileStack = createStackNavigator<ProfileStackParams>();

function ProfileNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const { user } = useUser();

  console.log(user?.data?.profile?.wallet_addresses_v2?.[0]?.address);

  return (
    <ProfileStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <ProfileStack.Screen
        name="profile"
        component={ProfileScreen}
        initialParams={{
          walletAddress: user?.data?.profile?.wallet_addresses_v2?.[0]?.address,
        }}
      />
    </ProfileStack.Navigator>
  );
}

export default ProfileNavigator;
