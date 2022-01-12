import React, { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { View, Text } from "dripsy";
import { useTimer } from "use-timer";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

import { Camera } from "app/components/camera";
import { useRouter } from "app/navigation/use-router";

export function CameraScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [render, setRender] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isPopping, setIsPopping] = useState(false);
  const [canPop, setCanPop] = useState(true);
  const nbPop = useSharedValue(0);
  const burstCaptureTimer = useTimer({
    interval: 6000,
    endTime: 1,
    onTimeOver: () => {
      if (photos.length >= 1 && isPopping) {
        router.push("/camera/create");
        nbPop.value = withTiming(0, { duration: 500 });
      } else {
        setPhotos([]);
      }
      setIsPopping(false);
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
      const unsubscribe = navigation.addListener("focus", () => {
        if (photos.length !== 0) {
          if (Platform.OS === "web") {
            nbPop.value = withTiming(0, { duration: 500 });
            setPhotos([]);
            setRender(!render);
          } else {
            Alert.alert(
              "Did you want to delete your photo?",
              "",
              [
                {
                  text: "Continue Posting",
                  onPress: () => {
                    router.push("/camera/create");
                  },
                },
                {
                  text: "Delete",
                  onPress: () => {
                    nbPop.value = withTiming(0, { duration: 500 });
                    setPhotos([]);
                    setRender(!render);
                  },
                  style: "destructive",
                },
              ],
              { cancelable: false }
            );
          }
        }
      });

      return unsubscribe;
    },
    [navigation, photos]
  );

  useEffect(
    function didPop() {
      if (
        photos.length >= 9 ||
        (photos.length <= 1 &&
          photos.length >= 9 &&
          burstCaptureTimer.status === "STOPPED")
      ) {
        setIsPopping(false);
        router.push("/camera/create");
        nbPop.value = withTiming(0, { duration: 500 });
      }
    },
    [photos, burstCaptureTimer.status]
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
      isPopping={isPopping}
      setIsPopping={setIsPopping}
      burstCaptureTimer={burstCaptureTimer}
      captureThrottleTimer={captureThrottleTimer}
      canPop={canPop}
      setCanPop={setCanPop}
      nbPop={nbPop}
    />
  );
}
