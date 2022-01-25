import { useMemo } from "react";
import { Dimensions } from "react-native";
import { Text } from "design-system/text";
import { View } from "design-system/view";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";
import { Button } from "design-system/button";
import { Media } from "design-system/media";
import type { Creator } from "app/types";
import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { useMyInfo } from "app/hooks/api-hooks";
import { Link } from "app/navigation/link";
import { useRouter } from "app/navigation/use-router";

type Props = {
  creator: Creator;
};

const mediaDimension = Dimensions.get("window").width / 3 - 16;
export const cardSize = 64 + mediaDimension + 16;

export const CreatorPreview = withMemoAndColorScheme((props: Props) => {
  const router = useRouter();
  const { isFollowing, follow, unfollow } = useMyInfo();
  const creatorId = props.creator.profile_id;
  const isFollowingCreator = useMemo(
    () => isFollowing(creatorId),
    [creatorId, isFollowing]
  );

  return (
    <View
      tw="p-4"
      style={useMemo(() => ({ height: cardSize, overflow: "hidden" }), [])}
    >
      <View tw="flex-row justify-between items-center">
        <Link
          href={`${
            router.pathname.startsWith("/trending") ? "/trending" : ""
          }/profile/${props.creator.address}`}
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
                @{props.creator.username}
              </Text>
              <View>
                <VerificationBadge size={14} />
              </View>
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
              {isFollowingCreator ? "Unfollow" : "Follow"}
            </Text>
          </Button>
        </View>
      </View>
      <View tw="flex-row justify-center mt-4 mx-[-4px]">
        {props.creator.top_items.slice(0, 3).map((item) => {
          return (
            <View tw="rounded-3xl mx-[4px] overflow-hidden" key={item.nft_id}>
              <Media
                item={item}
                numColumns={3}
                tw={`rounded-2xl w-[${mediaDimension}px] h-[${mediaDimension}px]`}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
});
