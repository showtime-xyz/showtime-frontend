import React from "react";
import { Platform } from "react-native";

import axios, { AxiosError } from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";

import { ResizeMode as ImageResizeMode } from "@showtime-xyz/universal.image";

import { axios as showtimeAPIAxios } from "app/lib/axios";
import { CHAIN_IDENTIFIERS, CONTRACTS } from "app/lib/constants";
import { SORT_FIELDS } from "app/lib/constants";
import { removeMd } from "app/lib/remove-markdown";

import { ProfileTabsAPI } from "./hooks/api-hooks";
import { BunnyVideoUrls, NFT, Profile } from "./types";

export const formatAddressShort = (address?: string | null) => {
  if (!address) return null;

  // Skip over ENS names
  if (address.includes(".")) return address;

  return `${address.slice(0, 4)}…${address.slice(
    address.length - 4,
    address.length
  )}`;
};

export const getProfileName = (profile?: Profile) => {
  if (!profile) {
    return null;
  }

  if (profile.name) {
    return profile.name;
  }

  if (profile.username) {
    return profile.username;
  }

  if (
    profile.wallet_addresses_excluding_email_v2 &&
    profile.wallet_addresses_excluding_email_v2.length > 0
  ) {
    if (profile.wallet_addresses_excluding_email_v2[0].ens_domain) {
      return profile.wallet_addresses_excluding_email_v2[0].ens_domain;
    } else {
      return formatAddressShort(
        profile.wallet_addresses_excluding_email_v2[0].address
      );
    }
  }

  return "Unnamed";
};

export const DEFAULT_PROFILE_PIC =
  "https://cdn.tryshowtime.com/profile_placeholder2.jpg";

export const getProfileImage = (profile?: Profile) => {
  if (!profile?.img_url) {
    return DEFAULT_PROFILE_PIC;
  }
  return profile?.img_url;
};

export const getSortFields = () => {
  return [
    ...Object.keys(SORT_FIELDS).map(
      (key: string) => SORT_FIELDS[key as keyof typeof SORT_FIELDS]
    ),
  ];
};

export const NFT_DETAIL_API = "/v2/nft_detail";

export const removeTags = (text: string) => {
  return removeMd(text.replace(/<(?:.|\n)*?>/gm, ""));
};

type ReactChildArray = ReturnType<typeof React.Children.toArray>;

export function flattenChildren(children: React.ReactNode): ReactChildArray {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.reduce((flatChildren: ReactChildArray, child) => {
    if ((child as React.ReactElement<any>).type === React.Fragment) {
      return flatChildren.concat(
        flattenChildren((child as React.ReactElement<any>).props.children)
      );
    }
    flatChildren.push(child);
    return flatChildren;
  }, []);
}

// Format big numbers
export function formatNumber(number: number) {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1)}m`;
  } else if (number > 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    return number;
  }
}
export function formatToUSNumber(number: number) {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}m`;
  } else if (number >= 10000) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    const str = number.toString();
    const reg =
      str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
  }
}

/* Note by HIRBOD: keep it
function getVideoUrlByClosestWidth(
  videoData: BunnyVideoUrls,
  targetWidth: number = 1280
) {
  const qualities = [
    { key: "mp4_720", width: 1280 },
    { key: "mp4_480", width: 854 },
    { key: "mp4_360", width: 640 },
    { key: "mp4_240", width: 426 },
    { key: "original", width: Infinity },
  ];

  // Sort the qualities based on the difference between the target width and the quality width.
  qualities.sort((a, b) => {
    return Math.abs(a.width - targetWidth) - Math.abs(b.width - targetWidth);
  });

  for (let i = 0; i < qualities.length; i++) {
    const quality = qualities[i].key;

    if (videoData[quality]) {
      return videoData[quality];
    }
  }

  return videoData.original;
}
*/

function getVideoUrl(
  videoData: BunnyVideoUrls,
  preferredQualities: string[] = []
) {
  const defaultQualities = [
    "mp4_720",
    "mp4_480",
    "mp4_360",
    "mp4_240",
    "original",
  ];
  const qualities = preferredQualities.concat(
    defaultQualities.filter((quality) => !preferredQualities.includes(quality))
  );

  for (let i = 0; i < qualities.length; i++) {
    const quality = qualities[i];

    if (videoData[quality]) {
      return videoData[quality];
    }
  }

  return videoData.original;
}

const getCdnImageBase = (chainName?: string) => {
  return chainName === "polygon"
    ? "https://showtime.b-cdn.net/cdnv2" // prod
    : "https://showtime-test.b-cdn.net/cdnv2"; // dev
};

