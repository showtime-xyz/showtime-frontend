import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { HeaderSearch } from "app/components/header/header-search";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
import { HomeScreenV2 } from "app/screens/homev2";

const HomeStack = createStackNavigator<HomeStackParams>();

function HomeNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <HomeStack.Navigator
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerRight: HeaderSearch,
      })}
    >
      <HomeStack.Screen
        name="home"
        component={HomeScreenV2}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
