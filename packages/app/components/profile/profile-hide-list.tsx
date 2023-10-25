import { useCallback } from "react";

import { EyeOffV2 } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useProfileHideNFTs } from "app/hooks/api-hooks";
import { getNFTSlug } from "app/hooks/use-share-nft";
import { NFT } from "app/types";

import { Card } from "../card";

export const ProfileNFTHiddenButton = ({
  showHidden,
  onPress,
}: {
  onPress: () => void;
  showHidden: boolean;
}) => {
  return (
    <View tw="my-4 items-center">
      <Pressable
        onPress={onPress}
        tw="flex-row items-center justify-center rounded-full bg-gray-200 px-2 py-1"
      >
        <EyeOffV2 color={colors.gray[600]} width={16} height={16} />
        <Text tw="ml-1 text-sm text-gray-600">
          {showHidden ? "Hidden" : "Show hidden"}
        </Text>
      </Pressable>
    </View>
  );
};
export const ProfileHideList = ({ profileId }: { profileId?: number }) => {
  const router = useRouter();
  const { data } = useProfileHideNFTs(profileId);
  const onItemPress = useCallback(
    (item: NFT) => {
      router.push(
        `${getNFTSlug(item)}?initialScrollItemId=${
          item.nft_id
        }&tabType=hidden&profileId=${profileId}&sortType=newest&type=profile`
      );
    },
    [profileId, router]
  );
  return (
    <View tw="pb-4">
      {data?.items.map((item, index) => {
        return (
          <Card
            nft={item}
            key={item.nft_id}
            numColumns={3}
            as={getNFTSlug(item)}
            href={`${getNFTSlug(item)}?initialScrollItemId=${
              item.nft_id
            }&tabType=hidden&profileId=${profileId}&sortType=newest&type=profile`}
            index={index}
            onPress={() => onItemPress(item)}
          />
        );
      })}
    </View>
  );
};
