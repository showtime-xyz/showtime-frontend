import { Text } from "design-system/text";
import { View } from "design-system/view";
import { Image } from "design-system/image";
import { VerificationBadge } from "design-system/verification-badge";
import { Accordion } from "design-system/accordion";
import { Button } from "design-system/button";
import { ChevronUp } from "design-system/icon";
import { Video } from "expo-av";
import { memo, useContext } from "react";
import { useIsDarkMode } from "../hooks";

type NFT = {
  nft_id: number;
  contract_address: string;
  token_id: string;
  like_count: number;
  token_name: string;
  token_description: string;
  token_img_url: string;
  token_img_original_url: string;
  token_has_video: number;
  token_animation_url?: any;
  animation_preview_url?: any;
  blurhash: string;
  token_background_color?: any;
  token_aspect_ratio: string;
  token_hidden: number;
  creator_id: number;
  creator_name: string;
  creator_address: string;
  creator_address_nonens: string;
  creator_img_url?: any;
  multiple_owners: number;
  owner_id: number;
  owner_name: string;
  owner_address: string;
  owner_img_url?: string;
  token_creator_followers_only: number;
  creator_username?: string;
  creator_verified: number;
  owner_username?: string;
  owner_verified: number;
  comment_count: number;
  owner_count: number;
  token_count: number;
  token_ko_edition?: string;
  token_edition_identifier?: string;
  source_url: string;
  still_preview_url: string;
  mime_type: string;
  chain_identifier: string;
  token_listing_identifier?: string;
  collection_name: string;
  collection_slug: string;
  collection_img_url?: string;
  contract_is_creator: number;
};

type Creator = {
  profile_id: number;
  name?: string;
  username?: string;
  address: string;
  img_url?: string;
  love_count: number;
  verified: number;
  top_items: NFT[];
};

type Props = {
  creator: Creator;
};

export const CreatorPreview = memo((props: Props) => {
  const isDark = useIsDarkMode();
  return (
    <Accordion.Root>
      <Accordion.Item
        value="hello"
        tw="mb-4"
        disabled={props.creator.top_items.length === 0}
      >
        <Accordion.Trigger>
          <View tw="w-full">
            <View tw="flex-row justify-between">
              <View tw="flex-row items-center">
                <View tw="h-8 w-8 bg-gray-200 rounded-full mr-2">
                  <Image
                    source={{ uri: props.creator.img_url }}
                    tw="h-8 w-8 rounded-full"
                  />
                </View>
                <View>
                  <Text tw="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                    {props.creator.name}
                  </Text>
                  <View tw="items-center flex-row">
                    <Text tw="mt-[1px] text-sm text-gray-900 dark:text-white font-semibold mr-1">
                      @{props.creator.username}
                    </Text>
                    <View tw="mt-1">
                      <VerificationBadge size={14} />
                    </View>
                  </View>
                </View>
              </View>
              <View tw="flex-row">
                <Button variant="tertiary" tw="h-8 mr-2">
                  <Text tw="text-gray-900 font-bold text-sm dark:text-white">
                    Follow
                  </Text>
                </Button>
                {props.creator.top_items.length > 0 ? (
                  <Accordion.Chevron>
                    <Button variant="tertiary" tw="rounded-full h-8 w-8">
                      <ChevronUp color={isDark ? "#fff" : "#000"} />
                    </Button>
                  </Accordion.Chevron>
                ) : null}
              </View>
            </View>
          </View>
        </Accordion.Trigger>
        <Accordion.Content>
          <View tw="flex-1 flex-wrap flex-row">
            {props.creator.top_items.map((item) => {
              return (
                <View
                  tw="mr-2 rounded-lg overflow-hidden mb-2"
                  key={item.nft_id}
                >
                  <Media item={item} />
                </View>
              );
            })}
          </View>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
});

const Media = ({ item }: { item: NFT }) => {
  const { value: selectedValue } = useContext(
    Accordion.RNAccordion.RootContext
  );
  const { value: itemValue } = useContext(Accordion.RNAccordion.ItemContext);
  const isExpanded = itemValue === selectedValue;

  if (!isExpanded) {
    return (
      <View
        style={{
          height: 100,
          aspectRatio: parseFloat(item.token_aspect_ratio),
        }}
      />
    );
  }

  if (item.mime_type?.startsWith("video")) {
    return (
      <Video
        source={{
          uri: item.animation_preview_url,
        }}
        style={{
          height: 100,
          aspectRatio: parseFloat(item.token_aspect_ratio),
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        isMuted
      />
    );
  } else if (item.mime_type?.startsWith("image")) {
    return (
      <Image
        source={{
          uri: item.still_preview_url,
        }}
        style={{
          height: 100,
          aspectRatio: parseFloat(item.token_aspect_ratio),
        }}
        resizeMode="cover"
      />
    );
  }

  return null;
};
