import { CONTRACTS } from "./constants";

export const removeTags = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, " ");
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
    case CONTRACTS.FOUNDATION:
      return `https://foundation.app/creator/nft-${item.token_id}`;
    case CONTRACTS.SUPERRARE_V2:
      return `https://superrare.co/artwork-v2/${item.token_id}`;
    case CONTRACTS.SUPERRARE_V1:
      return `https://superrare.co/artwork/${item.token_id}`;
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
    default:
      return "OpenSea";
  }
};
