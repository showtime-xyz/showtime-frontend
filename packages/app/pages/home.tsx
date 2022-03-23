import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useUser } from "app/hooks/use-user";
import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
import { useRouter } from "app/navigation/use-router";
import { HomeScreen } from "app/screens/home";

import { Button } from "design-system/button";
import { useIsDarkMode } from "design-system/hooks";

const HomeStack = createStackNavigator<HomeStackParams>();

function HomeNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();
  const { isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  return (
    <HomeStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerRight:
          !isLoading && !isAuthenticated
            ? () => (
                <Button
                  onPress={() => {
                    router.push("/login");
                  }}
                  variant="primary"
                  size="small"
                  labelTW="font-semibold"
                >
                  Sign&nbsp;In
                </Button>
              )
            : null,
      })}
    >
      <HomeStack.Screen name="home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
