import React, { createContext } from "react";
import { Platform } from "react-native";

type VideoConfigContextType = {
  isMuted: boolean;
  useNativeControls: boolean;
  previewOnly?: boolean;
};

export const VideoConfigContext = createContext<VideoConfigContextType | null>({
  isMuted: true,
  useNativeControls: false,
  // Always play the video on web
  previewOnly: Platform.OS !== "web",
});

export const useVideoConfig = () => {
  return React.useContext(VideoConfigContext);
};
