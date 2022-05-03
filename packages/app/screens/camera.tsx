import { useState, useEffect, useCallback } from "react";
import { Platform } from "react-native";

import { View, Text } from "dripsy";
import { useTimer } from "use-timer";

import { Camera } from "app/components/camera";
import { useMintNFT } from "app/hooks/use-mint-nft";
import { useUser } from "app/hooks/use-user";
import { useTrackPageViewed } from "app/lib/analytics";
import { useNavigation } from "app/lib/react-navigation/native";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { useRouter } from "app/navigation/use-router";

import { FilePickerResolveValue } from "design-system/file-picker";

function CameraScreen() {
  useTrackPageViewed({ name: "Camera" });
  useHideHeader();
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const navigation = useNavigation();
  const [render, setRender] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [canPop, setCanPop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setMedia } = useMintNFT();

  const postPhoto = useCallback(
    (param: FilePickerResolveValue) => {
      setMedia({ file: param.file, fileType: param.type });

      const createPostURL = `/create`;
      if (isAuthenticated) {
        router.push(
          Platform.select({
            native: createPostURL,
            web: {
              pathname: router.pathname,
              query: { ...router.query, createModal: true },
            },
          }),
          createPostURL,
          { shallow: true }
        );
      } else {
        router.push(
          Platform.select({
            native: "/login",
            web: {
              pathname: router.pathname,
              query: {
                ...router.query,
                login: true,
                redirect_url: encodeURIComponent(createPostURL),
              },
            },
          }),
          "/login",
          { shallow: true }
        );
      }
    },
    [router, isAuthenticated, setMedia]
  );

  const burstCaptureTimer = useTimer({
    interval: 6000,
    endTime: 1,
    onTimeOver: () => {
      if (photos.length >= 1) {
        setIsLoading(false);
        postPhoto({
          file:
            //@ts-ignore
            photos[0].uri,
          type: "image",
        });
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
