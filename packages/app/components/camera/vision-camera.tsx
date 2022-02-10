import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, Platform } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { AnimatePresence, View as MotiView } from "moti";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import {
  Camera as VisionCamera,
  frameRateIncluded,
  TakePhotoOptions,
  TakeSnapshotOptions,
  CameraDeviceFormat,
  CameraRuntimeError,
  sortFormats,
  useCameraDevices,
} from "react-native-vision-camera";

import { CameraButtons } from "app/components/camera/camera-buttons";
import { useIsForeground } from "app/hooks/use-is-foreground";
import { useRouter } from "app/navigation/use-router";

import { Flash, FlashOff } from "design-system/icon";
import { Image } from "design-system/image";
import { Pressable } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

// Multi camera on Android not yet supported by CameraX
// "Thanks for the request. Currently CameraX does not support the multi camera API but as more device adopt them, we will enable support at the appropriate time. Thanks."
// https://issuetracker.google.com/issues?q=componentid:618491%20status:open&pli=1

const AnimatedCamera = Animated.createAnimatedComponent(VisionCamera);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

// The maximum zoom _factor_ you should be able to zoom in
const MAX_ZOOM_FACTOR = 20;
const SCALE_FULL_ZOOM = 3;

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  burstCaptureTimer: any;
  captureThrottleTimer: any;
  canPop: boolean;
  setCanPop: (canPop: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  postPhoto: (uri: string) => void;
};

