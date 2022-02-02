import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { CreateScreen } from "../screens/create";
import { LoginScreen } from "../screens/login";
import { NftScreen } from "../screens/nft";
import { ProfileScreen } from "../screens/profile";
import { NextTabNavigator } from "./next-tab-navigator";

const Stack = createNativeStackNavigator();

export function RootStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="bottomTabs"
        component={NextTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="profile" component={ProfileScreen} />
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
