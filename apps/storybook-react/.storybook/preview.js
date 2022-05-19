import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { TailwindProvider } from "tailwindcss-react-native";

import { linking } from "app/navigation/linking";

import { theme } from "design-system/theme";
import { ToastProvider } from "design-system/toast";
import { View } from "design-system/view";

import "../styles/globals.css";

enableScreens(true);

const Stack = createNativeStackNavigator();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <TailwindProvider>
      <View tw="flex-1 h-[95vh] justify-center dark:bg-gray-900">
        <BottomSheetModalProvider>
          <ToastProvider>
            <NavigationContainer linking={linking}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Storybook" component={Story} />
              </Stack.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </BottomSheetModalProvider>
      </View>
    </TailwindProvider>
  ),
];
