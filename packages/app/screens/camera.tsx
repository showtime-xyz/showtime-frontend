import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { View, Text } from "dripsy";
import { useTimer } from "use-timer";
import { useNavigation } from "@react-navigation/native";

import { Camera } from "app/components/camera";
import { useRouter } from "app/navigation/use-router";

function CameraScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [render, setRender] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [canPop, setCanPop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const burstCaptureTimer = useTimer({
    interval: 6000,
    endTime: 1,
    onTimeOver: () => {
      if (photos.length >= 1) {
        setIsLoading(false);
        router.push(`/camera/create?uri=${photos[0].uri}`);
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
      const unsubscribe = navigation.addListener("focus", () => {
        if (photos.length !== 0) {
          if (Platform.OS === "web") {
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
                    router.push(`/camera/create?uri=${photos[0].uri}`);
                  },
                },
                {
                  text: "Delete",
                  onPress: () => {
                    setIsLoading(false);
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
      setIsLoading={setIsLoading}
    />
  );
}

export { CameraScreen };
