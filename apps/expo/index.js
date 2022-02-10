import { registerRootComponent } from "expo";
import "expo-dev-client";
import "expo-dev-launcher";
import { activateKeepAwake } from "expo-keep-awake";
import "expo/build/Expo.fx";

import App from "./App";
// Import the required shims
import "./shim";

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);
