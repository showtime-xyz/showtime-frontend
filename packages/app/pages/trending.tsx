import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { TrendingStackParams } from "app/navigation/types";
import { TrendingScreen } from "app/screens/trending";

import { useIsDarkMode } from "design-system/hooks";

import { TrendingCreatorSwipeList } from "../screens/swipe-list-screens/trending-creator-swipe-list";
import { TrendingNFTsSwipeListScreen } from "../screens/swipe-list-screens/trending-nfts-swipe-list";

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
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <TrendingStack.Screen name="trending" component={TrendingScreen} />
      <TrendingStack.Screen
        name="trendingNFTsSwipeList"
        component={TrendingNFTsSwipeListScreen}
      />
      <TrendingStack.Screen
        name="trendingCreatorSwipeList"
        component={TrendingCreatorSwipeList}
      />
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;
