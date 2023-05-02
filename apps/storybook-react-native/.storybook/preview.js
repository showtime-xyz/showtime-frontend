import { Appearance } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";

export const decorators = [
  (Story) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ColorSchemeProvider>
          <SafeAreaProvider>
            <AlertProvider>
              <SnackbarProvider>
                <Story />
              </SnackbarProvider>
            </AlertProvider>
          </SafeAreaProvider>
        </ColorSchemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: Appearance.getColorScheme() === "dark" ? "dark" : "plain",
    values: [
      { name: "plain", value: "white" },
      { name: "dark", value: "#333" },
      { name: "app", value: "#eeeeee" },
    ],
  },
};
