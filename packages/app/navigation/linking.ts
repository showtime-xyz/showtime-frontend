import type { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      login: "login",
      nft: "nft/:chainName/:contractAddress/:tokenId",
      comments: "comments",
      transfer: "nft/:id/transfer",
      list: "nft/:id/list",
      details: "nft/:id/details",
      create: "create",
      burn: "burn",
      search: "search",
      profile: "profile/:walletAddress",
      settings: "settings/:walletAddress",
      swipeList: "swipeList",
      editProfile: "editProfile",
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
