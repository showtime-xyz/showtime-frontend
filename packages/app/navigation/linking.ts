import * as Linking from "expo-linking";

import { getStateFromPath } from "app/lib/react-navigation/native";
import type { LinkingOptions } from "app/lib/react-navigation/native";

const withRewrites = (unparsedPath: string): string => {
  if (unparsedPath.startsWith("/@")) {
    const username = unparsedPath.replace("/@", "");

    return `/profile/${username}`;
  }

  return unparsedPath;
};

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      login: "login",
      // TODO: change this to use `nft/:id`
      nft: "nft/:chainName/:contractAddress/:tokenId",
      comments: "nft/:id/comments",
      transfer: "nft/:id/transfer",
      list: "nft/:id/list",
      unlist: "nft/:id/unlist",
      details: "nft/:id/details",
      delete: "nft/:id/delete",
      token: "token/:chainName/:contractAddress/:tokenId",
      create: "create",
      search: "search",
      profile: "profile/:username",
      editProfile: "profile/edit",
      settings: "settings",
      swipeList: "list",
      bottomTabs: {
        screens: {
          // Bottom Tab Navigator
          homeTab: "",
          trendingTab: "trending",
          cameraTab: "camera",
          marketplaceTab: "marketplace",
          notificationsTab: "notifications",
          profileTab: "profile",
        },
      },
    },
  },
  getStateFromPath(path, config) {
    const finalPath = withRewrites(path);

    return getStateFromPath(finalPath, config);
  },
};

export { linking };
