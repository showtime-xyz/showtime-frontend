// import React, { Suspense, useCallback, useRef } from "react";
// import { Platform, FlatList } from "react-native";
import { useCallback } from "react";
import { Dimensions, FlatList, Image } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";

// import Image from "react-native-fast-image";
import { NFT } from "app/types";

import { View, Text } from "design-system";
import { Avatar } from "design-system/avatar";
import { useIsDarkMode } from "design-system/hooks";
import {
  Message,
  Heart,
  Share,
  MoreHorizontal,
  ShowtimeGradient,
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
const item = [
  {
    activity_id: 1130120,
    nft_id: 248570060,
    contract_address: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton",
    token_id: "686664",
    like_count: 0,
    token_name: "Cell 17",
    token_description: "Imaginary cells - Contemporary art",
    token_img_url:
      "https://lh3.googleusercontent.com/6vQ661XKzYyKEgG1iJ_xhnnIHbvhTcNdwr7pWdgwSXRXHVLbVpJoJyEsfehVgTUb-okC0JVL962tCMRtqlc_04bpXZ7s1rOrdVMv",
    token_img_original_url:
      "https://ipfs.io/ipfs/QmSibw4YCZ8xS9wMz9Wn6Kbfqh7nRmCA2e6qd5EwNtDsDU",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url: null,
    blurhash:
      "yEJ8#JXT8^t88^j[9EEQxtt6WCada}WBMvxFRjR*flRjt7-pIUWXt8WBt7WA9ERlj^t6xtawoe%LM|WCf5Rjj[R*8^t7t7Rko#WBof",
    token_background_color: null,
    token_aspect_ratio: "0.799",
    token_hidden: 0,
    creator_id: 289170,
    creator_name: "GinkoInTheMoon",
    creator_address: "tz1f4xtDjVtJRq7qJsXCxqL3CweyNNQNFQ4g",
    creator_address_nonens: "tz1f4xtDjVtJRq7qJsXCxqL3CweyNNQNFQ4g",
    creator_img_url:
      "https://storage.googleapis.com/nft-public-profile-pics/289170_1620391427.jpg",
    multiple_owners: 1,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: "2022-03-01T13:01:34",
    token_creator_followers_only: 0,
    creator_username: "GinkoInTheMoon",
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://lh3.googleusercontent.com/BS8OgbNkiA3kgmAPleB3djKMwOyXLMPqJot5SJsuBGdHkR9a9xz0xdv76TOnirJws3e-Fg_imNVQZfGqIshYIkKw9b6aKngUt64B=w1328",
    still_preview_url:
      "https://lh3.googleusercontent.com/BS8OgbNkiA3kgmAPleB3djKMwOyXLMPqJot5SJsuBGdHkR9a9xz0xdv76TOnirJws3e-Fg_imNVQZfGqIshYIkKw9b6aKngUt64B=w1328",
    mime_type: "image/jpeg",
    chain_identifier: "NetXdQprcVkpaWU",
    token_listing_identifier: null,
    collection_slug: "hic-et-nunc",
    collection_name: "Hic Et Nunc",
    collection_img_url:
      "https://storage.googleapis.com/showtime-nft-thumbnails/hic_et_nunc.jpg",
  },
  {
    activity_id: 1130085,
    nft_id: 248553847,
    contract_address: "0x8e4c061b1ed11e809b2ddfb46890aa16d2f3acd0",
    token_id: "4",
    like_count: 0,
    token_name: "ETHERMINE",
    token_description:
      "The beginning of a journey!\n\nDimensions: 4096px x 2160px\nDone in Blender and Adobe Photoshop",
    token_img_url:
      "https://lh3.googleusercontent.com/dNOv-yvty5B5B7u93YxYW8_Cdp2rFM0-1qshyqHZetEal0JKx0Ntv_1oRpVSDVwTC_L9vJpSOj8MgihmPdOXjiSxqOxAofJgmDPQ",
    token_img_original_url:
      "https://ipfs.io/ipfs/QmW3Y2GrTXNfLfAPEfATRuh21k4dDwFKsBf9CHjqv2xWZh/nft.png",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url: null,
    blurhash:
      "yOE{C4~p%2NHogofRj%g.7%MofjFRjs:xuxvx]WXM{V@t7bwbcWBV@oLt7WWxubHM{jYt7a}WCRjWBt7j]WBf5kCoJxat7oeWBfkj]",
    token_background_color: null,
    token_aspect_ratio: "1.89630",
    token_hidden: 0,
    creator_id: 321663,
    creator_name: "Exolorian",
    creator_address: "exolorian.eth",
    creator_address_nonens: "0x29a8fcdbe61302b42b05da77c7db2ef21ff630ca",
    creator_img_url:
      "https://lh3.googleusercontent.com/8xy13OHe74myQBfWzcYQvS1OxUmlJSnmmeVOR2QbSIj59wNPnzCw1Go5KJzRqhoTRS_EyGrB7-XKNBcrd5V2Y5XyJ133MQRdYqJr",
    multiple_owners: 0,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: "2022-03-01T12:34:33",
    token_creator_followers_only: 0,
    creator_username: "exolorian",
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://lh3.googleusercontent.com/dNOv-yvty5B5B7u93YxYW8_Cdp2rFM0-1qshyqHZetEal0JKx0Ntv_1oRpVSDVwTC_L9vJpSOj8MgihmPdOXjiSxqOxAofJgmDPQ",
    still_preview_url:
      "https://lh3.googleusercontent.com/dNOv-yvty5B5B7u93YxYW8_Cdp2rFM0-1qshyqHZetEal0JKx0Ntv_1oRpVSDVwTC_L9vJpSOj8MgihmPdOXjiSxqOxAofJgmDPQ",
    mime_type: "image/png",
    chain_identifier: "1",
    token_listing_identifier: null,
    collection_slug: "exoarts",
    collection_name: "ExoArts",
    collection_img_url: null,
  },
  {
    activity_id: 1130073,
    nft_id: 248553191,
    contract_address: "0x620b70123fb810f6c653da7644b5dd0b6312e4d8",
    token_id: "1381",
    like_count: 0,
    token_name: "Space Doodle #1381",
    token_description:
      "Space Doodles are spaceships for your Doodle. Each Doodle in the original collection of 10,000 can launch their own personal spaceship that is generated from over 200 audio-visual traits and on-chain stats.\n\nYour Space Doodle is your Doodle and selling it will allow the new purchaser to remove the Doodle from our secure smart contract. It is highly recommended that you launch and dock your Doodles directly from https://doodles.app",
    token_img_url:
      "https://lh3.googleusercontent.com/4VGI09W7WPETdPZCd8BGPBCLInUXKN07wyiP_yTdVgvWqffa_Th-EXSGbwwGh9UD7x69ODmDNiEBE_sGR-AorwY9BjBdu7muzTGy",
    token_img_original_url:
      "https://ipfs.io/ipfs/Qme7AeWNYKiqmg26suhZNUnMbUPCAzGxdttRBszFJgquQX",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/video_previews/QmRJ4WjiC3YHxvyXsmfAjjjRHjGakKBK4bo5Hd5EJDfmjm_preview__1646138056.mp4",
    blurhash:
      "yrPY[4n-w6sEX3bbn,BHkRX5jsoIa~a|rKafW-X4ajn~bForV{sjjbW:axjZWabXV}njoaW?ayocoJX7W;aioJj[n,jbjrj[bGjYf8",
    token_background_color: null,
    token_aspect_ratio: "1.00000",
    token_hidden: 0,
    creator_id: 421121,
    creator_name: "Archan Nair",
    creator_address: "archann.eth",
    creator_address_nonens: "0x4ccc0aa065a37a3589e2db6e165d2f8f522e9fa2",
    creator_img_url:
      "https://lh3.googleusercontent.com/hwncTXiITjtd_-SIPq_S6lMyj6qwtcw0MhN3CoDeujOBVlmEaYZ7x9tIfLH2eR45AOJ6N_iZMpfpH76XTsqZOAp2IHbc5HBGOMb3",
    multiple_owners: 0,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: "2022-03-01T12:04:45",
    token_creator_followers_only: 0,
    creator_username: "ArchanNair",
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/originals/QmRJ4WjiC3YHxvyXsmfAjjjRHjGakKBK4bo5Hd5EJDfmjm_1646138049.mp4",
    still_preview_url:
      "https://lh3.googleusercontent.com/4VGI09W7WPETdPZCd8BGPBCLInUXKN07wyiP_yTdVgvWqffa_Th-EXSGbwwGh9UD7x69ODmDNiEBE_sGR-AorwY9BjBdu7muzTGy",
    mime_type: "video/mp4",
    chain_identifier: "1",
    token_listing_identifier: null,
    collection_slug: "space-doodles-official",
    collection_name: "Space Doodles",
    collection_img_url:
      "https://lh3.googleusercontent.com/grtJLoHghmlq1Zh05DEc4S20t6_aESFq-nq07SyAsxDuOoRorjo1EQ9Z2L2Fb-LS7DgZt9Ar4Ra9l2KpBkSvvyu7wnVdhLkHcNFtQ8c=s120",
  },
  {
    activity_id: 1130060,
    nft_id: 241158597,
    contract_address: "0x495f947276749ce646f68ac8c248420045cb7b5e",
    token_id:
      "91175939610829289325929295145181883431167439538202798815044682276669254270977",
    like_count: 0,
    token_name: "Lost Boy",
    token_description: "Lost Boy \n1/1\nCustom Graffiti Wall\n-badfroot",
    token_img_url:
      "https://lh3.googleusercontent.com/4-Vjsid-5lUEaJ2wmwCKpTs0uWO8E5HeHD1U0njJlVJUTXVCpZp0bIHvuLOE7GPDRgbh3a42sBsLNq5E3dFnWN2pg2d-8xbI0mY",
    token_img_original_url:
      "https://lh3.googleusercontent.com/coh4h47souEwJuC3Sao4LSKNur4_06p_yUOawfhLf_e1IDeuBm26QELlAl1BhakMB6spXuUvzUtg2Nn_UaS8IxgQsOBuLwgLP6bS",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url: null,
    blurhash:
      "yME.naoL%gNG-mt6s+_MR*xwWAt7xakB.RW;%Nena$ogkC?bj]xuW.R+t7ofx^t7oJWBRjj[bIxvt7s.afadozWCkEt6adoLRjxuWB",
    token_background_color: null,
    token_aspect_ratio: "0.66402",
    token_hidden: 0,
    creator_id: 758129,
    creator_name: "Badfroot",
    creator_address: "badfroot.eth",
    creator_address_nonens: "0xc993c0c7fdef0ea3df326f62ef51cd5f92954490",
    creator_img_url:
      "https://storage.googleapis.com/opensea-static/opensea-profile/33.png",
    multiple_owners: 1,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: null,
    token_creator_followers_only: 0,
    creator_username: null,
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://lh3.googleusercontent.com/4-Vjsid-5lUEaJ2wmwCKpTs0uWO8E5HeHD1U0njJlVJUTXVCpZp0bIHvuLOE7GPDRgbh3a42sBsLNq5E3dFnWN2pg2d-8xbI0mY",
    still_preview_url:
      "https://lh3.googleusercontent.com/4-Vjsid-5lUEaJ2wmwCKpTs0uWO8E5HeHD1U0njJlVJUTXVCpZp0bIHvuLOE7GPDRgbh3a42sBsLNq5E3dFnWN2pg2d-8xbI0mY",
    mime_type: "image/jpeg",
    chain_identifier: "1",
    token_listing_identifier: null,
    collection_slug: "thegraveyard",
    collection_name: "The Graveyard",
    collection_img_url: null,
  },
  {
    activity_id: 1130027,
    nft_id: 248544481,
    contract_address: "0x6dd60e54f41de823abaed29f5527c93856071cad",
    token_id: "1",
    like_count: 0,
    token_name: "Moonlight Horizon",
    token_description:
      "“Moonlight Horizon — where the earth meets the sky. Dreams grounded in reality, a split between two worlds.”",
    token_img_url:
      "https://lh3.googleusercontent.com/CRo2Qt8VwkjTRNwpdDrCU0khQ_TEM3omj0ceFIGgfD0RwaWS7thmB9xb0e6eu8n8nuJswzX6s14zPLfFoZD8RKne8XpMYXEouyV_",
    token_img_original_url:
      "https://ipfs.io/ipfs/QmTNqMXMnCzvtVWLJd8GEssfn3nkVq7XUjKjCAQiFcHF17/nft.mp4",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/video_previews/QmdnjpPN7vjxTCaeDdawyeZTv5C1E1H8XmigSBHaZ9ecHj_preview__1646137381.mp4",
    blurhash:
      "ylNkGuJ7bdn*f,s:R%?dn%WYbIjYW;jYAZoIofofWAazj[s=ofbEfkaeaybIbdjZf4WVoKaxW=bdWUWUfiWWjZj]t7s:R%WWjZfQj[",
    token_background_color: null,
    token_aspect_ratio: "1.77778",
    token_hidden: 0,
    creator_id: 19059,
    creator_name: "Jessica Ticchio",
    creator_address: "0x080b6202c0a5c464799e1e5a4aa7325eace9a5e1",
    creator_address_nonens: "0x080b6202c0a5c464799e1e5a4aa7325eace9a5e1",
    creator_img_url:
      "https://storage.googleapis.com/opensea-static/opensea-profile/15.png",
    multiple_owners: 0,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: "2022-03-01T11:51:35",
    token_creator_followers_only: 0,
    creator_username: "JessicaTicchio",
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/originals/QmdnjpPN7vjxTCaeDdawyeZTv5C1E1H8XmigSBHaZ9ecHj_1646137389.mp4",
    still_preview_url:
      "https://lh3.googleusercontent.com/CRo2Qt8VwkjTRNwpdDrCU0khQ_TEM3omj0ceFIGgfD0RwaWS7thmB9xb0e6eu8n8nuJswzX6s14zPLfFoZD8RKne8XpMYXEouyV_",
    mime_type: "video/mp4",
    chain_identifier: "1",
    token_listing_identifier: null,
    collection_slug: "dream-visions-v2",
    collection_name: "Dream Visions V2",
    collection_img_url: null,
  },
  {
    activity_id: 1130027,
    nft_id: 248519377,
    contract_address: "0xb395005612ce8633eb82feb9ff8273299ddbd3f8",
    token_id: "3",
    like_count: 0,
    token_name: "Mirage 02",
    token_description:
      "Part 2/3 in The Mirage Collection\n\n“I’ve always been captivated by the concept of mirages; the mind’s ability to create a visual that dances on the line of appearing both completely impossible, yet so convincingly real. Is reality an illusion or is the illusion reality?”",
    token_img_url:
      "https://lh3.googleusercontent.com/CnRGOAdt_Apc_FXMvCd-uhYv87cff7gc0jYGhRa6soJYSPBmD8Tn_bNOWHn0-MXRb0ZnZz4Vicod0684WxknIA6jLV7g4ei1rCE",
    token_img_original_url:
      "https://ipfs.io/ipfs/QmbJASJnL7QGKXugZQL7dbxczNpopRAA3SL5WMrMQAPgDP/nft.mp4",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/video_previews/QmeYfQLrg1iUDxkAxZcfekBVApSfmKeezxkpDokgVEvt9E_preview__1646136252.mp4",
    blurhash:
      "yZIYYXo#NHogs,ogRkTOofofazaya}oe00aeoIaya~fPoe%MWVjYj]bHjZayW9j@kDfPayazf5Roj[ayayj[j]j?s+aye.jsa|aykC",
    token_background_color: null,
    token_aspect_ratio: "0.56250",
    token_hidden: 0,
    creator_id: 19059,
    creator_name: "Jessica Ticchio",
    creator_address: "0x080b6202c0a5c464799e1e5a4aa7325eace9a5e1",
    creator_address_nonens: "0x080b6202c0a5c464799e1e5a4aa7325eace9a5e1",
    creator_img_url:
      "https://storage.googleapis.com/opensea-static/opensea-profile/15.png",
    multiple_owners: 0,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: "2022-03-01T11:16:38",
    token_creator_followers_only: 0,
    creator_username: "JessicaTicchio",
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/originals/QmeYfQLrg1iUDxkAxZcfekBVApSfmKeezxkpDokgVEvt9E_1646136265.mp4",
    still_preview_url:
      "https://lh3.googleusercontent.com/CnRGOAdt_Apc_FXMvCd-uhYv87cff7gc0jYGhRa6soJYSPBmD8Tn_bNOWHn0-MXRb0ZnZz4Vicod0684WxknIA6jLV7g4ei1rCE",
    mime_type: "video/mp4",
    chain_identifier: "1",
    token_listing_identifier: null,
    collection_slug: "the-mirage-collection",
    collection_name: "The Mirage Collection",
    collection_img_url: null,
  },
  {
    activity_id: 1130027,
    nft_id: 248519364,
    contract_address: "0xb395005612ce8633eb82feb9ff8273299ddbd3f8",
    token_id: "1",
    like_count: 0,
    token_name: "Mirage 01",
    token_description:
      "Part 1/3 in The Mirage Collection\n\n“I’ve always been captivated by the concept of mirages; the mind’s ability to create a visual that dances on the line of appearing both completely impossible, yet so convincingly real. Is reality an illusion or is the illusion reality?”",
    token_img_url:
      "https://lh3.googleusercontent.com/U_7N4hLRUjf67qR-ZXRuak7w2cB-5iBCe9pvLYRbain0M_yycRnUlekhQOSK9YZXUldqrBfmFoH2VG4ZZNjWys48h4X-JBcVDBQ8",
    token_img_original_url:
      "https://ipfs.io/ipfs/QmeVjrYENhyotn2jMejS5Bt9ajB4Qh2GeBYmXxcYqawTD4/nft.mp4",
    token_has_video: 0,
    token_animation_url: null,
    animation_preview_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/video_previews/QmWr2rzoXDiupEyRcMfZz2TzJ6ECEh2zGGdLj8UisKUAu5_preview__1646136127.mp4",
    blurhash:
      "yXK_V4a%NGkCRjoLoJPERjt7j[j@aybG9FogRjayofflf8%Maen#jsa#j]ayIpWXt8j@juWCaxsVoeRjj]jYf6kCozWBozWWa#j@fP",
    token_background_color: null,
    token_aspect_ratio: "1.77778",
    token_hidden: 0,
    creator_id: 19059,
    creator_name: "Jessica Ticchio",
    creator_address: "0x080b6202c0a5c464799e1e5a4aa7325eace9a5e1",
    creator_address_nonens: "0x080b6202c0a5c464799e1e5a4aa7325eace9a5e1",
    creator_img_url:
      "https://storage.googleapis.com/opensea-static/opensea-profile/15.png",
    multiple_owners: 0,
    owner_id: null,
    owner_name: null,
    owner_address: null,
    owner_img_url: null,
    token_created: "2022-03-01T10:57:32",
    token_creator_followers_only: 0,
    creator_username: "JessicaTicchio",
    creator_verified: 0,
    owner_username: null,
    owner_verified: null,
    comment_count: 0,
    owner_count: null,
    token_count: null,
    token_ko_edition: null,
    token_edition_identifier: null,
    source_url:
      "https://storage.googleapis.com/showtime-cdn/ipfs/originals/QmWr2rzoXDiupEyRcMfZz2TzJ6ECEh2zGGdLj8UisKUAu5_1646136109.mp4",
    still_preview_url:
      "https://lh3.googleusercontent.com/U_7N4hLRUjf67qR-ZXRuak7w2cB-5iBCe9pvLYRbain0M_yycRnUlekhQOSK9YZXUldqrBfmFoH2VG4ZZNjWys48h4X-JBcVDBQ8",
    mime_type: "video/mp4",
    chain_identifier: "1",
    token_listing_identifier: null,
    collection_slug: "the-mirage-collection",
    collection_name: "The Mirage Collection",
    collection_img_url: null,
  },
] as unknown as NFT;

const { height: screenHeight, width: screenWidth } = Dimensions.get("screen");

const FeedItem = ({ nft }: { nft: NFT }) => {
  const bottomBarHeight = useBottomTabBarHeight();

  return (
    <View
      style={{
        height: screenHeight,
        alignItems: "center",
        width: screenWidth,
        justifyContent: "center",
        paddingBottom: bottomBarHeight,
      }}
    >
      <Image
        source={{ uri: nft.still_preview_url }}
        style={{
          aspectRatio: Number(nft.token_aspect_ratio),
          width: screenWidth,
        }}
        resizeMode="contain"
      />
      <Description nft={nft} />
    </View>
  );
};

const Description = ({ nft }: { nft: NFT }) => {
  const isDark = useIsDarkMode();
  const tint = isDark ? "dark" : "light";
  const bottomBarHeight = useBottomTabBarHeight();
  return (
    <BlurView
      style={tw.style(`p-4 absolute bottom-[${bottomBarHeight}px] h-61 w-full`)}
      tint={tint}
      intensity={60}
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
          <MoreHorizontal height={20} width={20} color={tw.color("gray-900")} />
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
      <View tw="mt-4">
        <Text
          variant="text-2xl"
          tw="text-gray-900"
          numberOfLines={3}
          sx={{ fontSize: 16, lineHeight: 20 }}
        >
          {nft.token_description}
        </Text>
      </View>

      <View tw="mt-auto flex-row justify-between items-center">
        <View tw="flex-row items-center">
          <ShowtimeGradient height={20} width={20} />
          <Text tw="ml-2 font-bold text-xs">Showtime</Text>
        </View>
        <Text tw="text-xs text-gray-900">100 Editions</Text>
      </View>
    </BlurView>
  );
};
export const Feed = () => {
  return (
    <View tw={`bg-black`}>
      <FlatList
        keyExtractor={useCallback((_item, index) => index.toString(), [])}
        getItemLayout={useCallback((_data, index) => {
          return {
            length: screenHeight,
            offset: screenHeight * index,
            index,
          };
        }, [])}
        windowSize={3}
        initialNumToRender={1}
        renderItem={useCallback(
          ({ item }) => (
            <FeedItem nft={item} />
          ),
          []
        )}
        pagingEnabled
        data={item}
      />
    </View>
  );
};
