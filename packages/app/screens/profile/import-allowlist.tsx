import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { ImportAllowlist } from "app/components/profile/import-allowlist";

export const CreatorTokensImportAllowlistScreen = withModalScreen(
  ImportAllowlist,
  {
    title: "",
    matchingPathname: "/creator-token/import-allowlist",
    matchingQueryParam: "creatorTokensImportAllowlistModal",
    snapPoints: [400],
    useNativeModal: false,
  }
);
