import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";

import { AlertProvider } from "design-system/alert";
import { SnackbarProvider } from "design-system/snackbar";
import { View } from "design-system/view";

const FontsLoader = ({ children }) => {
  const [fontsLoaded, error] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.otf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.otf"),
    Inter: require("../assets/fonts/Inter-Regular.otf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.otf"),
  });

  if (!fontsLoaded) return null;

  if (error) {
    console.error(error);
  }

  return children;
};

export const decorators = [
  (Story) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ColorSchemeProvider>
          <SafeAreaProvider>
            <AlertProvider>
              <SnackbarProvider>
                <View tw="flex-1 justify-center dark:bg-gray-900">
                  <FontsLoader>
                    <Story />
                  </FontsLoader>
                </View>
              </SnackbarProvider>
            </AlertProvider>
          </SafeAreaProvider>
        </ColorSchemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  ),
];

export const parameters = {};
