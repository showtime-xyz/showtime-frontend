import { QRCodeModal } from "app/components/qr-code/index";

import { withModalScreen } from "design-system/modal-screen";

export const QRCodeShareScreen = withModalScreen(QRCodeModal, {
  title: "Congrats! Now share it.",
  matchingPathname: "/qr-code-share/[contractAddress]",
  matchingQueryParam: "qrCodeShareModal",
  snapPoints: ["100%"],
});