export function Camera({
  photos,
  setPhotos,
  burstCaptureTimer,
  captureThrottleTimer,
  canPop,
  setCanPop,
  isLoading,
  setIsLoading,
  postPhoto,
}: Props) {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const camera = useRef<VisionCamera>(null);
  const [showPop, setShowPop] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const zoom = useSharedValue(0);

  // Check if camera screen is active
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const [flash, setFlash] = useState<"off" | "on" | "auto">("auto");
  const [enableHdr, setEnableHdr] = useState(true);
  const [enableNightMode, setEnableNightMode] = useState(false);
  const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
    () => ({
      photoCodec: "jpeg",
      qualityPrioritization: "speed", // use 'balanced' if not happy with performances
      flash: flash,
      quality: 100,
      skipMetadata: false,
      // enableAutoDistortionCorrection: true,
      enableAutoRedEyeReduction: true,
      enableAutoStabilization: true,
    }),
    [flash]
  );
  const [showFocus, setShowFocus] = useState(false);
  const [focus, setFocus] = useState({ x: 0, y: 0 });

  // Camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];
  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const [is60Fps, setIs60Fps] = useState(false);
  const fps = useMemo(() => {
    if (!is60Fps) return 30;

    if (enableNightMode && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
      return 30;
    }

    const supportsHdrAt60Fps = formats.some(
      (f) =>
        f.supportsVideoHDR &&
        f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
    );
    if (enableHdr && !supportsHdrAt60Fps) {
      // User has enabled HDR, but HDR is not supported at 60 FPS.
      return 30;
    }

    const supports60Fps = formats.some((f) =>
      f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
    );
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30;
    }
    // If nothing blocks us from using it, we default to 60 FPS.
    return 60;
  }, [
    cameraPosition,
    device?.supportsLowLightBoost,
    enableHdr,
    enableNightMode,
    formats,
    is60Fps,
  ]);

  const format = useMemo(() => {
    let result = formats;
    if (enableHdr) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
      result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR);
    }

    // Find the first format that includes the given FPS and is the highest photo quality
    return result.find(
      (f) =>
        f.frameRateRanges.some((r) => frameRateIncluded(r, fps)) &&
        f.isHighestPhotoQualitySupported
    );
  }, [formats, fps, enableHdr]);

  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoomFactor = device?.minZoom ?? 1;
  const neutralZoomFactor = device?.neutralZoom ?? 1;
  const maxZoomFactor = device?.maxZoom ?? 1;
  const maxZoomFactorClamped = Math.min(maxZoomFactor, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    return {
      zoom: neutralZoomFactor,
    };
  }, [neutralZoomFactor]);

  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const onFocus = useCallback(
    async ({ nativeEvent }) => {
      if (device?.supportsFocus) {
        const focus = {
          x: nativeEvent.x as number,
          y: nativeEvent.y as number,
        };
        setFocus(focus);
        setShowFocus(true);
        await camera.current?.focus(focus);
        setShowFocus(false);
      }
    },
    [device, setFocus]
  );

  const onFlashPressed = useCallback(() => {
    if (flash === "auto") setFlash("on");
    if (flash === "on") setFlash("off");
    if (flash === "off") setFlash("auto");
  }, [flash]);

  useEffect(() => {
    // Reset zoom when device changes
    zoom.value = neutralZoomFactor;
  }, [neutralZoomFactor, zoom]);

  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startZoom?: number }
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // We're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [0, startZoom, 1],
        Extrapolate.CLAMP
      );
    },
  });

  const takePhoto = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      // Reset timer if running
      burstCaptureTimer.reset();

      // Set capture throttle
      setCanPop(false);
      captureThrottleTimer.start();

      // Feedback
      setIsLoading(false);
      setShowPop(true);
      setTimeout(() => setShowPop(false), 10);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Add photo
      const photo = await camera.current.takePhoto(takePhotoOptions);

      setPhotos([...photos, { uri: `file://${photo.path}` }]);

      // Start timer
      setIsLoading(true);
      burstCaptureTimer.start();
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  }, [camera, takePhotoOptions, photos]);

  const photoUri = photos?.[0]?.uri;

  return (
    <View tw="bg-white dark:bg-black">
      <Animated.View style={{ height: photoUri ? 0 : "100%" }}>
        {device != null && (
          <PinchGestureHandler
            onGestureEvent={onPinchGesture}
            enabled={isActive}
          >
            <Animated.View style={StyleSheet.absoluteFill}>
              <TapGestureHandler onEnded={onFocus}>
                <AnimatedCamera
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  format={format}
                  fps={fps}
                  hdr={enableHdr}
                  lowLightBoost={
                    device.supportsLowLightBoost && enableNightMode
                  }
                  isActive={isActive}
                  onInitialized={onInitialized}
                  onError={onError}
                  enableZoomGesture={true}
                  animatedProps={cameraAnimatedProps}
                  photo={true}
                  video={false}
                  audio={false}
                />
              </TapGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        )}

        <AnimatePresence>
          {showPop && (
            <MotiView
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                zIndex: 1,
                backgroundColor: "white",
              }}
              from={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFocus && (
            <MotiView
              style={{
                position: "absolute",
                zIndex: 1,
                borderColor: "white",
                borderWidth: 1,
                borderRadius: 2,
              }}
              from={{
                opacity: 1,
                height: 70,
                width: 70,
                top: focus.y - 70 / 2,
                left: focus.x - 70 / 2,
              }}
              animate={{
                opacity: 0.8,
                height: 60,
                width: 60,
                top: focus.y - 60 / 2,
                left: focus.x - 60 / 2,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
      </Animated.View>

      {photoUri && (
        <View
          style={{ height: "100%" }}
          tw="w-screen bg-gray-100 dark:bg-gray-900 opacity-95"
        >
          <Image source={{ uri: photoUri }} tw="w-screen h-screen" />
        </View>
      )}

      <View tw="absolute top-0 right-0 left-0 bg-gray-100 dark:bg-gray-900 opacity-95">
        <View tw="py-8 px-4 flex-row justify-end">
          <Pressable
            tw="w-12 h-12 mt-4 rounded-full justify-center items-center bg-white dark:bg-black"
            onPress={onFlashPressed}
          >
            {flash === "off" ? (
              <FlashOff
                color={
                  tw.style("bg-black dark:bg-white")?.backgroundColor as string
                }
                width={24}
                height={24}
              />
            ) : (
              <Flash
                color={
                  flash === "on"
                    ? tw.color("amber-500")
                    : (tw.style("bg-black dark:bg-white")
                        ?.backgroundColor as string)
                }
                width={21}
                height={21}
              />
            )}
          </Pressable>
        </View>
      </View>

      <View
        tw={[
          "absolute right-0 left-0 bg-gray-100 dark:bg-gray-900 opacity-95",
          `bottom-[${tabBarHeight - 1}px]`,
        ]}
      >
        <CameraButtons
          photos={photos}
          setPhotos={setPhotos}
          canPop={canPop}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          takePhoto={takePhoto}
          cameraPosition={cameraPosition}
          setCameraPosition={setCameraPosition}
          postPhoto={postPhoto}
        />
      </View>
    </View>
  );
}
