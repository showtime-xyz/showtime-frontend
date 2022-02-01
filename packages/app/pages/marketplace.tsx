import { Platform } from "react-native";
import dynamic from "next/dynamic";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { MarketplaceScreen } from "app/screens/marketplace";
import { MarketplaceStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";
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
      // @ts-ignore
      screenOptions={navigatorScreenOptions({ safeAreaTop, isDark })}
    >
      <MarketplaceStack.Group>
        <MarketplaceStack.Screen
          name="marketplace"
          component={MarketplaceScreen}
        />
      </MarketplaceStack.Group>
      <MarketplaceStack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <MarketplaceStack.Screen name="login" component={LoginScreen} />
        <MarketplaceStack.Screen name="nft" component={NftScreen} />
      </MarketplaceStack.Group>
    </MarketplaceStack.Navigator>
  );
}

export default MarketplaceNavigator;
