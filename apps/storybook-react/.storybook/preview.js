import "../styles/globals.css";

import * as NextImage from "next/image";
import { DripsyProvider } from "dripsy";
import { useDeviceContext } from "twrnc";

import { theme } from "design-system/theme";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ToastProvider } from "design-system/toast";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { linking } from "app/navigation/linking";

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
