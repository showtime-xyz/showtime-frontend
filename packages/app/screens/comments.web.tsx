import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CommentsModal } from "app/components/comments-modal";

export const CommentsScreen = withModalScreen(CommentsModal, {
  title: "Comments",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/comments",
  matchingQueryParam: "commentsModal",
  snapPoints: ["98%"],
});
