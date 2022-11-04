import { useRef } from "react";
import { Platform } from "react-native";

import ReactQRCode from "react-qr-code";

import { Button } from "@showtime-xyz/universal.button";
import { colors } from "@showtime-xyz/universal.tailwind";

type Props = {
  text: string;
  size: number;
};

export const QRCode = ({ text, size }: Props) => {
  const ref = useRef<any>(null);
  const onDownload = () => {
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
      // NoOP
    }
  };

  return (
    <>
      <ReactQRCode
        bgColor={colors.purple[200]}
        size={size}
        ref={ref}
        value={text}
        viewBox={`0 0 ${size} ${size}`}
      />
      {Platform.OS === "web" && (
        <Button tw="mt-4 self-center" onPress={onDownload}>
          Download
        </Button>
      )}
    </>
  );
};
