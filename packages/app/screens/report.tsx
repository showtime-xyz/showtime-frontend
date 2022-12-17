import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ReportModal } from "app/components/report-modal";

export const ReportScreen = withModalScreen(ReportModal, {
  title: "Report",
  matchingPathname: "/report",
  matchingQueryParam: "reportModal",
  snapPoints: ["90%"],
  useNativeModal: false,
});
