import { CONTRACTS } from "./constants";
import removeMd from "remove-markdown";

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const removeTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return removeMd(str.replace(/(<([^>]+)>)/gi, " "));
};

export const truncateWithEllipses = (text, max) => {
  if (!text) return null;
  return text.substr(0, max - 1) + (text.length >= max ? "..." : "");
};

export const formatAddressShort = (address) => {
  if (!address) {
    return null;
  }
  const startString = address.slice(0, 4);
  const endString = address.slice(address.length - 4, address.length);
  return `${startString}...${endString}`;
};

export const copyToClipBoard = async (textToCopy) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch (err) {}
};

export const getBidLink = (item) => {
  switch (item.contract_address) {
    case CONTRACTS.ZORA:
      return `https://zora.co/${item.creator_address}/${item.token_id}`;
    case CONTRACTS.RARIBLE_V2:
    case CONTRACTS.RARIBLE_1155:
      return `https://rarible.com/token/${item.contract_address}:${item.token_id}`;
    case CONTRACTS.KNOWNORIGIN:
      if (item.token_ko_edition) {
        return `https://knownorigin.io/gallery/${item.token_ko_edition}`;
      } else {
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
      }
    case CONTRACTS.PORTIONIO:
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
    default:
      return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`;
  }
};

export const getContractName = (item) => {
  switch (item.contract_address) {
    case CONTRACTS.ZORA:
      return "Zora";
    case CONTRACTS.RARIBLE_V2:
    case CONTRACTS.RARIBLE_1155:
      return "Rarible";
    case CONTRACTS.KNOWNORIGIN:
      if (item.token_ko_edition) {
        return "KnownOrigin";
      } else {
        return "OpenSea";
      }
    case CONTRACTS.FOUNDATION:
      return "Foundation";
    case CONTRACTS.SUPERRARE_V1:
    case CONTRACTS.SUPERRARE_V2:
      return "SuperRare";
    case CONTRACTS.ASYNCART_V1:
    case CONTRACTS.ASYNCART_V2:
      return "Async Art";
    case CONTRACTS.PORTIONIO:
      if (item.token_img_original_url) {
        return "Portion.io";
      } else {
        return "OpenSea";
      }
    case CONTRACTS.CRYPTOARTAI:
      if (item.token_edition_identifier) {
        return "CryptoArt.Ai";
      } else {
        return "OpenSea";
      }
    default:
      return "OpenSea";
  }
};
