import "expo-dev-client";
import "expo-dev-launcher";
import "expo/build/Expo.fx";
import { activateKeepAwake } from "expo-keep-awake";
import { registerRootComponent } from "expo";
import "react-native-get-random-values";
// Import the required shims
import "@ethersproject/shims";

import "./shim";
import App from "./App";

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);
