import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useRouter } from "@showtime-xyz/universal.router";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { CreatorChannelsStackParams } from "app/navigation/types";
import { CreatorChannelsScreen } from "app/screens/creator-channels";

const CreatorChannelsStack = createStackNavigator<CreatorChannelsStackParams>();

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

function CreatorChannelsNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <CreatorChannelsStack.Navigator
      screenOptions={screenOptions({
        safeAreaTop,
        isDark,
        headerRight: HeaderRight,
      })}
    >
      <CreatorChannelsStack.Screen
        name="channels"
        component={CreatorChannelsScreen}
        options={{ headerShown: false }}
      />
    </CreatorChannelsStack.Navigator>
  );
}

export default CreatorChannelsNavigator;
