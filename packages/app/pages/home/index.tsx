import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { useUser } from "app/hooks/use-user";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
import { HomeScreen } from "app/screens/home";

const HomeStack = createStackNavigator<HomeStackParams>();

const NativeHeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();

  if (isLoading || isAuthenticated) return null;

  return (
    <Button
      onPress={() => {
        // This component is native-only so we don't need to
        // worry about the web router.
        router.push("/login");
      }}
      variant="primary"
      size="small"
      labelTW="font-semibold"
    >
      Sign&nbsp;In
    </Button>
  );
};

function HomeNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  return (
    <HomeStack.Navigator
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerRight: NativeHeaderRight,
      })}
    >
      <HomeStack.Screen name="home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
