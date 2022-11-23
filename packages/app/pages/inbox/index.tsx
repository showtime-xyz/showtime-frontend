import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
import { InboxScreen } from "app/screens/inbox";

const InboxStack = createStackNavigator<HomeStackParams>();

function InboxNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <InboxStack.Navigator
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
      })}
    >
      <InboxStack.Screen name="inbox" component={InboxScreen} />
    </InboxStack.Navigator>
  );
}

export default InboxNavigator;
