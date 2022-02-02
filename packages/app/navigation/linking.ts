import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      login: "login",
      nft: "nft/:id",
      create: "create",
      profile: "profile/:walletAddress",
      settings: "settings/:walletAddress",
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
