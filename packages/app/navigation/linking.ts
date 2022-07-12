import * as Linking from "expo-linking";

import type { LinkingOptions } from "app/lib/react-navigation/native";
import { getStateFromPath } from "app/lib/react-navigation/native";

const withRewrites = (unparsedPath: string): string => {
  if (unparsedPath.startsWith("/@")) {
    const username = unparsedPath.replace("/@", "").split("?")[0].split("/")[0];
    const rest = unparsedPath.replace(`/@${username}`, "");

    return `/profile/${username}${rest}`;
  }

  if (unparsedPath.startsWith("/t/")) {
    return unparsedPath.replace("/t/", "/nft/");
  }

  if (unparsedPath.startsWith("/token/")) {
    return unparsedPath.replace("/token/", "/nft/");
  }

  return unparsedPath;
};

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      login: "login",
      nft: "nft/:chainName/:contractAddress/:tokenId",
      drop: "drop",
      claim: "claim/:contractAddress",
      comments: "nft/:chainName/:contractAddress/:tokenId/comments",
      activity: "nft/:chainName/:contractAddress/:tokenId/activity",
      transfer: "nft/:chainName/:contractAddress/:tokenId/transfer",
      list: "nft/:chainName/:contractAddress/:tokenId/list",
      buy: "nft/:chainName/:contractAddress/:tokenId/buy",
      unlist: "nft/:chainName/:contractAddress/:tokenId/unlist",
      details: "nft/:chainName/:contractAddress/:tokenId/details",
      delete: "nft/:chainName/:contractAddress/:tokenId/delete",
      create: "create",
      search: "search",
      profile: "profile/:username",
      editProfile: "profile/edit",
      followers: "profile/followers",
      following: "profile/following",
      settings: "settings",
      addEmail: "settings/add-email",
      privacySecuritySettings: "settings/privacy-and-security",
      notificationSettings: "settings/notifications",
      blockedList: "settings/blocked-list",
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
