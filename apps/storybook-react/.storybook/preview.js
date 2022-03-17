import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DripsyProvider } from "dripsy";
import * as NextImage from "next/image";
import { enableScreens } from "react-native-screens";
import { useDeviceContext } from "twrnc";

import { linking } from "app/navigation/linking";

import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { ToastProvider } from "design-system/toast";
import { View } from "design-system/view";

import "../styles/globals.css";

enableScreens(true);

const Stack = createNativeStackNavigator();

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

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
    <DripsyProvider theme={theme}>
      <TailwindDeviceContextProvider>
        <BottomSheetModalProvider>
          <ToastProvider>
            <NavigationContainer linking={linking}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Storybook" component={Story} />
              </Stack.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </BottomSheetModalProvider>
      </TailwindDeviceContextProvider>
    </DripsyProvider>
  ),
];
