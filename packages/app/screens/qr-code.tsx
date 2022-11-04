import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { QRCode } from "app/components/qr-code";

export const QRCodeScreen = withModalScreen(QRCode, {
  title: "QR Code",
  matchingPathname: "/qr-code",
  matchingQueryParam: "qrCodeModal",
  enableContentPanningGesture: false,
  snapPoints: ["90%"],
});
