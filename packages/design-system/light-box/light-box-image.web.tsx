import React, { useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import { Source } from "react-native-fast-image";
import { OnLoadEvent } from "react-native-fast-image";

import { Image } from "../image";
import { View } from "../view";
import { LightImageProps } from "./light-box-image";

export const LightBoxImg = ({
  width: imgWidth,
  height: imgHeight,
  containerStyle,
  alt = "",
  source,
  style,
  ...rest
}: LightImageProps) => {
  const [naturalSize, setNaturalSize] = useState<
    OnLoadEvent["nativeEvent"] | null
  >(null);

  useLayoutEffect(() => {
    let lightbox: null | PhotoSwipeLightbox;
    if (naturalSize) {
      lightbox = new PhotoSwipeLightbox({
        gallery: "#light-box",
        children: "a",
        // setup PhotoSwipe Core dynamic import
        pswpModule: () => import("photoswipe"),
        arrowPrev: false,
        arrowNext: false,
        zoom: false,
        showHideAnimationType: "fade",
      });
      lightbox.init();
    }

    return () => {
      lightbox?.destroy();
      lightbox = null;
    };
  }, [naturalSize]);

  return (
    <View style={containerStyle}>
      <Pressable nativeID="light-box">
        <a
          data-pswp-src={(source as Source).uri}
          data-pswp-width={naturalSize?.width}
          data-pswp-height={naturalSize?.height}
        >
          <Image
            width={imgWidth}
            height={imgHeight}
            alt={alt}
            source={source}
            style={style}
            onLoad={({ nativeEvent }) => {
              setNaturalSize(nativeEvent);
            }}
            {...rest}
          />
        </a>
      </Pressable>
    </View>
  );
};
