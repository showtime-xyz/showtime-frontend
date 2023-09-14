import axios from "axios";

import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { NftScreen } from "app/screens/nft";
import type { NFT } from "app/types";
import { getCreatorUsernameFromNFT, getMediaUrl } from "app/utilities";

const fallbackImage =
  "https://storage.googleapis.com/showtime-cdn/Showtime-1200x630.jpg";

export async function getServerSideProps(context) {
  const { chainName, contractAddress, tokenId } = context.params;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/token/${contractAddress}/${tokenId}?chain_identifier=${CHAIN_IDENTIFIERS[chainName]}`
    );
    const fallback = {
      [`/api/v2/token/${contractAddress}/${tokenId}?chain_identifier=${CHAIN_IDENTIFIERS[chainName]}`]:
        res.data,
    };

    const nft = res.data?.data?.item as NFT;
    let imageUrl = getMediaUrl({
      nft,
      stillPreview: nft?.mime_type?.startsWith("video"),
      optimized: true,
    });
    const username = nft?.creator_name;
    const pfp = nft?.creator_img_url;
    const desc = nft?.token_description;
    const gatingType = nft?.gating_type;

    if (imageUrl && imageUrl.includes("showtime.xyz/")) {
      imageUrl = imageUrl + "?class=ogimage";
    }

    const image = encodeURI(
      `${
        __DEV__
          ? "http://localhost:3000"
          : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
      }/api/drop?username=${username}&gatingType=${gatingType}&image=${imageUrl}&pfp=${pfp}&dropCreated=true&desc=${desc}`
    );

    if (nft) {
      return {
        props: {
          fallback,
          meta: {
            title: `${nft.token_name} by ${
              nft.creator_name ?? getCreatorUsernameFromNFT(nft)
            } | Showtime`,
            description: nft.token_description,
            image: nft?.nsfw ? fallbackImage : image,
            deeplinkUrl: `nft/${chainName}/${contractAddress}/${tokenId}`,
            "eth:nft:collection": nft.token_name,
            "eth:nft:contract_address": nft.contract_address,
            "eth:nft:creator_address": nft.creator_address,
            "eth:nft:schema": "erc721",
            "eth:nft:chain": nft.chain_name,
          },
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {},
  };
}

export default NftScreen;
