import axios from "axios";

import { CHAIN_IDENTIFIERS } from "app/lib/constants";
import { NftScreen } from "app/screens/nft";
import { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

export async function getServerSideProps(context) {
  const { chainName, contractAddress, tokenId } = context.params;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/token/${contractAddress}/${tokenId}?chain_identifier=${CHAIN_IDENTIFIERS[chainName]}`
    );

    const nft = res.data?.data?.item as NFT;
    const imageUrl = getMediaUrl({
      nft,
      stillPreview: nft?.mime_type?.startsWith("video"),
    });

    if (nft) {
      return {
        props: {
          meta: {
            title: nft.token_name + " | Showtime",
            description: nft.token_description,
            image: imageUrl,
          },
        },
      };
    }
  } catch (e) {}

  return {
    props: {},
  };
}

export default NftScreen;
