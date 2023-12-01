import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { PostCreateSuccess } from "app/components/upload/components/post-create-success";

export const PostCreateSuccessScreen = withModalScreen(PostCreateSuccess, {
  title: "",
  matchingPathname: "/posts/[postId]/share",
  matchingQueryParam: "postCreateSuccess",
  snapPoints: ["100%"],
  enableHandlePanningGesture: true,
  enableContentPanningGesture: true,
  useNativeModal: false,
});
