import "./shim";

import { registerRootComponent } from "expo";
import "expo-dev-client";
import "expo-dev-launcher";
import "expo/build/Expo.fx";

import App from "./App";

registerRootComponent(App);
