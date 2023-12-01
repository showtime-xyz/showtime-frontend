import { Platform } from "react-native";

import { useSharedValue } from "react-native-reanimated";
import { createParam } from "solito";

import { useSafeAreaFrame } from "@showtime-xyz/universal.safe-area";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/hocs/with-viewability-infinite-scroll-list";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { usePostById } from "app/hooks/use-post-by-id";

import { VideoFeedItem } from "./video-feed";

type Query = {
  postId: string;
};

const { useParam } = createParam<Query>();

export const PostDetail = () => {
  const [postId] = useParam("postId");
  const visibleItems = useSharedValue<any[]>([undefined, 0, undefined]);

  const postByIdState = usePostById(postId);
  const size = useSafeAreaFrame();
  const bottomBarHeight = usePlatformBottomHeight();
  const videoDimensions =
    Platform.OS === "web"
      ? {
          width: "100%",
          height: `calc(100dvh - ${bottomBarHeight}px)`,
        }
      : {
          width: size.width,
          height: size.height - bottomBarHeight,
        };

  if (postByIdState.data) {
    return (
      <ViewabilityItemsContext.Provider value={visibleItems}>
        <ItemKeyContext.Provider value={0}>
          <VideoFeedItem
            post={postByIdState.data}
            videoDimensions={videoDimensions}
          />
        </ItemKeyContext.Provider>
      </ViewabilityItemsContext.Provider>
    );
  }

  return null;
};