const buildCdnUrl = (nft: NFT, stillPreview?: boolean) => {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/media/nft/${
    nft.chain_name
  }/${nft.contract_address}/${nft.token_id}${
    stillPreview ? "?still_preview=true&cache_key=1" : "?cache_key=1"
  }`;
};

const getVideoOrGifUrl = (
  nft: NFT,
  animated?: boolean,
  optimized?: boolean
) => {
  // we have two sets of thumbnails, one from the first frame, and one from the middle (optimize)
  const bunnyThumbUrl = optimized
    ? nft?.video_urls?.optimized_thumbnail
    : nft?.video_urls?.thumbnail;

  return animated
    ? nft?.video_urls?.preview_animation ??
        bunnyThumbUrl ??
        nft?.cloudinary_thumbnail_url
    : bunnyThumbUrl ?? nft?.cloudinary_thumbnail_url;
};

const getAvailableVideoUrl = (nft: NFT, stillPreview: boolean) => {
  if (!stillPreview) {
    return nft?.video_urls
      ? getVideoUrl(nft?.video_urls) ??
          nft?.cloudinary_video_url ??
          buildCdnUrl(nft, stillPreview)
      : nft?.cloudinary_video_url ?? buildCdnUrl(nft, stillPreview);
  }
  return "";
};

const getImageUrl = (nft: NFT, cdnImageBase: string) => {
  return (
    nft.image_url ??
    `${cdnImageBase}/${nft.chain_name}/${nft.contract_address}/${nft.token_id}`
  );
};

export const getMediaUrl = ({
  nft,
  stillPreview,
  animated,
  optimized,
}: {
  nft?: NFT;
  stillPreview: boolean;
  animated?: boolean;
  optimized?: boolean;
}) => {
  if (!nft || (!nft.chain_name && !nft.contract_address && !nft.token_id)) {
    console.warn("NFT is missing fields to get media URL");
    return "";
  }

  const cdnImageBase = getCdnImageBase(nft.chain_name);
  let cdnUrl = buildCdnUrl(nft, stillPreview);

  if (
    stillPreview &&
    (nft?.mime_type?.startsWith("video") || nft?.mime_type === "image/gif")
  ) {
    const url = getVideoOrGifUrl(nft, animated, optimized);
    cdnUrl = url ?? cdnUrl;
    cdnUrl = cdnUrl.replace(
      "https://storage.googleapis.com/showtime-cdn/cdnv2",
      cdnImageBase
    );
    cdnUrl = cdnUrl.replace("/upload/f_webp", "/upload/f_webp,w_300,q_60");
  }

  cdnUrl = getAvailableVideoUrl(nft, stillPreview) || cdnUrl;

  if (nft?.mime_type?.startsWith("image") && nft?.mime_type !== "image/gif") {
    cdnUrl = getImageUrl(nft, cdnImageBase);
  }

  return cdnUrl;
};

export const getPolygonScanLink = (transactionHash: string) => {
  return `https://${
    process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
  }polygonscan.com/tx/${transactionHash}`;
};

export const getContractName = (item: NFT) => {
  switch (item.contract_address) {
    case CONTRACTS.ZORA:
      return "Zora";
    case CONTRACTS.RARIBLE_V2:
    case CONTRACTS.RARIBLE_1155:
      return "Rarible";
    case CONTRACTS.KNOWNORIGIN:
      if (item.token_ko_edition) return "KnownOrigin";
      else return "OpenSea";
    case CONTRACTS.KNOWNORIGIN_V2:
      return "KnownOrigin";
    case CONTRACTS.FOUNDATION:
      return "Foundation";
    case CONTRACTS.SUPERRARE_V1:
    case CONTRACTS.SUPERRARE_V2:
      return "SuperRare";
    case CONTRACTS.ASYNCART_V1:
    case CONTRACTS.ASYNCART_V2:
      return "Async Art";
    case CONTRACTS.PORTIONIO:
    case CONTRACTS.PORTIONIO_1155:
      if (item.token_img_original_url) return "Portion.io";
      else return "OpenSea";
    case CONTRACTS.CRYPTOARTAI:
      if (item.token_edition_identifier) return "CryptoArt.Ai";
      else return "OpenSea";
    case CONTRACTS.MINTABLE:
      if (item.token_listing_identifier) return "Mintable";
      else return "OpenSea";
    case CONTRACTS.EPHIMERA:
      return "Ephimera";
    case CONTRACTS.KALAMINT:
      return "Kalamint";
    case CONTRACTS.HICETNUNC:
      return "Hic Et Nunc";
    default:
      return "OpenSea";
  }
};

export const getBidLink = (item: NFT) => {
  switch (item.contract_address) {
    case CONTRACTS.ZORA:
      return `https://zora.co/${item.creator_address_nonens}/${item.token_id}`;
    case CONTRACTS.RARIBLE_V2:
    case CONTRACTS.RARIBLE_1155:
      return `https://rarible.com/token/${item.contract_address}:${item.token_id}`;
    case CONTRACTS.KNOWNORIGIN:
      if (item.token_ko_edition) {
        return `https://knownorigin.io/gallery/${item.token_ko_edition}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.KNOWNORIGIN_V2:
      return `https://knownorigin.io/gallery/${item.token_id.slice(0, -3)}000`;
    case CONTRACTS.PORTIONIO:
    case CONTRACTS.PORTIONIO_1155:
      if (item.token_img_original_url) {
        return `https://app.portion.io/#exchange?ID=${item.token_img_original_url.replace(
          "https://ipfs.io/ipfs/",
          ""
        )}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.FOUNDATION:
      return `https://foundation.app/creator/nft-${item.token_id}`;
    case CONTRACTS.SUPERRARE_V1:
      return `https://superrare.co/artwork/${item.token_id}`;
    case CONTRACTS.SUPERRARE_V2:
      return `https://superrare.co/artwork-v2/${item.token_id}`;
    case CONTRACTS.ASYNCART_V1:
      return `https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-${item.token_id}`;
    case CONTRACTS.ASYNCART_V2:
      return `https://async.art/art/master/0xb6dae651468e9593e4581705a09c10a76ac1e0c8-${item.token_id}`;
    case CONTRACTS.CRYPTOARTAI:
      if (item.token_edition_identifier) {
        return `https://cryptoart.ai/gallery/detail?id=${item.token_edition_identifier}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.MINTABLE:
      if (item.token_listing_identifier) {
        return `https://mintable.app/t/item/t/${item.token_listing_identifier}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.EPHIMERA:
      return `https://ephimera.com/tokens/${item.token_id}`;
    case CONTRACTS.KALAMINT:
      if (item.token_edition_identifier) {
        return `https://kalamint.io/collection/${item.token_edition_identifier}`;
      } else {
        return `https://kalamint.io/token/${item.token_id}`;
      }

    case CONTRACTS.HICETNUNC:
      return `https://www.hicetnunc.art/objkt/${item.token_id}`;
    default:
      return `https://opensea.io/assets/${
        item.chain_identifier == "137" ? "matic/" : ""
      }${item.contract_address}/${
        item.token_id
      }?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
  }
};

export const DROPDOWN_LIGHT_SHADOW =
  "0px 12px 16px rgba(0, 0, 0, 0.1), 0px 16px 48px rgba(0, 0, 0, 0.1)";
export const DROPDOWN_DRAK_SHADOW =
  "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 16px 48px rgba(255, 255, 255, 0.2)";

export const getDropdownShadow = (isDark = false) => {
  const shadow = isDark ? DROPDOWN_DRAK_SHADOW : DROPDOWN_LIGHT_SHADOW;
  return Platform.OS === "web" ? shadow : undefined;
};

export const MATIC_CHAIN_ID =
  process.env.NEXT_PUBLIC_CHAIN_ID == "mumbai" ? 80001 : 137;

export const MATIC_CHAIN_DETAILS = {
  chainId: `0x${MATIC_CHAIN_ID.toString(16)}`,
  chainName:
    process.env.NEXT_PUBLIC_CHAIN_ID == "mumbai" ? "Mumbai Testnet" : "Polygon",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls:
    process.env.NEXT_PUBLIC_CHAIN_ID == "mumbai"
      ? ["https://matic-mumbai.chainstacklabs.com"]
      : ["https://polygon-rpc.com"],
  blockExplorerUrls: [
    process.env.NEXT_PUBLIC_CHAIN_ID == "mumbai"
      ? "https://mumbai.polygonscan.com/"
      : "https://polygonscan.com/",
  ],
};

export const getFileFormData = async (
  file: string | File
): Promise<Blob | undefined> => {
  const fileMetaData = await getFileMeta(file);

  if (!fileMetaData) return;

  if (typeof file === "string") {
    // Web Camera -  Data URI
    if (file?.startsWith("data")) {
      //@ts-ignore
      const newFile = dataURLtoFile(file, "unknown");

      return newFile;
    }
    // Native - File path string
    else {
      return {
        //@ts-ignore
        uri: file,
        name: fileMetaData.name,
        type: fileMetaData.type,
      };
    }
  }

  // Web File Picker - File Object
  return file as Blob;
};

export const supportedImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
export const supportedVideoExtensions = ["mp4", "mov", "avi", "mkv", "webm"];

export const getFileMeta = async (file?: File | string) => {
  if (!file) {
    return;
  }

  if (typeof file === "string") {
    // Web Camera -  Data URI
    if (file.startsWith("data")) {
      const fileExtension = file.substring(
        file.indexOf(":") + 1,
        file.indexOf(";")
      );

      const contentWithoutMime = file.split(",")[1];
      const sizeInBytes = window.atob(contentWithoutMime).length;

      return {
        name: "unknown",
        type: fileExtension,
        size: sizeInBytes,
      };
    }

    // Native - File path
    else {
      const fileName = file.split("/").pop();
      const fileExtension = fileName?.split(".").pop();
      const fileInfo = await FileSystem.getInfoAsync(file);

      if (fileExtension && supportedImageExtensions.includes(fileExtension)) {
        return {
          name: fileName,
          type: "image/" + fileExtension,
          // @ts-expect-error - size is not defined in type
          size: fileInfo.size,
        };
      } else if (
        fileExtension &&
        supportedVideoExtensions.includes(fileExtension)
      ) {
        return {
          name: fileName,
          type: "video/" + fileExtension,
          // @ts-expect-error - size is not defined in type
          size: fileInfo.size,
        };
      }
    }
  }

  // Web File Picker - File Object
  else {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
    };
  }
};
function dataURLtoFile(dataurl: string, filename: string) {
  let arr = dataurl.split(","),
    //@ts-ignore
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export const getCreatorUsernameFromNFT = (nft?: {
  creator_username?: string;
  creator_name?: string;
  creator_address?: string;
}) => {
  if (!nft) return "";
  return nft.creator_username
    ? `@${nft.creator_username}`
    : nft.creator_name
    ? nft.creator_name
    : formatAddressShort(nft.creator_address);
};

export const getCreatorNameFromNFT = (nft?: {
  creator_username?: string;
  creator_name?: string;
  creator_address?: string;
}) => {
  if (!nft) return "";
  return nft.creator_name
    ? nft.creator_name
    : nft.creator_username
    ? nft.creator_name?.toLocaleUpperCase()
    : formatAddressShort(nft.creator_address);
};

export const getTwitterIntentUsername = (profile?: Profile) => {
  if (!profile) return "";

  const twitterUsername = profile.social_login_handles.twitter;
  if (twitterUsername) {
    return `@${twitterUsername.replace(/@/g, "")}`;
  }

  if (profile.username) {
    // because we don't have a real Twitter username, we need to silently mention on Twitter intent.
    return `@\u2060${profile.username}`;
  }
  return profile.name
    ? profile.name
    : profile.wallet_addresses_v2?.[0]?.ens_domain
    ? profile.wallet_addresses_v2[0].ens_domain
    : formatAddressShort(profile.wallet_addresses_v2?.[0]?.address);
};
export const getInstagramUsername = (profile?: Profile) => {
  if (!profile) return "";

  const instagramUsername = profile.social_login_handles.instagram;
  if (instagramUsername) {
    return `@${instagramUsername.replace(/@/g, "")}`;
  }
};

export const getDomainName = (link?: string) => {
  if (!link) return null;
  const domainRegexp = /^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/\n]+)/gim;
  const results = domainRegexp.exec(link);
  if (!results) return null;
  return results[results?.length - 1];
};

export const formatLink = (link: string) => {
  if (link.search(/^http[s]?:\/\//) !== -1) return link;
  return "https://" + link;
};

export const getTwitterIntent = ({
  url,
  message,
}: {
  url: string;
  message: string;
}) => {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    url
  )}&text=${encodeURIComponent(message)}`;
};

export function isAndroid(): boolean {
  return (
    typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)
  );
}

export function isSmallIOS(): boolean {
  return (
    typeof navigator !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)
  );
}

