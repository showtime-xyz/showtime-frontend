import { AlertProvider } from "@showtime-xyz/universal.alert";
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

export const decorators = [
  (Story) => (
    <View tw="dark:bg-gray-900 bg-gray-50 min-h-screen">
      <SafeAreaProvider>
        <ColorSchemeProvider>
          <AlertProvider>
            <SnackbarProvider>
              <Story />
            </SnackbarProvider>
          </AlertProvider>
        </ColorSchemeProvider>
      </SafeAreaProvider>
    </View>
  ),
];
