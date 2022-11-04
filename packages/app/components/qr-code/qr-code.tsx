import { useRef } from "react";
import { Platform, View } from "react-native";

import * as MediaLibrary from "expo-media-library";
import ReactQRCode from "react-qr-code";

import { Button } from "@showtime-xyz/universal.button";
import { useToast } from "@showtime-xyz/universal.toast";

import ViewShot from "app/lib/view-shot";

type Props = {
  text: string;
  size: number;
};

export const QRCode = ({ text, size }: Props) => {
  const ref = useRef<any>(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const toast = useToast();
  const onDownload = async () => {
    if (Platform.OS === "web") {
      const svg = ref.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");

        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } else {
      let hasPermission = false;
      ref.current.capture().then(async (uri: string) => {
        if (status?.granted) {
          hasPermission = status?.granted;
        } else {
          const res = await requestPermission();
          hasPermission = res?.granted;
        }

        if (hasPermission) {
          await MediaLibrary.saveToLibraryAsync(uri);
          toast?.show({
            message: "Saved to Photos",
            hideAfter: 2000,
          });
        }
      });
    }
  };

  return (
    <View style={{ alignItems: "center" }}>
      <ViewShot
        ref={ref}
        options={{ fileName: "QR Code", format: "png", quality: 0.9 }}
      >
        <ReactQRCode
          size={size}
          ref={ref}
          value={text}
          viewBox={`0 0 ${size} ${size}`}
        />
      </ViewShot>
      <Button tw="mt-4 self-center" onPress={onDownload}>
        Download QR Code
      </Button>
    </View>
  );
};
