import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { QRCodeModal } from "app/components/qr-code/index";

export const QRCodeShareScreen = withModalScreen(QRCodeModal, {
  title: "Congrats! Now share it.",
  matchingPathname: "/qr-code-share/[contractAddress]",
  matchingQueryParam: "qrCodeShareModal",
  snapPoints: ["100%"],
});
