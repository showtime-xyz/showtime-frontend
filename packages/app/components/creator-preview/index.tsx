import { Pressable } from "react-native";

import { VerificationBadge } from "@showtime-xyz/universal.verification-badge";
import { View } from "@showtime-xyz/universal.view";

import { AvatarHoverCard } from "app/components/card/avatar-hover-card";
import { FollowButton } from "app/components/follow-button";
import { Media } from "app/components/media";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useMyInfo } from "app/hooks/api-hooks";
import { useFollow } from "app/hooks/use-follow";
import { TextLink } from "app/navigation/link";
import type { Creator } from "app/types";
import { formatAddressShort } from "app/utilities";

type Props = {
  creator: Creator;
  onMediaPress?: any;
  mediaSize: number;
};

export const CreatorPreview = withMemoAndColorScheme<any, Props>(
  ({ mediaSize, creator, onMediaPress }: Props) => {
    const { isFollowing } = useMyInfo();
    const creatorId = creator.profile_id;

    const { onToggleFollow } = useFollow({ username: creator.username });

    return (
      <View tw="p-4">
        <View tw="flex-row items-center">
          <View tw="mr-2 h-8 w-8 overflow-hidden rounded-full bg-gray-200">
            <AvatarHoverCard
              username={creator.username ?? creator.address}
              url={creator?.img_url}
              size={32}
              alt="CreatorPreview Avatar"
            />
          </View>
          <View>
            <View tw="flex-row items-center">
              <TextLink
                href={`/@${creator.username ?? creator.address}`}
                tw="mr-1 text-sm font-semibold text-gray-900 dark:text-white"
              >
                {creator.username ? (
                  <>@{creator.username}</>
                ) : (
                  <>{formatAddressShort(creator.address)}</>
                )}
              </TextLink>
              {Boolean(creator.verified) && (
                <View>
                  <VerificationBadge size={14} />
                </View>
              )}
            </View>
          </View>
          <View tw="ml-auto flex-row items-center justify-center">
            <FollowButton
              name={creator.name}
              profileId={creatorId}
              onToggleFollow={onToggleFollow}
            />
          </View>
        </View>
        <View tw="mx-[-1px] mt-4 flex-row justify-center">
          {creator.top_items?.slice(0, 3).map((item, idx) => {
            return (
              <Pressable key={item.nft_id} onPress={() => onMediaPress(idx)}>
                <Media
                  key={item.nft_id}
                  item={item}
                  sizeStyle={{
                    height: mediaSize,
                    width: mediaSize,
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
);
