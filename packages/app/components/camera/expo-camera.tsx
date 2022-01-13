import { useRef, useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { View } from "dripsy";
import { AnimatePresence, View as MotiView } from "moti";
import Animated, { withTiming } from "react-native-reanimated";
import { Camera as ExpoCamera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

import { useIsForeground } from "app/hooks/use-is-foreground";
import { CameraButtons } from "app/components/camera/camera-buttons";
import { CameraFrame } from "app/components/camera/camera-frame";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

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
  const camera = useRef<ExpoCamera>(null);
  const [showPop, setShowPop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [isActive]);

  const [flash, setFlash] = useState<"off" | "on" | "auto">("auto");

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
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Add photo
      const photo = await camera.current.takePictureAsync({
        quality: 1,
        skipProcessing: true, // Set to false if experiencing orientation issues
      });

      setPhotos([...photos, photo]);

      // Start timer
      burstCaptureTimer.start();

      setIsLoading(true);
    } catch (e) {
      nbPop.value = nbPop.value - 1;
      setIsPopping(false);
      console.error("Failed to take photo!", e);
    }
  }, [camera, photos]);

  return (
    <View
      sx={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <View sx={{ height: "70%" }}>
        {isActive && (
          <ExpoCamera
            ref={camera}
            style={StyleSheet.absoluteFill}
            useCamera2Api={false}
            autoFocus={true}
          />
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

        <CameraFrame />
      </View>

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
    </View>
  );
}
