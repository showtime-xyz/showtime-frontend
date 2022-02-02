import createStackNavigator from "app/navigation/create-stack-navigator";
import { NotificationsScreen } from "app/screens/notifications";
import { NotificationsStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";

const NotificationsStack = createStackNavigator<NotificationsStackParams>();

function NotificationsNavigator() {
  return (
    <NotificationsStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions}
    >
      <NotificationsStack.Group>
        <NotificationsStack.Screen
          name="notifications"
          component={NotificationsScreen}
          options={{ title: "Notifications", headerTitle: "Notifications" }}
        />
      </NotificationsStack.Group>
    </NotificationsStack.Navigator>
  );
}

export default NotificationsNavigator;