export function isLargeIOS(): boolean {
  return typeof navigator !== "undefined" && /iPad/.test(navigator.userAgent);
}

export function isIOS(): boolean {
  return isSmallIOS() || isLargeIOS();
}
export function isSafari(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /Safari/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent)
  );
}

export function isMobileWeb(): boolean {
  return Platform.OS === "web" && (isAndroid() || isIOS());
}
export function isDesktopWeb(): boolean {
  return Platform.OS === "web" && !isAndroid() && !isIOS();
}

export function isClassComponent(component: any) {
  return (
    typeof component === "function" && !!component.prototype.isReactComponent
  );
}

export function isFunctionComponent(component: any) {
  return (
    typeof component === "function" &&
    String(component).includes("return React.createElement")
  );
}

export function isReactComponent(component: any) {
  if (!component) return false;
  return isClassComponent(component) || isFunctionComponent(component);
}

export const userHasIncompleteExternalLinks = (profile?: {
  links: Profile["links"];
  website_url: Profile["website_url"];
}) => {
  if (
    profile &&
    (profile.website_url || profile.links.some((l) => l.user_input))
  ) {
    return false;
  }
  return true;
};

export const convertUTCDateToLocalDate = (dateStr: string) => {
  if (typeof dateStr !== "string") return new Date();
  // will be old UTC +0 time if include Z, so return time directly
  if (dateStr.includes("Z")) return new Date(dateStr);

  return new Date(dateStr + "Z");
};

