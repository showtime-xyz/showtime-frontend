import { useRef, useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";

import { Camera as ExpoCamera } from "expo-camera";
import { AnimatePresence, View as MotiView } from "moti";

import { CameraButtons } from "app/components/camera/camera-buttons";
import { useIsForeground } from "app/hooks/use-is-foreground";
import { track } from "app/lib/analytics";
import { useIsFocused } from "app/lib/react-navigation/native";
import { createParam } from "app/navigation/use-param";

import { Image } from "design-system/image";
import { View } from "design-system/view";

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  burstCaptureTimer: any;
  captureThrottleTimer: any;
  canPop: boolean;
  setCanPop: (canPop: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  postPhoto: (param?: File | string) => void;
};

type Query = {
  form: string;
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
  const camera = useRef<ExpoCamera>(null);
  const [showPop, setShowPop] = useState(false);
  const { useParam } = createParam<Query>();

  // Check if camera screen is active
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

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

      setPhotos([photo]);

      // Start timer
      burstCaptureTimer.start();

      setIsLoading(true);

      track("Photo Taken");
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  }, [camera, photos]);

  const [cameraPosition, setCameraPosition] = useState<
    keyof typeof ExpoCamera.Constants.Type
  >(ExpoCamera.Constants.Type.front);

  const photoUri = photos?.[0]?.uri;

  const [form] = useParam("form");

  useEffect(() => {
    if (form) {
      setPhotos([]);
      setIsLoading(false);
    }
  }, [form]);

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
            type={cameraPosition}
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

        {photoUri && (
          <View
            style={{ height: "100%" }}
            tw="w-screen bg-gray-100 dark:bg-gray-900 opacity-95"
          >
            <img
              src={photoUri}
              style={{ height: "100%", objectFit: "contain" }}
            />
          </View>
        )}
      </View>

      <CameraButtons
        photos={photos}
        setPhotos={setPhotos}
        canPop={canPop}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        takePhoto={takePhoto}
        setCameraPosition={setCameraPosition}
        cameraPosition={cameraPosition}
        postPhoto={postPhoto}
      />
    </View>
  );
}
