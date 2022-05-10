import React, { createContext, useContext, useMemo, useState } from "react";

import { FastImageProps, ImageStyle } from "react-native-fast-image";

import { ImageBoundingClientRect, TargetImageInfo } from "./light-box-image";
import { ActiveImageType, LightImageModal } from "./light-box-modal";

export type AnimationParams = {
  layout: TargetImageInfo;
  position: ImageBoundingClientRect;
  style?: ImageStyle;
  source: FastImageProps["source"];
};

type LightBoxContext = {
  show: (params: AnimationParams) => void;
};

export const LightBoxContext = createContext<LightBoxContext | null>(null);

export const LightBoxProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [activeImage, setActiveImage] = useState<ActiveImageType | null>(null);
  const value = useMemo(
    () => ({
      show: ({ layout, position, style, source }: AnimationParams) => {
        setActiveImage({
          layout,
          ...position,
          style,
          source,
        });
      },
    }),
    []
  );

  const onClose = () => {
    setActiveImage(null);
  };
  return (
    <LightBoxContext.Provider value={value}>
      {children}
      {activeImage && (
        <LightImageModal onClose={onClose} activeImage={activeImage} />
      )}
    </LightBoxContext.Provider>
  );
};

export const useLightBox = () => {
  const lightBox = useContext(LightBoxContext);
  if (!lightBox) {
    console.error("Trying to use useLightBox without a LightBoxProvider");
  }
  return lightBox;
};