export const obfuscatePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return "";
  const obfuscated =
    phoneNumber.slice(0, 3) +
    "*".repeat(phoneNumber.length - 5) +
    phoneNumber.slice(-2);

  return obfuscated;
};

//#region format profile routers
const ProfileTabNameMap = new Map([
  ["owned", "collected"],
  ["created", "drops"],
]);

const getProfileTitle = (name: string) => {
  const title = ProfileTabNameMap.get(name) ?? name;
  return title.replace(/^\S/, (s) => s.toUpperCase());
};

export const formatProfileRoutes = (
  tabs: ProfileTabsAPI["tabs"] | undefined
) => {
  if (!tabs) return [];
  return tabs.map((item, index) => ({
    title: getProfileTitle(item.name),
    key: item?.name,
    index,
    subtitle: item.displayed_count,
  }));
};
//#endregion

export const getFormatDistanceToNowStrict = (time?: string) => {
  if (!time) return "";
  return formatDistanceToNowStrict(new Date(time), { addSuffix: true });
};

// Format claim big numbers
export function formatClaimNumber(number: number) {
  if (!number) return 0;
  // for the edge case of 100k, our max supply, put “100k”, no decimals
  if (number >= 100000) {
    return `100k`;
  } else if (number > 9999) {
    return `${(number / 1000).toFixed(1)}k`;
  } else {
    return number;
  }
}

