// import React, { Suspense, useCallback, useRef } from "react";
// import { Platform, FlatList } from "react-native";
import { Dimensions } from "react-native";

import { BlurView } from "expo-blur";
import Image from "react-native-fast-image";

import { NFT } from "app/types";

import { View, Text } from "design-system";
import { Avatar } from "design-system/avatar";
import { useIsDarkMode } from "design-system/hooks";
import {
  HeartFilled,
  Commented,
  Message,
  Heart,
  Share,
  MoreHorizontal,
} from "design-system/icon";
import { tw } from "design-system/tailwind";

// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
// import { useScrollToTop } from "@react-navigation/native";

// import { useActivity } from "app/hooks/api-hooks";

// import { View, Spinner, Text } from "design-system";
// import { Card } from "design-system/card";

// import { ViewabilityTrackerFlatlist } from "./viewability-tracker-flatlist";

// const Footer = ({ isLoading }: { isLoading: boolean }) => {
//   const tabBarHeight = useBottomTabBarHeight();

//   if (isLoading) {
//     return (
//       <View
//         tw="h-16 items-center justify-center mt-6 px-3"
//         sx={{ marginBottom: tabBarHeight }}
//       >
//         <Spinner size="small" />
//       </View>
//     );
//   }

//   return <View sx={{ marginBottom: tabBarHeight }}></View>;
// };

// const Feed = () => {
//   return (
//     <View tw="bg-white dark:bg-black flex-1" testID="homeFeed">
//       <Suspense
//         fallback={
//           <View tw="pt-8 items-center">
//             <Spinner size="small" />
//           </View>
//         }
//       >
//         <AllActivityList />
//       </Suspense>
//     </View>
//   );
// };

// const AllActivityList = () => {
//   const { isLoading, data, fetchMore, isRefreshing, refresh, isLoadingMore } =
//     useActivity({ typeId: 0 });
//   const listRef = useRef<FlatList>(null);

//   useScrollToTop(listRef);

//   const keyExtractor = useCallback((item) => item.id, []);

//   const renderItem = useCallback(
//     ({ item }) => <Card act={item} variant="activity" />,
//     []
//   );

//   const ListHeaderComponent = useCallback(
//     () => (
//       <View tw="bg-white dark:bg-black pt-4 pl-4 pb-[3px]">
//         <Text
//           variant="text-2xl"
//           tw="text-gray-900 dark:text-white font-extrabold"
//         >
//           Home
//         </Text>
//       </View>
//     ),
//     []
//   );

//   const ListFooterComponent = useCallback(
//     () => <Footer isLoading={isLoadingMore} />,
//     [isLoadingMore]
//   );

//   if (isLoading) {
//     return (
//       <View tw="items-center justify-center flex-1">
//         <Spinner />
//       </View>
//     );
//   }

//   return (
//     <ViewabilityTrackerFlatlist
//       data={data}
//       ref={listRef}
//       keyExtractor={keyExtractor}
//       renderItem={renderItem}
//       refreshing={isRefreshing}
//       onRefresh={refresh}
//       onEndReached={fetchMore}
//       onEndReachedThreshold={0.6}
//       removeClippedSubviews={Platform.OS !== "web"}
//       numColumns={1}
//       windowSize={4}
//       initialNumToRender={2}
//       alwaysBounceVertical={false}
//       ListHeaderComponent={ListHeaderComponent}
//       ListFooterComponent={ListFooterComponent}
//     />
//   );
// };

