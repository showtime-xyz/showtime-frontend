import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { NotificationsScreen } from "app/screens/notifications";
import { NotificationsStackParams } from "app/navigation/types";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { useIsDarkMode } from "design-system/hooks";

const NotificationsStack = createStackNavigator<NotificationsStackParams>();

function NotificationsNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <NotificationsStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <NotificationsStack.Screen
        name="notifications"
        component={NotificationsScreen}
      />
    </NotificationsStack.Navigator>
  );
}

export default NotificationsNavigator;
