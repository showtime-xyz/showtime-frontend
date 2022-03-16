import type { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      login: "login",
      nft: "nft/:chainName/:contractAddress/:tokenId",
      comments: "comments",
      transferNft: "nft/:id/transfer",
      create: "create",
      burn: "burn",
      search: "search",
      list: "nft/:id/list",
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
