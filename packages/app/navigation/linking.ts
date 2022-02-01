import * as Linking from "expo-linking";
import { getPathFromState } from "@react-navigation/native";
import type { LinkingOptions } from "@react-navigation/native";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      login: "login",
      nft: "nft/:id",
      create: "create",
      profile: "profile/:walletAddress",
      root: {
        screens: {
          // Bottom Tab Navigator
          homeTab: {
            screens: {
              home: "home",
            },
          },
          trendingTab: {
            screens: {
              trending: "trending",
            },
          },
          cameraTab: {
            screens: {
              camera: "camera",
            },
          },
          marketplaceTab: {
            screens: {
              marketplace: "marketplace",
            },
          },
          notificationsTab: {
            screens: {
              notifications: "notifications",
            },
          },
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
