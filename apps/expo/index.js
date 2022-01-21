import 'expo-dev-client';
import "expo-dev-launcher";
import "expo/build/Expo.fx";
import { activateKeepAwake } from "expo-keep-awake";
import { registerRootComponent } from "expo";
// Import the required shims
import "./shim";
import App from "./App";

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);
