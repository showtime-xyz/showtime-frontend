import { Alert, Linking, Platform } from "react-native";

import { ConfigCtrl } from "../controllers/ConfigCtrl";
import type { ListingParams, ListingResponse } from "../types/controllerTypes";
import { CoreUtil } from "./CoreUtil";

// -- Helpers -------------------------------------------------------
const W3M_API = "https://explorer-api.walletconnect.com";

async function fetchListings(
  endpoint: string,
  params: ListingParams
): Promise<ListingResponse> {
  const url = new URL(endpoint, W3M_API);
  url.searchParams.append("projectId", ConfigCtrl.state.projectId);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const request = await fetch(url.toString());

  return request.json() as Promise<ListingResponse>;
}

// -- Utility -------------------------------------------------------
export const ExplorerUtil = {
  async getListings(params: ListingParams) {
    const platform = Platform.select({
      ios: "iOS",
      android: "Android",
      default: "Mobile",
    });

    return fetchListings(`/w3m/v1/get${platform}Listings`, params);
  },

  getWalletImageUrl(imageId: string) {
    return `${W3M_API}/w3m/v1/getWalletImage/${imageId}?projectId=${ConfigCtrl.state.projectId}`;
  },

  getAssetImageUrl(imageId: string) {
    return `${W3M_API}/w3m/v1/getAssetImage/${imageId}?projectId=${ConfigCtrl.state.projectId}`;
  },

  async navigateDeepLink(
    universalLink: string,
    deepLink: string,
    wcURI: string
  ) {
    try {
      const nativeUrl = CoreUtil.formatNativeUrl(deepLink, wcURI);
      const universalUrl = CoreUtil.formatUniversalUrl(universalLink, wcURI);
      if (nativeUrl) {
        await Linking.openURL(nativeUrl).catch(() => {
          // Fallback to universal link
          if (universalUrl) {
            Linking.openURL(universalUrl);
          } else {
            throw new Error("No valid link found for this wallet");
          }
        });
      } else if (universalUrl) {
        await Linking.openURL(universalUrl);
      } else {
        throw new Error("No valid link found for this wallet");
      }
    } catch (error) {
      Alert.alert(`Unable to open the app`);
    }
  },
};
