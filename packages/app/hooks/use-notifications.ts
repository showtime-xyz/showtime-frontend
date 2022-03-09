import { useCallback, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { useUser } from "app/hooks/use-user";

export interface Actor {
  img_url: string;
  name: string;
  profile_id: number;
  username: string;
  wallet_address: string;
}

export interface NotificationType {
  actors: Actor[];
  chain_identifier?: any;
  description?: string;
  id: number;
  img_url: string;
  link_to_profile__address: string;
  link_to_profile__username: string;
  nft__contract__address?: string;
  nft__nftdisplay__name?: string;
  nft__token_identifier?: any;
  to_timestamp: string;
  type_id: number;
}

export const useNotifications = () => {
  const { isAuthenticated } = useUser();

  const notificationsFetcher = useCallback(
    (index) => {
      const url = isAuthenticated
        ? process.env.NEXT_PUBLIC_NOTIFICATIONS_URL +
          `/v1/notifications?page=${index + 1}&limit=15`
        : null;
      return url;
    },
    [isAuthenticated]
  );
  const queryState =
    useInfiniteListQuerySWR<NotificationType>(notificationsFetcher);

  const newData = useMemo(() => {
    let newData: NotificationType[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return { ...queryState, data: newData };
};

// const dummyData = [
//   {
//     actors: [
//       {
//         img_url:
//           "https://storage.googleapis.com/showtime-cdn/profile_placeholder2.jpg",
//         name: "0x07...3fd9",
//         profile_id: 10526313,
//         username: null,
//         wallet_address: "0x0748b70008459955f6af009eb5ec13a2e75f3fd9",
//       },
//     ],
//     chain_identifier: null,
//     description: null,
//     id: 1083328,
//     img_url:
//       "https://storage.googleapis.com/showtime-cdn/profile_placeholder2.jpg",
//     link_to_profile__address: "0x0748b70008459955f6af009eb5ec13a2e75f3fd9",
//     link_to_profile__username: null,
//     nft__contract__address: null,
//     nft__nftdisplay__name: null,
//     nft__token_identifier: null,
//     to_timestamp: "2022-01-14T06:07:24Z",
//     type_id: 1,
//   },
//   {
//     actors: [
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/dpRvfS6oUjmFcP25-J-mToz_DzDLQ_D_IX1sYyc7W4pPjs_AINqryVu8tvM9QBLImW7yHIapl6TwNK9BO8aLeYbF_fyrKwbUK0cA",
//         name: "TF Warden",
//         profile_id: 8167514,
//         username: "tfwarden",
//         wallet_address: "tfwarden.eth",
//       },
//     ],
//     chain_identifier: null,
//     description: null,
//     id: 1081547,
//     img_url:
//       "https://lh3.googleusercontent.com/dpRvfS6oUjmFcP25-J-mToz_DzDLQ_D_IX1sYyc7W4pPjs_AINqryVu8tvM9QBLImW7yHIapl6TwNK9BO8aLeYbF_fyrKwbUK0cA",
//     link_to_profile__address: "0x2cd37419fec45395fe6b06781b93ac3b93bb3208",
//     link_to_profile__username: "tfwarden",
//     nft__contract__address: null,
//     nft__nftdisplay__name: null,
//     nft__token_identifier: null,
//     to_timestamp: "2022-01-12T10:15:00Z",
//     type_id: 1,
//   },
//   {
//     actors: [
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/MhzXppfbNkgy5D2T_bdCXwOZpncfdwm7PAjLDPOY5uXHphxojt1EfXdje62gwH8vI44KxRc5DNck5zufWLoB0nMivP_QxaEf1tM",
//         name: "Shima vosughian",
//         profile_id: 2135170,
//         username: "SVosughian",
//         wallet_address: "svosughian.tez",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/w-HgarKhZRHfj0seXHG_xzVhS7Xk8YasVOwAtPWQx49MPAfOidC_OJ9zOMxvZW2HldVX5fWmOJa41u0uGdjPffFO4Mk-doUx7nlF",
//         name: "InnerTropics By SPORO",
//         profile_id: 10135556,
//         username: "sporoart",
//         wallet_address: "0x103EAd30B45e4cB8b6d7CF71e8dCD1c169746AeD",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/kL_a7yedV8O2kQKXXXN5EGu29JpHWn9m3-i4KD41rAn6aVWNXpTIttrO6vYqzzB0zguEhqmOt58cDBqYow68qy1D03pUK8yQHrrk",
//         name: "Xeniia",
//         profile_id: 10230476,
//         username: "xeniia",
//         wallet_address: "0x56E6B5dE6a4E680E49bF1DE3e14B2D49E51103FF",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/dWfE4alHKR36JgiogLQGECRi_xoRFQnfU7HHDvFU2pxdaogRc3H90FtqwD9U1TVJSQY6ZDhEEBNYza7kaCv0GW3PuMI2kbqu-1mP",
//         name: "nftbuilding",
//         profile_id: 6251309,
//         username: "nftbuilding",
//         wallet_address: "0x3017c7902f08af3ff71d94670c8a45cabe3e30a7",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/zMRcheV7nU44ZNZsj6Ll4qwpjbLRHmmaUHehgAKG3SIZSsB-veOMqM2BlbJVUPkLuQfhBjNVnUBfD8z9L_vhBV0m2naZZ-rNbpE",
//         name: "Divinitus",
//         profile_id: 10316174,
//         username: "divinitus",
//         wallet_address: "0x1566F27Af50b6f3BDEA3C006a557f8FC985D73e7",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/_A9kOZdn_aquEDXwC-CQqKrVJNFBiu7NuAz2HpBF852apeYdRmEGGjk453whIHIJGBWy1bkRjCaLoD-628caBFYphSLdHMuI04eZ9A",
//         name: "xojymmikx",
//         profile_id: 10245014,
//         username: "xojymmikx",
//         wallet_address: "0xaa8c0A44FbAA775b057A3c54B798Bc1432e8812D",
//       },
//     ],
//     chain_identifier: null,
//     description: null,
//     id: 1081304,
//     img_url:
//       "https://lh3.googleusercontent.com/MhzXppfbNkgy5D2T_bdCXwOZpncfdwm7PAjLDPOY5uXHphxojt1EfXdje62gwH8vI44KxRc5DNck5zufWLoB0nMivP_QxaEf1tM",
//     link_to_profile__address: null,
//     link_to_profile__username: null,
//     nft__contract__address: null,
//     nft__nftdisplay__name: null,
//     nft__token_identifier: null,
//     to_timestamp: "2022-01-11T23:06:45Z",
//     type_id: 1,
//   },
//   {
//     actors: [
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/dnPFhgMMbt5_UmBIK2-yl1py9EwHUVNdZR4Fyp1_bxWHmd1lftNnwfvDV0TGf02Ipupwlug4yaKqgAnkxjkhaDIsfVlJ2QMl19HI",
//         name: "karmacoma",
//         profile_id: 2057290,
//         username: "karmacoma",
//         wallet_address: "karmacoma.eth",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/v7fmG3Vssc2ecV-wOk-133AU-6_04Hpf6w2vKLfH-HI52r_5PsuQ44MCZhGGhS1zOe8YO-4vvmVjyzv2pO75g6T136KJOWXKi7hh2w",
//         name: "ritz",
//         profile_id: 7892675,
//         username: "ritz",
//         wallet_address: "henryfontanier.eth",
//       },
//     ],
//     chain_identifier: "1",
//     description: null,
//     id: 1080189,
//     img_url:
//       "https://lh3.googleusercontent.com/dnPFhgMMbt5_UmBIK2-yl1py9EwHUVNdZR4Fyp1_bxWHmd1lftNnwfvDV0TGf02Ipupwlug4yaKqgAnkxjkhaDIsfVlJ2QMl19HI",
//     link_to_profile__address: null,
//     link_to_profile__username: null,
//     nft__contract__address: "0x25ed58c027921e14d86380ea2646e3a1b5c55a8b",
//     nft__nftdisplay__name: "Dev #4843",
//     nft__token_identifier: "4843",
//     to_timestamp: "2022-01-10T17:36:39Z",
//     type_id: 2,
//   },
//   {
//     actors: [
//       {
//         img_url:
//           "https://storage.googleapis.com/nft-public-profile-pics/209415_1616680019.jpg",
//         name: "Enuvesta",
//         profile_id: 209415,
//         username: "Enuvesta",
//         wallet_address: "0xe521af87fec6a5757722e445581f0702635de275",
//       },
//       {
//         img_url:
//           "https://storage.googleapis.com/nft-public-profile-pics/777939_1618737678.jpg",
//         name: "Igor Antic",
//         profile_id: 777939,
//         username: "bronto",
//         wallet_address: "0x26c601a43b118ae5c069d89a2a599fe38be4ec2a",
//       },
//       {
//         img_url:
//           "https://storage.googleapis.com/nft-public-profile-pics/690621_1618505650.jpg",
//         name: "hvnarq",
//         profile_id: 690621,
//         username: "hvnarq",
//         wallet_address: "0x9f1229845bf81ea34eed863f8614f63b0c58795a",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/6DzvKVxExlD32UsIXrnYpwvcXsLZaZDxF0dNuvakw2HqNdDjfft1FtZpiS2lVgTlDIxJwghjSGfe7u4LoI4XZMwlKozbE3IEFSq7eA",
//         name: "WHITE WALKER CREATING",
//         profile_id: 10065809,
//         username: "WHITEWALKER",
//         wallet_address: "0x2B96819882a3ccfc74069D0fc4F2980279914147",
//       },
//       {
//         img_url:
//           "https://storage.googleapis.com/nft-public-profile-pics/412000_1617179273.jpg",
//         name: "Excess Pixels",
//         profile_id: 412000,
//         username: "excesspixels",
//         wallet_address: "0x088f4713f1f6169e4191f921a294f8254e22d0c1",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/kL_a7yedV8O2kQKXXXN5EGu29JpHWn9m3-i4KD41rAn6aVWNXpTIttrO6vYqzzB0zguEhqmOt58cDBqYow68qy1D03pUK8yQHrrk",
//         name: "Xeniia",
//         profile_id: 10230476,
//         username: "xeniia",
//         wallet_address: "0x56E6B5dE6a4E680E49bF1DE3e14B2D49E51103FF",
//       },
//     ],
//     chain_identifier: "137",
//     description: null,
//     id: 1079918,
//     img_url:
//       "https://storage.googleapis.com/nft-public-profile-pics/209415_1616680019.jpg",
//     link_to_profile__address: null,
//     link_to_profile__username: null,
//     nft__contract__address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
//     nft__nftdisplay__name: "Chiseled Color",
//     nft__token_identifier: "6286",
//     to_timestamp: "2022-01-10T11:02:06Z",
//     type_id: 3,
//   },
//   {
//     actors: [
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/mvLcXa0KkhpoCy7Fz5z7Z5vku1P-bAdVwd62mVgJa4-LCy-Tz7U0BnD8cCH9ba-HBe9Zt77wArLolXyu5rBWwDM8gSoA8Afm8SjhXA",
//         name: "Nikita",
//         profile_id: 432531,
//         username: "crows_palace",
//         wallet_address: "0x31a8d6aa4d0bc83cda13218581c4cf17180f4da6",
//       },
//     ],
//     chain_identifier: "137",
//     description: null,
//     id: 1075031,
//     img_url:
//       "https://lh3.googleusercontent.com/mvLcXa0KkhpoCy7Fz5z7Z5vku1P-bAdVwd62mVgJa4-LCy-Tz7U0BnD8cCH9ba-HBe9Zt77wArLolXyu5rBWwDM8gSoA8Afm8SjhXA",
//     link_to_profile__address: null,
//     link_to_profile__username: null,
//     nft__contract__address: "0x3cd266509d127d0eac42f4474f57d0526804b44e",
//     nft__nftdisplay__name: "Buildspace: Intro to Web3 | Cohort Intan | #347",
//     nft__token_identifier: "4646",
//     to_timestamp: "2022-01-06T01:27:37Z",
//     type_id: 2,
//   },
//   {
//     actors: [
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/mvLcXa0KkhpoCy7Fz5z7Z5vku1P-bAdVwd62mVgJa4-LCy-Tz7U0BnD8cCH9ba-HBe9Zt77wArLolXyu5rBWwDM8gSoA8Afm8SjhXA",
//         name: "Nikita",
//         profile_id: 432531,
//         username: "crows_palace",
//         wallet_address: "0x31a8d6aa4d0bc83cda13218581c4cf17180f4da6",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/eNzuSnWSdF_J8gpNjfkqXduC2AbQ72tlnwooqYYqWqFRBdoZFS09iWruRvm4K_8AK7b4voSbK7gIacO4GtrUxmyX2v96d5APhH6kGg",
//         name: "DrVizPanda",
//         profile_id: 422564,
//         username: "DrVizPanda",
//         wallet_address: "0xbdfbce56015eabf1bc196a6ef185fb12048c684a",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/i1l9Hyc6CXNSQvADAmi_CGieYrNtIN_ek0hNsJNxPHTDERITw5zId8vQFz6IhYrZPdN8jPHgRduPXAZw0AdBEnTK9FufIma_OaU",
//         name: "The Connectome",
//         profile_id: 366914,
//         username: "The_Connectome",
//         wallet_address: "theconnectome.eth",
//       },
//       {
//         img_url:
//           "https://lh3.googleusercontent.com/6A4dGAIEtkJkLr_Sys90lb0aAfVOIOgZmQt6L8i_Au1Ia59Ec9oxiXebYJ6Wx6YSryDcoT83xhmZ-dm-II0DvTBTLz5zfEzFqTqd",
//         name: "ShowPunk",
//         profile_id: 10162281,
//         username: "_0",
//         wallet_address: "0x421A47Ccd178F0C8A6188972b75F58cD0a0d5fc3",
//       },
//     ],
//     chain_identifier: "137",
//     description: null,
//     id: 1075032,
//     img_url:
//       "https://lh3.googleusercontent.com/mvLcXa0KkhpoCy7Fz5z7Z5vku1P-bAdVwd62mVgJa4-LCy-Tz7U0BnD8cCH9ba-HBe9Zt77wArLolXyu5rBWwDM8gSoA8Afm8SjhXA",
//     link_to_profile__address: null,
//     link_to_profile__username: null,
//     nft__contract__address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
//     nft__nftdisplay__name: "Chiseled Color",
//     nft__token_identifier: "6286",
//     to_timestamp: "2022-01-06T01:27:32Z",
//     type_id: 3,
//   },
// ];
