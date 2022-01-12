import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
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
  withTiming,
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
import { useIsFocused } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { useIsForeground } from "app/hooks/use-is-foreground";
import { CameraButtons } from "app/components/camera/camera-buttons";
import { CameraFrame } from "app/components/camera/camera-frame";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

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
  isPopping: boolean;
  setIsPopping: (isPopping: boolean) => void;
  burstCaptureTimer: any;
  captureThrottleTimer: any;
  canPop: boolean;
  setCanPop: (canPop: boolean) => void;
  nbPop: Animated.SharedValue<number>;
};

export function Camera({
  photos,
  setPhotos,
  isPopping,
  setIsPopping,
  burstCaptureTimer,
  captureThrottleTimer,
  canPop,
  setCanPop,
  nbPop,
}: Props) {
  const camera = useRef<VisionCamera>(null);
  const [showPop, setShowPop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const zoom = useSharedValue(0);

  // Check if camera screen is active
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  // Hide header when camera is active
  const { setIsHeaderHidden } = useNavigationElements();
  useEffect(() => {
    setIsHeaderHidden(isFocused ? true : false);

    return () => {
      setIsHeaderHidden(false);
    };
  }, [isFocused]);

  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "back"
  );
  const [flash, setFlash] = useState<"off" | "on" | "auto">("auto");
  const [enableHdr, setEnableHdr] = useState(false);
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

  const [is60Fps, setIs60Fps] = useState(true);
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

    // find the first format that includes the given FPS
    return result.find((f) =>
      f.frameRateRanges.some((r) => frameRateIncluded(r, fps))
    );
  }, [formats, fps, enableHdr]);

  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoomFactor = device?.minZoom ?? 1;
  const neutralZoomFactor = device?.neutralZoom ?? 1;
  const maxZoomFactor = device?.maxZoom ?? 1;
  const maxZoomFactorClamped = Math.min(maxZoomFactor, MAX_ZOOM_FACTOR);

  const neutralZoomOut =
    (neutralZoomFactor - minZoomFactor) / (maxZoomFactor - minZoomFactor);
  const neutralZoomIn = (neutralZoomOut / maxZoomFactorClamped) * maxZoomFactor;
  const maxZoomOut = maxZoomFactorClamped / maxZoomFactor;

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = interpolate(
      zoom.value,
      [0, neutralZoomIn, 1],
      [0, neutralZoomOut, maxZoomOut],
      Extrapolate.CLAMP
    );

    return {
      zoom: isNaN(z) ? 0 : z,
    };
  }, [maxZoomOut, neutralZoomOut, neutralZoomIn, zoom]);

  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const onFocus = useCallback(
    async ({ nativeEvent }) => {
      if (device.supportsFocus) {
        const focus = {
          x: nativeEvent.x as number,
          y: nativeEvent.y as number,
        };
        setFocus(focus);
        setShowFocus(true);
        await camera.current.focus(focus);
        setShowFocus(false);
      }
    },
    [device, setFocus]
  );

  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoomIn;
  }, [neutralZoomIn, zoom]);

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
      if (photos.length > 9 || nbPop.value > 9) return;

      // Pop progress
      nbPop.value = withTiming(nbPop.value + 1, { duration: 50 });

      // Reset timer if running
      burstCaptureTimer.reset();

      // Set capture throttle
      setCanPop(false);
      captureThrottleTimer.start();

      // Feedback
      setIsLoading(false);
      setIsPopping(true);
      setShowPop(true);
      setTimeout(() => setShowPop(false), 10);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Add photo
      const photo = await camera.current.takePhoto(takePhotoOptions);

      setPhotos([...photos, { uri: `file://${photo.path}` }]);

      // Start timer
      burstCaptureTimer.start();

      setIsLoading(true);
    } catch (e) {
      nbPop.value = nbPop.value - 1;
      setIsPopping(false);
      console.error("Failed to take photo!", e);
    }
  }, [camera, takePhotoOptions, photos]);

  return (
    <Animated.View
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <StatusBar style="auto" />
      <Animated.View style={{ height: "70%" }}>
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

        <CameraFrame />
      </Animated.View>

      <CameraButtons
        photos={photos}
        setPhotos={setPhotos}
        isPopping={isPopping}
        setIsPopping={setIsPopping}
        canPop={canPop}
        nbPop={nbPop}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        flash={flash}
        setFlash={setFlash}
        takePhoto={takePhoto}
      />
    </Animated.View>
  );
}
