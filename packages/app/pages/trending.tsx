import { Platform } from "react-native";
import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { TrendingScreen } from "app/screens/trending";
import { TrendingStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";

const SettingsScreen = dynamic<JSX.Element>(() =>
  import("app/screens/settings").then((mod) => mod.SettingsScreen)
);

const TrendingStack = createStackNavigator<TrendingStackParams>();

function TrendingNavigator() {
  return (
    <TrendingStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions}
    >
      <TrendingStack.Group>
        <TrendingStack.Screen
          name="trending"
          component={TrendingScreen}
          options={{ title: "Trending", headerTitle: "Trending" }}
        />
        <TrendingStack.Screen name="settings" component={SettingsScreen} />
      </TrendingStack.Group>
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;
