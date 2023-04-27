import { AlertProvider } from "@showtime-xyz/universal.alert";
import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";
import { View } from "@showtime-xyz/universal.view";

import "../styles/globals.css";

// TODO: remove this once Reanimated ship a fix
if (typeof window !== "undefined") {
  // @ts-ignore
  window._frameTimestamp = null;
}

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
    <View tw="dark:bg-gray-900 bg-gray-50 min-h-screen">
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
