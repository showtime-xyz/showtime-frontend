import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CreateScreen } from "app/screens/create";
import { LoginScreen } from "app/screens/login";
import { NftScreen } from "app/screens/nft";
import { ProfileScreen } from "app/screens/profile";
import { SettingsScreen } from "app/screens/settings";
import { NextTabNavigator } from "./next-tab-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { useIsDarkMode } from "design-system/hooks";

const Stack = createNativeStackNavigator();

export function RootStackNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <Stack.Navigator>
      {/* Bottom tab navigator */}
      <Stack.Screen
        name="bottomTabs"
        component={NextTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Screens accessible in most of the navigators */}
      <Stack.Group
        // @ts-ignore
        screenOptions={screenOptions({ safeAreaTop, isDark })}
      >
        <Stack.Screen name="profile" component={ProfileScreen} />
        <Stack.Screen name="settings" component={SettingsScreen} />
      </Stack.Group>

      {/* Modals */}
      <Stack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="nft" component={NftScreen} />
        <Stack.Screen name="create" component={CreateScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
