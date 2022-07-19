import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { useDeviceContext } from "twrnc";

import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";

import { linking } from "app/navigation/linking";
import { ThemeProvider } from "app/providers/theme-provider";

import { AlertProvider } from "design-system/alert";
import { SnackbarProvider } from "design-system/snackbar";
import { tw } from "design-system/tailwind";
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
          <ThemeProvider>
            <ToastProvider>
              <AlertProvider>
                <SnackbarProvider>
                  <NavigationContainer linking={linking}>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="Storybook" component={Story} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </SnackbarProvider>
              </AlertProvider>
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </TailwindDeviceContextProvider>
  ),
];
