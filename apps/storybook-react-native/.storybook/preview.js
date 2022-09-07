import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDeviceContext } from "twrnc";

import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";

import { AlertProvider } from "design-system/alert";
import { SnackbarProvider } from "design-system/snackbar";
import { tw } from "design-system/tailwind";
import { ToastProvider } from "design-system/toast";
import { View } from "design-system/view";

const FontsLoader = ({ children }) => {
  const [fontsLoaded, error] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.otf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.otf"),
    Inter: require("../assets/fonts/Inter-Regular.otf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.otf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.otf"),
    "SpaceGrotesk-Regular": require("../assets/fonts/SpaceGrotesk-Regular.otf"),
    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.otf"),
  });

  if (!fontsLoaded) return null;

  if (error) {
    console.error(error);
  }

  return children;
};

const TailwindDeviceContextProvider = ({ children }) => {
  useDeviceContext(tw);

  return children;
};

export const decorators = [
  (Story) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TailwindDeviceContextProvider>
        <BottomSheetModalProvider>
          <ColorSchemeProvider>
            <SafeAreaProvider>
              <ToastProvider>
                <AlertProvider>
                  <SnackbarProvider>
                    <MainAxisCenter>
                      <FontsLoader>
                        <Story />
                      </FontsLoader>
                    </MainAxisCenter>
                  </SnackbarProvider>
                </AlertProvider>
              </ToastProvider>
            </SafeAreaProvider>
          </ColorSchemeProvider>
        </BottomSheetModalProvider>
      </TailwindDeviceContextProvider>
    </GestureHandlerRootView>
  ),
];

const MainAxisCenter = ({ children }) => {
  useDeviceContext(tw);

  return <View tw="flex-1 justify-center dark:bg-gray-900">{children}</View>;
};

export const parameters = {};
