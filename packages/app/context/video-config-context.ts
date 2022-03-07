import React, { createContext } from "react";

type VideoConfigContextType = {
  isMuted: boolean;
  useNativeControls: boolean;
};

export const VideoConfigContext = createContext<VideoConfigContextType | null>({
  isMuted: true,
  useNativeControls: false,
});

export const useVideoConfig = () => {
  return React.useContext(VideoConfigContext);
};
