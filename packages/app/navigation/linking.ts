import * as Linking from "expo-linking";
import { getPathFromState } from "@react-navigation/native";
import type { LinkingOptions } from "@react-navigation/native";

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      // Bottom Tab Navigator
      homeTab: {
        path: "",
        initialRouteName: "home",
        screens: {
          home: "",
          login: "/login",
          nft: "/nft/:id",
          profile: "/profile/:walletAddress",
          transferNft: "/transferNft/:id",
        },
      },
      trendingTab: {
        path: "trending",
        initialRouteName: "trending",
        screens: {
          trending: "",
          login: "/login",
          nft: "/nft/:id",
          profile: "/profile/:walletAddress",
        },
      },
      cameraTab: {
        path: "camera",
        initialRouteName: "camera",
        screens: {
          camera: "",
          login: "/login",
          nft: "/nft/:id",
          create: "/create",
        },
      },
      marketplaceTab: {
        path: "marketplace",
        initialRouteName: "marketplace",
        screens: {
          marketplace: "",
          login: "/login",
          nft: "/nft/:id",
        },
      },
      notificationsTab: {
        path: "notifications",
        initialRouteName: "notifications",
        screens: {
          notifications: "",
          login: "/login",
          nft: "/nft/:id",
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
