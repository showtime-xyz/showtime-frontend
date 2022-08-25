import { useMemo } from "react";
import { Pressable } from "react-native";

import { Image } from "@showtime-xyz/universal.image";
import { Text } from "@showtime-xyz/universal.text";
import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { FollowButton } from "app/components/follow-button";
import { Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useMyInfo } from "app/hooks/api-hooks";
import { useFollow } from "app/hooks/use-follow";
import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { Link } from "app/navigation/link";
import type { Creator } from "app/types";
import { formatAddressShort } from "app/utilities";

type Props = {
  creator: Creator;
  onMediaPress?: any;
  mediaSize: number;
};

export const CreatorPreview = withMemoAndColorScheme((props: Props) => {
  const { isFollowing } = useMyInfo();
  const creatorId = props.creator.profile_id;
  const isFollowingCreator = useMemo(
    () => isFollowing(creatorId),
    [creatorId, isFollowing]
  );

  const { onToggleFollow } = useFollow({ username: props.creator.username });

  return (
    <View tw="p-4">
      <View tw="flex-row items-center justify-between">
        <Link
          href={`/@${props.creator.username ?? props.creator.address}`}
          tw="flex-row items-center"
        >
          <View tw="mr-2 h-8 w-8 rounded-full bg-gray-200">
            <Image
              source={{ uri: props.creator?.img_url ?? DEFAULT_PROFILE_PIC }}
              tw="h-8 w-8 rounded-full"
            />
          </View>
          <View>
            <View tw="flex-row items-center">
              <Text tw="mr-1 text-sm font-semibold text-gray-900 dark:text-white">
                {props.creator.username ? (
                  <>@{props.creator.username}</>
                ) : (
                  <>{formatAddressShort(props.creator.address)}</>
                )}
              </Text>
              {Boolean(props.creator.verified) && (
                <View>
                  <VerificationBadge size={14} />
                </View>
              )}
            </View>
          </View>
        </Link>
        <View tw="flex-row items-center justify-center">
          <FollowButton
            isFollowing={isFollowingCreator}
            name={props.creator.name}
            profileId={creatorId}
            onToggleFollow={onToggleFollow}
          />
        </View>
      </View>
      <View tw="mx-[-1px] mt-4 flex-row justify-center">
        {props.creator.top_items.slice(0, 3).map((item, idx) => {
          return (
            <Pressable
              key={item.nft_id}
              onPress={() => props.onMediaPress(idx)}
            >
              <Media
                key={item.nft_id}
                item={item}
                numColumns={3}
                sizeStyle={{
                  height: props.mediaSize,
                  width: props.mediaSize,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
