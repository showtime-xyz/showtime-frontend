import React, { createContext } from "react";

type VideoConfigContextType = {
  isMuted: boolean;
  useNativeControls: boolean;
  previewOnly?: boolean;
};

export const VideoConfigContext = createContext<VideoConfigContextType | null>({
  isMuted: true,
  useNativeControls: false,
  previewOnly: true,
});

export const useVideoConfig = () => {
  return React.useContext(VideoConfigContext);
};
