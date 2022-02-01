import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { TrendingScreen } from "app/screens/trending";
import { TrendingStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";
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

const TrendingStack = createStackNavigator<TrendingStackParams>();

function TrendingNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <TrendingStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions({ safeAreaTop, isDark })}
    >
      <TrendingStack.Group>
        <TrendingStack.Screen name="trending" component={TrendingScreen} />
        <TrendingStack.Screen name="profile" component={ProfileScreen} />
        <TrendingStack.Screen name="settings" component={SettingsScreen} />
      </TrendingStack.Group>
      <TrendingStack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <TrendingStack.Screen name="login" component={LoginScreen} />
        <TrendingStack.Screen name="nft" component={NftScreen} />
      </TrendingStack.Group>
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;
