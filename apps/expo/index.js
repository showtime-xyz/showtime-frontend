import "./shim";

import { registerRootComponent } from "expo";
import "expo-dev-client";
import "expo-dev-launcher";
// import { activateKeepAwake } from "expo-keep-awake";
import "expo/build/Expo.fx";
import "react-native-gesture-handler";
import TrackPlayer from "react-native-track-player";

import { PlaybackService } from "app/components/track-player/service";

import App from "./App";

// if (__DEV__) {
//   activateKeepAwake();
// }

// register audio service
TrackPlayer.registerPlaybackService(() => PlaybackService);
registerRootComponent(App);
