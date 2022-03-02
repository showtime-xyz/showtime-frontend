import { Platform } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { screenOptions } from "app/navigation/navigator-screen-options";
import { CommentsScreen } from "app/screens/comments";
import { CreateScreen } from "app/screens/create";
import { DeleteScreen } from "app/screens/delete";
import { LoginScreen } from "app/screens/login";
import { NftScreen } from "app/screens/nft";
import { ProfileScreen } from "app/screens/profile";
import { SearchScreen } from "app/screens/search";
import { SettingsScreen } from "app/screens/settings";
import { TransferNftScreen } from "app/screens/transfer-nft";

import { useIsDarkMode } from "design-system/hooks";

import { NextTabNavigator } from "./next-tab-navigator";

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
        <Stack.Screen
          name="profile"
          component={ProfileScreen}
          getId={({ params }) => params?.walletAddress}
        />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{
            animation: "none",
          }}
        />
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
        <Stack.Screen name="comments" component={CommentsScreen} />
        <Stack.Screen
          name="nft"
          component={NftScreen}
          getId={({ params }) => params?.id}
        />
        <Stack.Screen name="transferNft" component={TransferNftScreen} />
        <Stack.Screen name="create" component={CreateScreen} />
        <Stack.Screen name="burn" component={DeleteScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
