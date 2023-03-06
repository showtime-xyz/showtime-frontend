import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";

import { AlertProvider } from "design-system/alert";
import { SnackbarProvider } from "design-system/snackbar";
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
    <View tw="flex-1 h-full justify-center dark:bg-gray-900 bg-gray-50">
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <ColorSchemeProvider>
            <AlertProvider>
              <SnackbarProvider>
                <Story />
              </SnackbarProvider>
            </AlertProvider>
          </ColorSchemeProvider>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </View>
  ),
];
