import "./shim";
// https://docs.ethers.io/v5/cookbook/react-native/#cookbook-reactnative-security
import "@ethersproject/shims";

import { registerRootComponent } from "expo";
import "expo-dev-client";
import "expo-dev-launcher";
// import { activateKeepAwake } from "expo-keep-awake";
import "expo/build/Expo.fx";
import "react-native-gesture-handler";

import App from "./App";

// if (__DEV__) {
//   activateKeepAwake();
// }

registerRootComponent(App);
