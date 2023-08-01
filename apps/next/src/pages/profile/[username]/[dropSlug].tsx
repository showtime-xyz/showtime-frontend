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
    let imageUrl = getMediaUrl({
      nft,
      stillPreview: nft?.mime_type?.startsWith("video"),
      optimized: true,
    });
    const pfp = nft?.creator_img_url;
    const desc = nft?.token_description;
    const gatingType = "spotify_save";

    const image = encodeURI(
      `${
        __DEV__
          ? "http://localhost:3000"
          : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
      }/api/drop?username=${username}&image=${imageUrl}&pfp=${pfp}&dropCreated=true&desc=${desc}&gatingType=${gatingType}`
    );
    // lets check if the image is from showtime.xyz (eg Bunny,
    // since they start with media.showtime.xyz and video.showtime.xyz)
    console.log(image);
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
            deeplinkUrl: `/@${username}/${dropSlug}`,
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