export const OAUTH_REDIRECT_URI = Platform.select({
  web: __DEV__
    ? "http://localhost:3000/magic-oauth-redirect"
    : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/magic-oauth-redirect`,
  default: `io.showtime${__DEV__ ? ".development" : ""}://magic-oauth-redirect`,
});

export const isProfileIncomplete = (profile?: Profile) => {
  // FYI: has_social_login is true if user has logged in with google, apple, spotify, twitter, instagram
  // the value is false if user has logged in with email or phone number
  return profile
    ? !profile.username ||
        (!profile.has_social_login && !profile.captcha_completed_at)
    : undefined;
};

export function getFullSizeCover(url: string | undefined) {
  if (!url) return DEFAULT_PROFILE_PIC;
  if (
    url &&
    url.startsWith("https://lh3.googleusercontent.com") &&
    !url.endsWith("=s0")
  ) {
    return url + "=s0";
  }

  return url;
}
export const findTokenChainName = (chainId?: string) => {
  if (!chainId) return null;
  return Object.keys(CHAIN_IDENTIFIERS).find(
    (key: string) =>
      CHAIN_IDENTIFIERS[key as keyof typeof CHAIN_IDENTIFIERS] == chainId
  );
};

export const getFormatDistanceStrictToWeek = (time?: string) => {
  if (!time) return "";
  const currentDate = new Date();
  const givenDate = new Date(time);
  const diffTime = currentDate.getTime() - givenDate.getTime();
  const diffMinutes = diffTime / (1000 * 60);
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const diffHours = diffTime / (1000 * 60 * 60);

  if (diffMinutes < 1) {
    return `now`;
  }

  if (diffMinutes >= 1 && diffMinutes < 60) {
    return `${Math.round(diffMinutes)}m`;
  }

  if (diffDays < 1) {
    return `${Math.round(diffHours)}h`;
  }

  return `${Math.ceil(diffDays / 7)}w`;
};

