import "./shim";

import { registerRootComponent } from "expo";
import "expo-dev-client";
import "expo-dev-launcher";
import "expo/build/Expo.fx";
import "react-native-gesture-handler";

import App from "./App";

registerRootComponent(App);
