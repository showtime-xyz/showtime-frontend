import "../expo/shim";

import * as React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";

import { ColorSchemeProvider } from "design-system/color-scheme/provider";

import StorybookUIRoot from "./.storybook/Storybook";

enableScreens(true);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ColorSchemeProvider>
        <StorybookUIRoot />
      </ColorSchemeProvider>
    </GestureHandlerRootView>
  );
}
