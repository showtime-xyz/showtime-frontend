import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { TrendingStackParams } from "app/navigation/types";
import { TrendingScreen } from "app/screens/trending";

const TrendingStack = createStackNavigator<TrendingStackParams>();
const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();

  if (isAuthenticated || isLoading) return <View />;

  return (
    <Button
      onPress={() => {
        // This component is native-only so we don't need to
        // worry about the web router.
        router.push("/login");
      }}
    >
      Sign In
    </Button>
  );
};

function TrendingNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <TrendingStack.Navigator
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerRight: HeaderRight,
      })}
    >
      <TrendingStack.Screen name="trending" component={TrendingScreen} />
    </TrendingStack.Navigator>
  );
}

export default TrendingNavigator;
