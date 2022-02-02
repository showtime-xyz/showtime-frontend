import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { HomeStackParams } from "app/navigation/types";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeScreen } from "app/screens/home";
import { useIsDarkMode } from "design-system/hooks";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);
const ProfileScreen = dynamic<JSX.Element>(() =>
  import("app/screens/profile").then((mod) => mod.ProfileScreen)
);

const SettingsScreen = dynamic<JSX.Element>(() =>
  import("app/screens/settings").then((mod) => mod.SettingsScreen)
);

const HomeStack = createStackNavigator<HomeStackParams>();

function HomeNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <HomeStack.Navigator screenOptions={screenOptions({ safeAreaTop, isDark })}>
      <HomeStack.Group>
        <HomeStack.Screen name="home" component={HomeScreen} />
      </HomeStack.Group>
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
