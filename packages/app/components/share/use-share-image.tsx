import { useCallback, useState } from "react";
import { Linking, Platform } from "react-native";

import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { Haptics } from "@showtime-xyz/universal.haptics";

import domtoimage from "app/lib/dom-to-image";
import { Logger } from "app/lib/logger";
import Share, { Social } from "app/lib/react-native-share";
import { captureRef, CaptureOptions } from "app/lib/view-shot";

import { toast } from "design-system/toast";

export const useShareImage = (viewRef: any) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const getViewShot = useCallback(
    async (result?: CaptureOptions["result"]) => {
      const date = new Date();
      try {
        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 0.8,
          fileName: `QR Code - ${date.valueOf()}`,
          ...(result ? { result } : {}),
        });
        return uri;
      } catch (error) {}
    },
    [viewRef]
  );
  const checkPhotosPermission = useCallback(async () => {
    let hasPermission = false;
    if (status?.granted) {
      hasPermission = status?.granted;
    } else {
      const res = await requestPermission();
      hasPermission = res?.granted;
    }
    if (!hasPermission) {
      Alert.alert(
        "No permission",
        "To share the photo, you'll need to enable photo permissions first",
        [
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
    return hasPermission;
  }, [requestPermission, status?.granted]);
  const prepareShareToIG = useCallback(
    async (url: string) => {
      const hasPermission = await checkPhotosPermission();
      if (hasPermission) {
        await MediaLibrary.saveToLibraryAsync(url);
      }
      return hasPermission;
    },
    [checkPhotosPermission]
  );

  const shareImageToIG = useCallback(async () => {
    const url = await getViewShot();

    if (!url) {
      Alert.alert("Oops, An error occurred.");
      return;
    }
    /**
     * IG is not support private path address, and if you pass a uri, IG will always read the last pic from you Photos!
     * so we need to hack it, flow here.
     * check permission -> save to Photo -> share to IG(IG will read the last pic from you Photo)
     */
    const isCanShareToIG = await prepareShareToIG(url);
    if (!isCanShareToIG) {
      return;
    }
    await Share.shareSingle({
      title: ``,
      message: ``,
      url,
      filename: `Unlocked-Channel-Share-${new Date().valueOf()}`,
      social: Social.Instagram,
    }).catch((err) => {});
  }, [getViewShot, prepareShareToIG]);

  const downloadToLocal = useCallback(async () => {
    console.log(viewRef.current);

    if (Platform.OS === "web") {
      const dataUrl = await domtoimage.toPng(viewRef.current as Node, {
        quality: 1,
      });
      const link = document.createElement("a");
      link.download = `${new Date().valueOf()}`;
      link.href = dataUrl;
      link.click();
    } else {
      const url = await getViewShot();
      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      const hasPermission = await checkPhotosPermission();
      if (hasPermission) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await MediaLibrary.saveToLibraryAsync(url);
        toast.success("Saved to Photos");
      } else {
        Alert.alert("No write permission");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [checkPhotosPermission, getViewShot, viewRef]);

  const shareOpenMore = useCallback(async () => {
    const url = await getViewShot();
    try {
      const ShareResponse = await Share.open({
        title: ``,
        message: ``,
        url,
      });
      Logger.log("shareOpenMore Result =>", ShareResponse);
    } catch (error) {
      Logger.error("shareOpenMore Error =>", error);
    }
  }, [getViewShot]);
  return {
    shareImageToIG,
    downloadToLocal,
    shareOpenMore,
  };
};
