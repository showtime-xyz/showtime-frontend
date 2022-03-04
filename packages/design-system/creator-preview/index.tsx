import { useMemo, useState } from "react";
import { Dimensions, Pressable } from "react-native";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { SwipeListModal } from "app/components/swipe-list-modal";
import { useMyInfo } from "app/hooks/api-hooks";
import { formatAddressShort } from "app/lib/utilities";
import { Link } from "app/navigation/link";
import type { Creator } from "app/types";

import { Button } from "design-system/button";
import { Image } from "design-system/image";
import { Media } from "design-system/media";
import { Text } from "design-system/text";
import { VerificationBadge } from "design-system/verification-badge";
import { View } from "design-system/view";

type Props = {
  creator: Creator;
};

const mediaDimension = Dimensions.get("window").width / 3 - 16;
export const cardSize = 64 + mediaDimension + 16;

export const CreatorPreview = withMemoAndColorScheme((props: Props) => {
  const { isFollowing, follow, unfollow } = useMyInfo();
  const creatorId = props.creator.profile_id;
  const isFollowingCreator = useMemo(
    () => isFollowing(creatorId),
    [creatorId, isFollowing]
  );
  const [initialScrollIndex, setInitialScrollIndex] = useState<
    number | undefined
  >(undefined);

  return (
    <View
      tw="p-4"
      style={useMemo(() => ({ height: cardSize, overflow: "hidden" }), [])}
    >
      <View tw="flex-row justify-between items-center">
        <Link
          href={`/profile/${props.creator.address}`}
          tw="flex-row items-center"
        >
          <View tw="h-8 w-8 bg-gray-200 rounded-full mr-2">
            <Image
              source={{ uri: props.creator.img_url }}
              tw="h-8 w-8 rounded-full"
            />
          </View>
          <View>
            <View tw="items-center flex-row">
              <Text tw="text-sm text-gray-900 dark:text-white font-semibold mr-1">
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
        <View tw="flex-row justify-center items-center">
          <Button
            variant="tertiary"
            tw="h-8"
            onPress={() => {
              if (isFollowingCreator) {
                unfollow(creatorId);
              } else {
                follow(creatorId);
              }
            }}
          >
            <Text tw="text-gray-900 font-bold text-sm dark:text-white">
              {isFollowingCreator ? "Following" : "Follow"}
            </Text>
          </Button>
        </View>
      </View>
      <View tw="flex-row justify-center mt-4 mx-[-1px]">
        {props.creator.top_items.slice(0, 3).map((item, idx) => {
          return (
            <Pressable onPress={() => setInitialScrollIndex(idx)}>
              <Media key={item.nft_id} item={item} numColumns={3} />
            </Pressable>
          );
        })}
      </View>

      <SwipeListModal
        data={props.creator.top_items}
        fetchMore={() => {}}
        initialScrollIndex={initialScrollIndex}
        visible={typeof initialScrollIndex === "number"}
        hide={() => setInitialScrollIndex(undefined)}
      />
    </View>
  );
});
