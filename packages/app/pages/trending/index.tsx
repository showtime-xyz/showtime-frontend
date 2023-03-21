import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { TrendingStackParams } from "app/navigation/types";
import { TrendingScreen } from "app/screens/trending";

import { useIsDarkMode } from "design-system/hooks";
import { useSafeAreaInsets } from "design-system/safe-area";

const TrendingStack = createStackNavigator<TrendingStackParams>();

function TrendingNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <TrendingStack.Navigator
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <TrendingStack.Screen name="trending" component={TrendingScreen} />
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;
