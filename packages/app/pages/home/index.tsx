import { View } from "react-native";

import { useUser } from "app/hooks/use-user";
import { useSafeAreaInsets } from "app/lib/safe-area";
import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
import { useRouter } from "app/navigation/use-router";
import { HomeScreen } from "app/screens/home";

import { Button } from "design-system/button";
import { useIsDarkMode } from "design-system/hooks";

const HomeStack = createStackNavigator<HomeStackParams>();

const HeaderRight = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useUser();

  if (isAuthenticated || isLoading) return <View />;

  return (
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
  );
};

function HomeNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <HomeStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerRight: HeaderRight,
      })}
    >
      <HomeStack.Screen name="home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
