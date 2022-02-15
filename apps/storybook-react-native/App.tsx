import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

import { linking } from "app/navigation/linking";

import "../expo/shim";
import StorybookUIRoot from "./.storybook/Storybook";

enableScreens(true);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Storybook" component={StorybookUIRoot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
