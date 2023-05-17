import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { DownloadQRCodeModal } from "app/components/qr-code";

export const QRCodeShareScreen = withModalScreen(DownloadQRCodeModal, {
  title: "Congrats! Now share it.",
  matchingPathname: "/qr-code-share/[contractAddress]",
  matchingQueryParam: "qrCodeShareModal",
  snapPoints: ["100%"],
});
