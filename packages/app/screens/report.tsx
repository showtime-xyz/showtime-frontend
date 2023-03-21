import { ReportModal } from "app/components/report-modal";

import { withModalScreen } from "design-system/modal-screen";

export const ReportScreen = withModalScreen(ReportModal, {
  title: "Report",
  matchingPathname: "/report",
  matchingQueryParam: "reportModal",
  snapPoints: ["90%"],
  useNativeModal: false,
});
