import { useRef, useCallback } from "react";
import { Platform } from "react-native";

import * as MediaLibrary from "expo-media-library";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import { Haptics } from "@showtime-xyz/universal.haptics";
import { ViewProps, View } from "@showtime-xyz/universal.view";

import domtoimage from "app/lib/dom-to-image";
import { ReactQRCode } from "app/lib/qr-code";
import { captureRef } from "app/lib/view-shot";

import { toast } from "design-system/toast";

type Props = ViewProps & {
  value: string;
  size: number;
};

export const QRCode = ({ value, size, ...rest }: Props) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const viewRef = useRef<typeof View | Node>(null);

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
        toast.success("Saved to Photos");
      } else {
        Alert.alert("Oops, No write permission.");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [requestPermission, status?.granted]);

  return (
    <View {...rest}>
      <View ref={viewRef as any} tw="rounded-lg bg-white p-2 dark:bg-black">
        <ReactQRCode size={size} value={value} ecl="H" />
      </View>
      <Button tw="mt-8 self-center" onPress={onDownload}>
        Download QR Code
      </Button>
    </View>
  );
};
