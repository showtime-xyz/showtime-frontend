import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { MarketplaceScreen } from "app/screens/marketplace";
import { MarketplaceStackParams } from "app/navigation/types";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { useIsDarkMode } from "design-system/hooks";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);

const MarketplaceStack = createStackNavigator<MarketplaceStackParams>();

function MarketplaceNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <MarketplaceStack.Navigator
      screenOptions={screenOptions({ safeAreaTop, isDark })}
    >
      <MarketplaceStack.Group>
        <MarketplaceStack.Screen
          name="marketplace"
          component={MarketplaceScreen}
        />
      </MarketplaceStack.Group>
    </MarketplaceStack.Navigator>
  );
}

export default MarketplaceNavigator;