export const contentFitToresizeMode = (resizeMode: ImageResizeMode) => {
  switch (resizeMode) {
    case "cover":
      return ResizeMode.COVER;
    case "contain":
      return ResizeMode.CONTAIN;
    default:
      return ResizeMode.STRETCH;
  }
};

export const cleanUserTextInput = (text: string) => {
  return (
    text
      // normalize line breaks
      .replace(/\r\n|\r|\n/g, "\n")
      // remove extra line breaks (more than 1)
      .replace(/(\n){3,}/g, "\n")
      // remove leading and trailing line breaks and whitespace
      .trim()
  );
};

export const limitLineBreaks = (
  text: string,
  maxLineBreaks: number = 5,
  separator: string = " "
) => {
  return text
    .split("\n")
    .slice(0, maxLineBreaks)
    .concat(text.split("\n").slice(maxLineBreaks).join(separator).trim())
    .join("\n")
    .trim();
};

export const getWebImageSize = (file: File) => {
  const img = new Image();
  img.src = window.URL.createObjectURL(file);
  const promise = new Promise<
    { width: number; height: number } | null | undefined
  >((resolve, reject) => {
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      resolve({ width, height });
    };
    img.onerror = reject;
  });
  return promise;
};

export const formatAPIErrorMessage = (error: AxiosError | Error) => {
  let messages = [];
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;
    if (res.errors) {
      messages = res.errors.map((e: any) => e.message);
    } else if (res.error) {
      messages.push(res.error.message);
    }
  } else if (error.message) {
    messages.push(error.message);
  }

  return messages.join(".\n");
};

function getRandomDateWithinThreeMonths(): string {
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const randomTimestamp = Math.floor(
    threeMonthsAgo.getTime() +
      Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  );

  return new Date(randomTimestamp).toISOString();
}

export const generateFakeData = (
  length: number,
  suffix: string = ""
): {
  id: string;
  username: string;
  date: string;
  // Add more keys here if needed
}[] => {
  return Array.from({ length }, (_, i) => ({
    id: i + 1 + suffix,
    username: `user${i + 1}_${suffix}`,
    date: getRandomDateWithinThreeMonths(),
    text: generateRandomLoremIpsum(),
    // Add more keys here if needed
  }));
};

export function formatDateRelativeWithIntl(isoDateString: string): string {
  const date = new Date(isoDateString);
  const now = new Date();
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "now";
  } else if (diffInDays < 1) {
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return timeFormatter.format(date);
  } else if (diffInDays >= 1 && diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30.44);
    const diffInYears = Math.floor(diffInDays / 365.25);

    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    } else if (diffInMonths < 1) {
      return `${diffInWeeks}w`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}m`;
    } else {
      return `${diffInYears}y`;
    }
  }
}

export function getRandomNumber(min = 50, max = 26000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomLoremIpsum() {
  const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "curabitur",
    "vel",
    "hendrerit",
    "libero",
    "eleifend",
    "blandit",
    "nunc",
    "ornare",
    "odio",
    "ut",
    "orci",
    "gravida",
    "imperdiet",
    "nullam",
    "purus",
    "lacinia",
    "a",
    "pretium",
    "quis",
    "congue",
    "praesent",
    "sagittis",
    "laoreet",
    "auctor",
    "mauris",
    "non",
    "velit",
    "eros",
    "dictum",
    "proin",
    "accumsan",
    "sapien",
    "nec",
    "massa",
    "volutpat",
    "venenatis",
    "sed",
    "eu",
    "molestie",
  ];

  const minWordsCount = 3;
  const maxWordsCount = 15;
  const wordsCount =
    Math.floor(Math.random() * (maxWordsCount - minWordsCount + 1)) +
    minWordsCount;

  const result = [];

  for (let i = 0; i < wordsCount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }

  return result.join(" ");
}

export const getWebBaseURL = () => {
  return `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN ?? "showtime.xyz"}`;
};

export function shortenLongWords(str: string, maxLength: number = 35): string {
  let words: string[] = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > maxLength) {
      let partLengthStart: number = Math.floor((maxLength - 3) * 0.7); // 70% of the length for the start
      let partLengthEnd: number = maxLength - 3 - partLengthStart; // Remaining for the end
      words[i] =
        words[i].substring(0, partLengthStart) +
        "..." +
        words[i].substring(words[i].length - partLengthEnd);
    }
  }
  return words.join(" ");
}

export const getCurrencySymbol = (currency?: string) => {
  if (currency === "INR") return "₹";
  return "$";
};
