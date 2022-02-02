import * as Linking from "expo-linking";
import { getPathFromState } from "@react-navigation/native";
import type { LinkingOptions } from "@react-navigation/native";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      login: "/login",
      nft: "/nft/:id",
      create: "/create",
      profile: "/profile/:walletAddress",
      bottomTabs: {
        screens: {
          // Bottom Tab Navigator
          homeTab: "/home",
          trendingTab: "/trending",
          cameraTab: "/camera",
          marketplaceTab: "/marketplace",
          notificationsTab: "/notifications",
        },
      },
    },
  },
  getPathFromState(state, options) {
    const path = getPathFromState(state, options);

    if (path === "/home") {
      return "/";
    }

    return path;
  },
};

export { linking };
