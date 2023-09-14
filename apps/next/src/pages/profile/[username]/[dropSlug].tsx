import axios from "axios";

import { Logger } from "app/lib/logger";
import { NftScreen } from "app/screens/nft";
import type { NFT } from "app/types";
import { getCreatorUsernameFromNFT, getMediaUrl } from "app/utilities";

const fallbackImage =
  "https://storage.googleapis.com/showtime-cdn/Showtime-1200x630.jpg";

export async function getServerSideProps(context) {
  const { username, dropSlug } = context.params;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/nft/${username}/${dropSlug}`
    );
    const fallback = {
      [`/v2/nft/${username}/${dropSlug}`]: res.data,
    };

    const nft = res.data as NFT;
    const image = encodeURI(
      `${
        __DEV__
          ? "http://localhost:3000"
          : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
      }/api/drop?username=${username}&dropSlug=${dropSlug}`
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
            deeplinkUrl: `/@${username}/${dropSlug}`,
            nftCollection: nft.token_name,
            nftContractAddress: nft.contract_address,
            nftCreatorAddress: nft.creator_address,
            nftSchema: "erc721",
            nftChain: nft.chain_name,
          },
        },
      };
    }
  } catch (e) {
    Logger.error(e);
  }

  return {
    props: {},
  };
}

export default NftScreen;
