import { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { createParam } from "app/navigation/use-param";

import { ScreenGesture } from "design-system/shared-element/ScreenGesture";
import { SharedElementTarget } from "design-system/shared-element/SharedElement";
import { useSharedElementContext } from "design-system/shared-element/SharedElementContext";

type Query = {
  tag: string;
  url: string;
  width: string;
  height: string;
};

const { useParam } = createParam<Query>();
const AnimatedImage = Reanimated.createAnimatedComponent(Image);

const SharedElementScreen = withColorScheme(() => {
  const scale = useSharedValue(1);
  const router = useRouter();
  const sharedElementContext = useSharedElementContext();
  const screenDimensions = useWindowDimensions();

  const [tag] = useParam("tag");
  const [url] = useParam("url");
  const [width] = useParam("width");
  const [height] = useParam("height");

  const normalizedImageDimensions = useMemo(() => {
    const scaleFactorX = screenDimensions.width / width;
    const scaleFactorY = screenDimensions.height / height;

    const scaledWidth = width * scaleFactorY;

    if (scaledWidth > screenDimensions.width) {
      return {
        width: width * scaleFactorX,
        height: height * scaleFactorX,
        scale: scaleFactorX,
      };
    }

    return {
      width: width * scaleFactorY,
      height: height * scaleFactorY,
      scale: scaleFactorY,
    };
  }, [screenDimensions, width, height]);

  if (!tag) return null;

  return (
    <SharedElementTarget
      animateOutsideTheScreen={false}
      isActive={true}
      tag={tag}
      extraStyles={{
        scale,
      }}
    >
      {({
        animatedRef,
        animatedStyles,
        progress,
        //containerAnimatedRef,
        //containerMeasurements,
        //originMeasurements,
      }) => {
        const opacity = useAnimatedStyle(() => {
          return {
            opacity: progress.value,
          };
        });

        return (
          <View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
              },
              StyleSheet.absoluteFill,
            ]}
          >
            <Reanimated.View
              style={[
                {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.95)",
                },
                opacity,
              ]}
            />
            <ScreenGesture
              scale={scale}
              onClose={() => {
                sharedElementContext.hideActive(() => {
                  router.pop();
                });
              }}
            >
              {({ screenAnimatedStyles }) => (
                <Reanimated.View style={[screenAnimatedStyles]}>
                  <AnimatedImage
                    source={{
                      uri: url + "?optimizer=image",
                    }}
                    ref={animatedRef}
                    resizeMode={"contain"}
                    style={[
                      {
                        width: normalizedImageDimensions.width,
                        height: normalizedImageDimensions.height,
                      },
                      animatedStyles,
                    ]}
                  />
                </Reanimated.View>
              )}
            </ScreenGesture>
          </View>
        );
      }}
    </SharedElementTarget>
  );
});

export { SharedElementScreen };
export default SharedElementScreen;
