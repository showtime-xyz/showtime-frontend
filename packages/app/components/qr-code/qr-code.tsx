import { useRef, useCallback } from "react";
import { Platform, View } from "react-native";

import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { useToast } from "@showtime-xyz/universal.toast";

import domtoimage from "app/lib/dom-to-image";
import { ReactQRCode } from "app/lib/qr-code";
import { captureRef } from "app/lib/view-shot";

type Props = {
  text: string;
  size: number;
};

export const QRCode = ({ text, size }: Props) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const toast = useToast();
  const viewRef = useRef<View | Node>(null);

  const onDownload = useCallback(async () => {
    if (Platform.OS === "web") {
      const dataUrl = await domtoimage.toPng(viewRef.current as Node);
      const link = document.createElement("a");
      link.download = `QRCode-${new Date().valueOf()}`;
      link.href = dataUrl;
      link.click();
    } else {
      let hasPermission = false;
      const url = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });
      if (!url) {
        Alert.alert("Oops, An error occurred.");
        return;
      }
      if (status?.granted) {
        hasPermission = status?.granted;
      } else {
        const res = await requestPermission();
        hasPermission = res?.granted;
      }
      if (hasPermission) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await MediaLibrary.saveToLibraryAsync(url);
        toast?.show({
          message: "Saved to Photos",
          hideAfter: 2000,
        });
      } else {
        Alert.alert("Oops, No write permission.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [requestPermission, status?.granted, toast]);

  return (
    <View style={{ alignItems: "center" }}>
      <View ref={viewRef as any}>
        <ReactQRCode size={size} value={text} />
      </View>
      <Button tw="mt-4 self-center" onPress={onDownload}>
        Download QR Code
      </Button>
    </View>
  );
};
