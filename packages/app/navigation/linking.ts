import { handleResponse } from "@coinbase/wallet-mobile-sdk";
import * as Linking from "expo-linking";

import type { LinkingOptions } from "app/lib/react-navigation/native";
import { getStateFromPath } from "app/lib/react-navigation/native";

const url = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN;

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
  prefixes: [
    Linking.createURL("/"),
    `https://${url}/`,
    `https://*.${url}/`,
    // http, including subdomains like www.
    `http://${url}/`,
    `http://*.${url}/`,
  ],
  config: {
    //@ts-ignore
    initialRouteName: "bottomTabs",
    screens: {
      login: "login",
      nft: "nft/:chainName/:contractAddress/:tokenId",
      drop: "drop",
      dropMusic: "drop/music",
      dropFree: "drop/free",
      dropEvent: "drop/event",
      dropPrivate: "drop/private",
      qrCodeShare: "/qr-code-share/:contractAddress",
      claim: "claim/:contractAddress",
      collectors: "collectors/:chainName/:contractAddress/:tokenId",
      claimLimitExplanation: "claim/claim-limit-explanation",
      likers: "likers/:nftId",
      comments: "nft/:chainName/:contractAddress/:tokenId/comments",
      activity: "nft/:chainName/:contractAddress/:tokenId/activity",
      details: "nft/:chainName/:contractAddress/:tokenId/details",
      search: "search",
      profile: "profile/:username",
      report: "report",
      editProfile: "profile/edit",
      completeProfile: "profile/complete",
      followers: "profile/followers",
      following: "profile/following",
      settings: "settings",
      spotifyAuth: "spotifyAuth",
      addEmail: "settings/add-email",
      verifyPhoneNumber: "settings/verify-phone-number",
      privacySecuritySettings: "settings/privacy-and-security",
      notificationSettings: "settings/notifications",
      blockedList: "settings/blocked-list",
      swipeList: "list",
      bottomTabs: {
        initialRouteName: "homeTab",
        screens: {
          // Bottom Tab Navigator
          homeTab: "",
          trendingTab: "trending",
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
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    const initialURL = url ? new URL(url) : null;
    if (initialURL && handleResponse(initialURL)) {
      // URL handled by Wallet Mobile SDK
      return null;
    } else {
      if (url) {
        let urlObj = new URL(url);
        urlObj.pathname = withRewrites(urlObj.pathname);
        return urlObj.href;
      }

      return url;
    }
  },
  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      const handledByMobileSDK = handleResponse(new URL(url));
      if (!handledByMobileSDK) {
        if (url) {
          let urlObj = new URL(url);
          urlObj.pathname = withRewrites(urlObj.pathname);
          listener(urlObj.href);
        } else {
          listener(url);
        }
      }
    });

    return function cleanup() {
      linkingSubscription.remove();
    };
  },
};

export { linking };
