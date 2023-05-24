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

    // lets check if the image is from showtime.xyz (eg Bunny,
    // since they start with media.showtime.xyz and video.showtime.xyz)
    if (imageUrl && imageUrl.includes("showtime.xyz/")) {
      imageUrl = imageUrl + "?class=ogimage";
    }

    if (nft) {
      return {
        props: {
          fallback,
          meta: {
            title: `${nft.token_name} by ${
              nft.creator_name ?? getCreatorUsernameFromNFT(nft)
            } | Showtime`,
            description: nft.token_description,
            image: nft?.nsfw ? fallbackImage : imageUrl,
            deeplinkUrl: `nft/${chainName}/${contractAddress}/${tokenId}`,
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
