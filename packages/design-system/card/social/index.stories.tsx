import { Meta } from "@storybook/react";
import { View } from "design-system/view";

import { Social } from "./index";

export default {
  component: Social,
  title: "Components/Card/Social/Index",
} as Meta;

export const Basic: React.VFC<{}> = () => {
  const activity = {
    id: 827316,
    type: "like",
    timestamp: "2021-11-27T00:16:59.797",
    actor_id: 147991,
    nfts: [
      {
        activity_id: 827316,
        nft_id: 17625054,
        contract_address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
        token_id: "1",
        like_count: 31,
        token_name: "Showtime Genesis Team",
        token_description:
          "History in the making: this is the first NFT ever created on Showtime, on the Polygon network!\n\nTo celebrate this inaugural item, we are creating five editions to give out to each member of the original Showtime team (in alphabetical order): Alex Kilkka, Clare Maguire, Alex Masmej, Miguel Piedrafita and Blaze Pollard.\n\nArtwork: Showtime Logo (original concept from Emma Salinas, designed by Blaze Pollard).",
        token_img_url:
          "https://lh3.googleusercontent.com/Pxg4ZXLMXPcgTZ-PbAxWcni3Cqfx2GrB7lZiFz1ryG_EE7ZdjmhOmfGjwLQE41iuUERbM7ByBc3PELYCE14nwcXHxspBMl84n6AQ",
        token_img_original_url:
          "https://ipfs.io/ipfs/QmS3bHrWy58Gz5FMDmhgCQxiiAJ6Ct5MoQxhj2KRgFDkok",
        token_has_video: 0,
        token_animation_url: null,
        animation_preview_url: null,
        blurhash:
          "yPG8^6CN06W?-,kDM~K#%KX6kBfjj[fj06X6^}j@IYa|kAW?kBj@fQazfQf7%cj@IXazt5jat5j^fkazfkj@fQj@j[fjt5j@M~a|az",
        token_background_color: null,
        token_aspect_ratio: "1.00000",
        token_hidden: 0,
        creator_id: 147991,
        creator_name: "Alex Masmej",
        creator_address: "alexmasmej.eth",
        creator_address_nonens: "0xD3e9D60e4E4De615124D5239219F32946d10151D",
        creator_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/147991_1619920081.jpg",
        multiple_owners: 1,
        owner_id: null,
        owner_name: null,
        owner_address: null,
        owner_img_url: null,
        token_created: "2021-09-01T04:56:29",
        token_creator_followers_only: 0,
        creator_username: "am",
        creator_verified: 1,
        owner_username: null,
        owner_verified: null,
        comment_count: 11,
        owner_count: 5,
        token_count: 5,
        token_ko_edition: null,
        token_edition_identifier: null,
        source_url:
          "https://lh3.googleusercontent.com/Pxg4ZXLMXPcgTZ-PbAxWcni3Cqfx2GrB7lZiFz1ryG_EE7ZdjmhOmfGjwLQE41iuUERbM7ByBc3PELYCE14nwcXHxspBMl84n6AQ",
        still_preview_url:
          "https://lh3.googleusercontent.com/Pxg4ZXLMXPcgTZ-PbAxWcni3Cqfx2GrB7lZiFz1ryG_EE7ZdjmhOmfGjwLQE41iuUERbM7ByBc3PELYCE14nwcXHxspBMl84n6AQ",
        mime_type: "image/png",
        chain_identifier: "137",
        token_listing_identifier: null,
      },
      {
        activity_id: 827316,
        nft_id: 76208186,
        contract_address: "0x09F3a26302e1c45f0d78Be5D592f52b6fca43811",
        token_id: "38",
        like_count: 2,
        token_name: "test nft",
        token_description: "hello world",
        token_img_url:
          "https://lh3.googleusercontent.com/8GXYkSoSJIaHGwjrLqGxomotSEB_YIHcabU_3Dc-kxCxp3LX-1xOzpuD2mh5Y81IqZdEVq03OJ6uXNpTcpYv15mid7y4f8a0x4k",
        token_img_original_url:
          "https://gateway.pinata.cloud/ipfs/QmWsEdu43Ww4htaHj8goo2rP8p3AQoK6FQAgG94TTDX95x",
        token_has_video: 0,
        token_animation_url: null,
        animation_preview_url: null,
        blurhash:
          "yF9},H,m=Rr;=Rwa=Q;xoLs8jusRjbn#=Qn$WnoMbEa}WT,sn%WVa|bFj[a|=Qn$WTfRWnj[Wn$PjsWpjua|fQa|=Pn$WUa}WUa}WU",
        token_background_color: null,
        token_aspect_ratio: "0.92634",
        token_hidden: 0,
        creator_id: 162363,
        creator_name: "Miguel Piedrafita",
        creator_address: "m1guelpf.eth",
        creator_address_nonens: "0xE340b00B6B622C136fFA5CFf130eC8edCdDCb39D",
        creator_img_url:
          "https://lh3.googleusercontent.com/azf5UI4ZzMgQbNWn5E9BiKIdP2gT-6BcJ1-24hVix73eapPxPxDkbgLqRJ5T1uOuW35cshX8KOVdxzeGJZO49lMf6qC8zgX8Zf5i",
        multiple_owners: 0,
        owner_id: 162363,
        owner_name: "Miguel Piedrafita",
        owner_address: "m1guelpf.eth",
        owner_img_url:
          "https://lh3.googleusercontent.com/azf5UI4ZzMgQbNWn5E9BiKIdP2gT-6BcJ1-24hVix73eapPxPxDkbgLqRJ5T1uOuW35cshX8KOVdxzeGJZO49lMf6qC8zgX8Zf5i",
        token_created: "2021-11-24T22:37:36",
        token_creator_followers_only: 0,
        creator_username: "m1guelpf",
        creator_verified: 1,
        owner_username: "m1guelpf",
        owner_verified: 1,
        comment_count: 0,
        owner_count: 1,
        token_count: 15,
        token_ko_edition: null,
        token_edition_identifier: null,
        source_url:
          "https://lh3.googleusercontent.com/8GXYkSoSJIaHGwjrLqGxomotSEB_YIHcabU_3Dc-kxCxp3LX-1xOzpuD2mh5Y81IqZdEVq03OJ6uXNpTcpYv15mid7y4f8a0x4k",
        still_preview_url:
          "https://lh3.googleusercontent.com/8GXYkSoSJIaHGwjrLqGxomotSEB_YIHcabU_3Dc-kxCxp3LX-1xOzpuD2mh5Y81IqZdEVq03OJ6uXNpTcpYv15mid7y4f8a0x4k",
        mime_type: "image/png",
        chain_identifier: "80001",
        token_listing_identifier: null,
      },
    ],
    actor: {
      username: "am",
      verified: 1,
      profile_id: 147991,
      name: "Alex Masmej",
      wallet_address: "alexmasmej.eth",
      img_url:
        "https://storage.googleapis.com/nft-public-profile-pics/147991_1619920081.jpg",
    },
  };

  return <Social nft={activity.nfts[0]} />;
};