// export { Feed };
const item = {
  activity_id: 1129551,
  animation_preview_url: null,
  blurhash:
    "yIEdx*%3E29@whxCR$t2R$jLNGs-%2oL0dNExtxISvSwj]Rpaz%2t2R+Ins=oeWEX3Sv$TRRs;xHX5NXbIjaWCWUJ{banUsEW,t6sq",
  chain_identifier: "1",
  collection_img_url: null,
  collection_name: "HODL Cards",
  collection_slug: "hodlcards",
  comment_count: 0,
  contract_address: "0x495f947276749ce646f68ac8c248420045cb7b5e",
  creator_address: "pixelord.eth",
  creator_address_nonens: "0xbdb0dd845e95d2e24b77d9bef54d4df82baf8335",
  creator_id: 454041,
  creator_img_url:
    "https://storage.googleapis.com/nft-public-profile-pics/454041_1618519425.jpg",
  creator_name: "Pixelord",
  creator_username: "pixelord",
  creator_verified: 0,
  like_count: 0,
  mime_type: "image/png",
  multiple_owners: 0,
  nft_id: 229145125,
  owner_address: "0xfd9563722d3f260f21b48faf7ce05701ada479b4",
  owner_count: 1,
  owner_id: 1716555,
  owner_img_url:
    "https://storage.googleapis.com/opensea-static/opensea-profile/15.png",
  owner_name: "schteeb",
  owner_username: "blaze",
  owner_verified: 0,
  source_url:
    "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
  still_preview_url:
    "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
  token_animation_url: null,
  token_aspect_ratio: "1.00000",
  token_background_color: null,
  token_count: 1,
  token_created: null,
  token_creator_followers_only: 0,
  token_description: "HOOOODL",
  token_edition_identifier: null,
  token_has_video: 0,
  token_hidden: 0,
  token_id:
    "85799622320254933162115753726238912946972704429541097231840037159547361558529",
  token_img_original_url:
    "https://lh3.googleusercontent.com/4AB7a5qnHeKXJbO1HujyCuhnTOy1asfaT0Yx3CQA6A8L739H343WysYMlORxxH2Wtc7Esiq97obKTjOlJ7I-hJOU79tgsJYd-12N",
  token_img_url:
    "https://lh3.googleusercontent.com/F3zNlh90SywY3C9d3OSCo25jkzSfyOiS7euqeklsU6025D4Rf4ihGBZ7yuHRDrdUndZHPvAwJad5CEYB5_9Gwvq60lDSFgG3B93U",
  token_ko_edition: null,
  token_listing_identifier: null,
  token_name: "HODL 069",
  contract_is_creator: false,
  multiple_owners_list: [],
} as unknown as NFT;

const { height, width } = Dimensions.get("window");
const headerHeight = 50;
const bottomBarHeight = 100;

const mediaHeight = height - headerHeight - bottomBarHeight;

const FeedItem = ({ nft }: { nft: NFT }) => {
  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";

  return (
    <View>
      <Image
        source={{ uri: nft.source_url }}
        style={{ height: mediaHeight, width }}
        resizeMode="contain"
      />
      <BlurView
        style={tw.style("p-4 absolute bottom-0 h-61 w-full")}
        tint={tint}
        intensity={65}
      >
        <View tw="flex-row justify-between">
          <View tw="flex-row">
            <View tw="flex-row items-center">
              <Heart height={20} width={20} color={tw.color("gray-900")} />
              <Text tw="text-xs text-gray-900 font-bold ml-1">42.4k</Text>
            </View>

            <View tw="flex-row items-center ml-4">
              <Message height={20} width={20} color={tw.color("gray-900")} />
              <Text tw="text-xs text-gray-900 font-bold ml-1">200</Text>
            </View>
          </View>

          <View tw="flex-row">
            <Share height={20} width={20} color={tw.color("gray-900")} />
            <View tw="w-8" />
            <MoreHorizontal
              height={20}
              width={20}
              color={tw.color("gray-900")}
            />
          </View>
        </View>
        <View tw="flex-row mt-4">
          <Avatar url={nft.creator_img_url} size={32} />
          <View tw="justify-around ml-1">
            <Text tw="text-xs font-bold text-gray-900">
              @{nft.owner_username}
            </Text>
            <Text tw="text-gray-900 text-xs">15 minutes ago</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export const Feed = () => {
  return (
    <View style={{ backgroundColor: "black" }}>
      <FeedItem nft={item} />
    </View>
  );
};
