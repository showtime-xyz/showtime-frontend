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

export const getImageUrl = (img_url) => {
  var url = img_url ? img_url : null;
  if (url === null) {
    return "https://storage.googleapis.com/opensea-static/opensea-profile/4.png";
  }
  if (url.includes("https://lh3.googleusercontent.com")) {
    url = url.split("=")[0] + "=w375";
  }
  return url;
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
        return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`;
      }

    default:
      return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0x0c7f6405bf7299a9ebdccfd6841feac6c91e5541`;
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

    default:
      return "OpenSea";
  }
};
