import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { NotificationsStackParams } from "app/navigation/types";
import { NotificationsScreen } from "app/screens/notifications";

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
