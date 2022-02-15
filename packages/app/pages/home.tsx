import { Platform } from "react-native";

import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
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
const TransferNftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/transfer-nft").then((mod) => mod.TransferNftScreen)
);

const SettingsScreen = dynamic<JSX.Element>(() =>
  import("app/screens/settings").then((mod) => mod.SettingsScreen)
);

const HomeStack = createStackNavigator<HomeStackParams>();

function HomeNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <HomeStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <HomeStack.Screen name="home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
