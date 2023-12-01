import { useCallback } from "react";
import { Linking } from "react-native";

import * as Clipboard from "expo-clipboard";

import { Twitter } from "@showtime-xyz/universal.icon";
import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePostById } from "app/hooks/use-post-by-id";
import { createParam } from "app/navigation/use-param";
import { getTwitterIntent, getWebBaseURL } from "app/utilities";

import { Button } from "design-system/button";
import { toast } from "design-system/toast";

type ChannelsPromoteParams = {
  postId?: string;
};
const { useParam } = createParam<ChannelsPromoteParams>();

export const PostCreateSuccess = () => {
  const [postId] = useParam("postId");
  const { data: post, isLoading } = usePostById(postId);
  const url = `${getWebBaseURL()}/posts/${postId}`;

  const shareWithTwitterIntent = useCallback(() => {
    Linking.openURL(
      getTwitterIntent({
        url,
        message: "",
      })
    );
  }, [url]);

  if (!post || isLoading) {
    return null;
  }

  const mediaAspectRatio = post.media.width / post.media.height ?? 1;
  const mediaWidth = 200;
  const mediaHeight = mediaWidth / mediaAspectRatio;

  return (
    <View tw="p-4">
      <View tw="self-center">
        <Image
          source={{ uri: post.media.urls.thumbnail }}
          height={mediaHeight}
          width={mediaWidth}
        />
      </View>
      <View style={{ flex: 1, rowGap: 8, marginTop: 32 }}>
        <Text tw="mb-2 text-center text-2xl font-bold">
          Posted successfully!
        </Text>
        <Text tw="text-center">
          Share your new video to gain new Creator Token collectors.
        </Text>
      </View>
      <View style={{ rowGap: 16, marginTop: 16 }}>
        <Button
          size="regular"
          variant="tertiary"
          tw="w-full"
          onPress={shareWithTwitterIntent}
        >
          <Twitter width={16} height={16} /> Post on X
        </Button>
        <Button
          size="regular"
          variant="outlined"
          tw="w-full"
          onPress={async () => {
            toast.success("Copied link to clipboard");
            await Clipboard.setStringAsync(url);
          }}
        >
          Copy Link
        </Button>

        <Button
          size="regular"
          variant="primary"
          tw="w-full"
          onPress={() => {
            Linking.openURL(url);
          }}
        >
          View Post
        </Button>
      </View>
    </View>
  );
};
