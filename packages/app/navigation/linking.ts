import * as Linking from "expo-linking";

import type { LinkingOptions } from "app/lib/react-navigation/native";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      login: "login",
      nft: "nft/:chainName/:contractAddress/:tokenId",
      comments: "nft/:id/comments",
      transfer: "nft/:id/transfer",
      list: "nft/:id/list",
      unlist: "nft/:id/unlist",
      details: "nft/:id/details",
      delete: "nft/:id/delete",
      create: "create",
      search: "search",
      profile: "profile/:walletAddress",
      settings: "profile/:walletAddress/settings",
      editProfile: "profile/:walletAddress/edit",
      swipeList: "swipeList",
      bottomTabs: {
        screens: {
          // Bottom Tab Navigator
          homeTab: "",
          trendingTab: "trending",
          cameraTab: "camera",
          marketplaceTab: "marketplace",
          notificationsTab: "notifications",
        },
      },
    },
  },
};

export { linking };
