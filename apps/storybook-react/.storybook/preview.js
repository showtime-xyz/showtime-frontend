import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { useDeviceContext } from "twrnc";

import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { tw } from "@showtime-xyz/universal.tailwind";
import { ToastProvider } from "@showtime-xyz/universal.toast";
import { View } from "@showtime-xyz/universal.view";

import { linking } from "app/navigation/linking";

import { theme } from "design-system/theme";

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

const TailwindDeviceContextProvider = ({ children }) => {
  useDeviceContext(tw);

  return (
    <View tw="flex-1 h-[95vh] justify-center dark:bg-gray-900">{children}</View>
  );
};

export const decorators = [
  (Story) => (
    <TailwindDeviceContextProvider>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <NavigationContainer linking={linking}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Storybook" component={Story} />
              </Stack.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </TailwindDeviceContextProvider>
  ),
];
