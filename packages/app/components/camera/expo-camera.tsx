import { useRef, useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { View } from "dripsy";
import { AnimatePresence, View as MotiView } from "moti";
import { Camera as ExpoCamera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

import { useIsForeground } from "app/hooks/use-is-foreground";
import { CameraButtons } from "app/components/camera/camera-buttons";
import { useNavigationElements } from "app/navigation/use-navigation-elements";

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  burstCaptureTimer: any;
  captureThrottleTimer: any;
  canPop: boolean;
  setCanPop: (canPop: boolean) => void;
};

export function Camera({
  photos,
  setPhotos,
  burstCaptureTimer,
  captureThrottleTimer,
  canPop,
  setCanPop,
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
      if (photos.length > 9) return;

      // Reset timer if running
      burstCaptureTimer.reset();

      // Set capture throttle
      setCanPop(false);
      captureThrottleTimer.start();

      // Feedback
      setIsLoading(false);
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
      </View>

      <CameraButtons
        photos={photos}
        setPhotos={setPhotos}
        canPop={canPop}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        flash={flash}
        setFlash={setFlash}
        takePhoto={takePhoto}
      />
    </View>
  );
}
