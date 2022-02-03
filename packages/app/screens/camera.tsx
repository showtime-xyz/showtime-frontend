import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";
import { View, Text } from "dripsy";
import { useTimer } from "use-timer";
import { useNavigation } from "@react-navigation/native";

import { Camera } from "app/components/camera";
import { useRouter } from "app/navigation/use-router";
import { useUser } from "app/hooks/use-user";

function CameraScreen() {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  const [render, setRender] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [canPop, setCanPop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const postPhoto = useCallback(
    (photoURI: string) => {
      const createPostURL = `/create?uri=${photoURI}`;
      if (isAuthenticated) {
        router.push(createPostURL);
      } else {
        router.push(`/login?redirect_url=${encodeURIComponent(createPostURL)}`);
      }
    },
    [router, isAuthenticated]
  );

  const burstCaptureTimer = useTimer({
    interval: 6000,
    endTime: 1,
    onTimeOver: () => {
      if (photos.length >= 1) {
        setIsLoading(false);
        //@ts-ignore
        postPhoto(photos[0].uri);
      } else {
        setPhotos([]);
      }
    },
  });
  const captureThrottleTimer = useTimer({
    interval: 420,
    endTime: 1,
    onTimeOver: () => {
      setCanPop(true);
    },
  });

  useEffect(function checkPermissions() {
    (async () => {
      if (Platform.OS !== "web") {
        try {
          const { Camera } = require("react-native-vision-camera");
          const status = await Camera.requestCameraPermission();
          setHasPermission(status === "authorized");
        } catch (error) {}
      }
    })();
  }, []);

  useEffect(
    function checkIfContinueOrDelete() {
      const unsubscribe = navigation.addListener("focus", (e) => {
        setPhotos([]);
        setRender(!render);
      });

      return unsubscribe;
    },
    [navigation, render]
  );

  if (Platform.OS !== "web" && hasPermission === null) {
    return <View />;
  }

  if (Platform.OS !== "web" && hasPermission === false) {
    return <Text sx={{ color: "white" }}>No access to camera</Text>;
  }

  return (
    <Camera
      photos={photos}
      setPhotos={setPhotos}
      burstCaptureTimer={burstCaptureTimer}
      captureThrottleTimer={captureThrottleTimer}
      canPop={canPop}
      setCanPop={setCanPop}
      isLoading={isLoading}
      postPhoto={postPhoto}
      setIsLoading={setIsLoading}
    />
  );
}

export { CameraScreen };
