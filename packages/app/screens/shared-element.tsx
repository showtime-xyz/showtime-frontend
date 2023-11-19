import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

import Reanimated, {
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

import { Image } from "@showtime-xyz/universal.image";
import { useRouter } from "@showtime-xyz/universal.router";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { useStableCallback } from "app/hooks/use-stable-callback";
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

  if (!tag || !width || !height) return null;

  const normalizedImageDimensions = useMemo(() => {
    const imgWidth = Number(width);
    const imgHeight = Number(height);
    const scaleFactorX = screenDimensions.width / imgWidth;
    const scaleFactorY = screenDimensions.height / imgHeight;

    const scaledWidth = imgWidth * scaleFactorY;

    if (scaledWidth > screenDimensions.width) {
      return {
        width: screenDimensions.width,
        height: imgHeight * scaleFactorX,
        scale: scaleFactorX,
      };
    }

    return {
      width: imgWidth * scaleFactorY,
      height: imgHeight * scaleFactorY,
      scale: scaleFactorY,
    };
  }, [screenDimensions, width, height]);

  const onClose = useStableCallback(() => {
    sharedElementContext.hideActive(() => {
      router.pop();
    });
  });

  return (
    <SharedElementTarget
      animateOutsideTheScreen
      isActive
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
            <ScreenGesture scale={scale} onClose={onClose}>
              {({ screenAnimatedStyles, translateX, translateY }) => {
                const opacityDerived = useDerivedValue(() => {
                  // Interpolate each value to an opacity value and then average them
                  const opacityX = interpolate(
                    translateX.value,
                    [-200, 0, 200],
                    [0, 1, 0],
                    Extrapolate.CLAMP
                  );
                  const opacityY = interpolate(
                    translateY.value,
                    [-200, 0, 200],
                    [0, 1, 0],
                    Extrapolate.CLAMP
                  );
                  const opacityProgress = interpolate(
                    progress.value,
                    [0.3, 1],
                    [0, 1],
                    Extrapolate.CLAMP
                  );

                  return progress.value < 0.5
                    ? progress.value
                    : (opacityX + opacityY + opacityProgress) / 3;
                });

                const opacity = useAnimatedStyle(() => {
                  return {
                    opacity: opacityDerived.value,
                  };
                });
                return (
                  <View>
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
                    <Reanimated.View
                      style={[
                        { flex: 1, justifyContent: "center" },
                        screenAnimatedStyles,
                      ]}
                    >
                      <AnimatedImage
                        source={{
                          uri: url + "?optimizer=image&width=1000",
                          width: normalizedImageDimensions.width,
                          height: normalizedImageDimensions.height,
                        }}
                        ref={animatedRef}
                        placeholder={{
                          uri: url + "?optimizer=image&width=600",
                          width: normalizedImageDimensions.width,
                          height: normalizedImageDimensions.height,
                        }}
                        placeholderContentFit={"cover"}
                        style={[
                          {
                            width: normalizedImageDimensions.width,
                            height: normalizedImageDimensions.height,
                          },
                          animatedStyles,
                        ]}
                      />
                    </Reanimated.View>
                  </View>
                );
              }}
            </ScreenGesture>
          </View>
        );
      }}
    </SharedElementTarget>
  );
});

export { SharedElementScreen };
export default SharedElementScreen;
