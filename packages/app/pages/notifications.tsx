import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { NotificationsScreen } from "app/screens/notifications";
import { NotificationsStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";
import { useIsDarkMode } from "design-system/hooks";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);

const NotificationsStack = createStackNavigator<NotificationsStackParams>();

function NotificationsNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <NotificationsStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions({ safeAreaTop, isDark })}
    >
      <NotificationsStack.Group>
        <NotificationsStack.Screen
          name="notifications"
          component={NotificationsScreen}
        />
      </NotificationsStack.Group>
      <NotificationsStack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <NotificationsStack.Screen name="login" component={LoginScreen} />
        <NotificationsStack.Screen name="nft" component={NftScreen} />
      </NotificationsStack.Group>
    </NotificationsStack.Navigator>
  );
}

export default NotificationsNavigator;
