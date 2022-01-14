import { Platform } from "react-native";
import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { MarketplaceScreen } from "app/screens/marketplace";
import { MarketplaceStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);

const MarketplaceStack = createStackNavigator<MarketplaceStackParams>();

function MarketplaceNavigator() {
  return (
    <MarketplaceStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions}
    >
      <MarketplaceStack.Group>
        <MarketplaceStack.Screen
          name="Marketplace"
          component={MarketplaceScreen}
          options={{ title: "Marketplace", headerTitle: "Marketplace" }}
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
