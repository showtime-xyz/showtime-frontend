import { View } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { useUser } from "app/hooks/use-user";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { HomeStackParams } from "app/navigation/types";
import { useRouter } from "app/navigation/use-router";
import { HomeScreen } from "app/screens/home";

const HomeStack = createStackNavigator<HomeStackParams>();

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
