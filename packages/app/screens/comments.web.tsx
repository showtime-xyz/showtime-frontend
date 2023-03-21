import { CommentsModal } from "app/components/comments-modal";

import { withModalScreen } from "design-system/modal-screen";

export const CommentsScreen = withModalScreen(CommentsModal, {
  title: "Comments",
  matchingPathname: "/nft/[chainName]/[contractAddress]/[tokenId]/comments",
  matchingQueryParam: "commentsModal",
  snapPoints: ["98%"],
});
