import CappedWidth from "@/components/CappedWidth";
import BadgeIcon from "@/components/Icons/BadgeIcon";
import SpotlightItem from "@/components/SpotlightItem-ukraine";
import Layout from "@/components/layout";

import bannerURL from "../../public/img/ukraine-banner.jpeg";
import pfpURL from "../../public/img/ukraine-dao-pfp.jpeg";

/** Change with the NFT data post mint */
const hardcodedNFT = {
  nft_id: 258511874,
  contract_address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
  token_id: "20649",
  like_count: 0,
  token_name: "I Stand With Ukraine",
  token_description:
    "All sales proceeds from this donation NFT go to @UkraineDAO \ud83c\uddfa\ud83c\udde6",
  token_img_url:
    "https://lh3.googleusercontent.com/hyE-l8Hn0jXebr-vnIn_xY0ggIrwwLjXTt0Llym4gC-Ud7YN043IKHTuLQv3wiu5xU06KCXg1ivA5bSKt72vpzRWTmR3Ce27OCU",
  token_img_original_url:
    "https://gateway.pinata.cloud/ipfs/QmYcVPRWNw2vkqFtk6SVbTAUTRbvZvR1FkGJ7NDWoW71vS",
  token_has_video: 0,
  token_animation_url: null,
  animation_preview_url: null,
  blurhash:
    "ysKdVZa}obfRs+oLs+0ra#R.a#R.fQR.WFfQj@fQazfQa|NMfQs+j?s+a#obxVj?WXj?WEa#WF0rfQoba#oba#oca#fQa#fQj?a|j?",
  token_background_color: null,
  token_aspect_ratio: "1.00000",
  token_hidden: 0,
  creator_id: 709754,
  creator_name: "Showtime Gallery",
  creator_ens: null,
  creator_address: "0xe3fac288a27fbdf947c234f39d6e45fb12807192",
  creator_img_url:
    "https://lh3.googleusercontent.com/32vvtI1_ia-ErhLvMfRbWH1Q2Ueqmpds_B4sU_5hjZWKmUmO1ek4OlTJEoH2DoguIVA5bYKAINCkOfq_A8wyBKjXx7TNfT4XW8g",
  multiple_owners: 0,
  owner_id: 709754,
  owner_name: "Showtime Gallery",
  owner_address: "0xe3fac288a27fbdf947c234f39d6e45fb12807192",
  owner_ens: null,
  owner_img_url:
    "https://lh3.googleusercontent.com/32vvtI1_ia-ErhLvMfRbWH1Q2Ueqmpds_B4sU_5hjZWKmUmO1ek4OlTJEoH2DoguIVA5bYKAINCkOfq_A8wyBKjXx7TNfT4XW8g",
  token_img_twitter_url: null,
  token_creator_followers_only: 0,
  creator_username: "showtime",
  creator_verified: 1,
  owner_username: "showtime",
  owner_verified: 1,
  comment_count: 0,
  owner_count: 1,
  token_count: 1000000,
  token_ko_edition: null,
  token_edition_identifier: null,
  source_url:
    "https://lh3.googleusercontent.com/hyE-l8Hn0jXebr-vnIn_xY0ggIrwwLjXTt0Llym4gC-Ud7YN043IKHTuLQv3wiu5xU06KCXg1ivA5bSKt72vpzRWTmR3Ce27OCU",
  still_preview_url:
    "https://lh3.googleusercontent.com/hyE-l8Hn0jXebr-vnIn_xY0ggIrwwLjXTt0Llym4gC-Ud7YN043IKHTuLQv3wiu5xU06KCXg1ivA5bSKt72vpzRWTmR3Ce27OCU",
  mime_type: "image/png",
  chain_identifier: "137",
  token_listing_identifier: null,
  collection_name: "Showtime",
  collection_slug: "showtime",
  collection_img_url:
    "http://lh3.googleusercontent.com/HoSAPydLhYadm-jdgAE83mou5Fi5qbwbhv9UqcQuaHHfZreVsykcbFNLBuQhawIWLEa883DeBDprMM76oTHTAvPIrACxBHRK05h5Dw=s120",
  contract_is_creator: 0,
  creator_bio:
    "Showtime Official Account!\n\nBuying pieces of our community's digital art to complete our collection \ud83d\udc9c",
  token_created: "2022-03-08T18:23:34Z",
  token_last_transferred: "2022-03-08T18:23:34Z",
  multiple_owners_list: [
    {
      profile_id: 709754,
      name: "Showtime Gallery",
      img_url:
        "https://lh3.googleusercontent.com/32vvtI1_ia-ErhLvMfRbWH1Q2Ueqmpds_B4sU_5hjZWKmUmO1ek4OlTJEoH2DoguIVA5bYKAINCkOfq_A8wyBKjXx7TNfT4XW8g",
      quantity: 1000000,
      username: "showtime",
      verified: 1,
      address: "0xe3fac288a27fbdf947c234f39d6e45fb12807192",
      wallet_address: "0xe3fac288a27fbdf947c234f39d6e45fb12807192",
    },
  ],
  token_quantity: 1000000,
};

export default () => {
  return (
    <Layout>
      <div className="max-w-screen-2xl md:px-3 mx-auto w-full">
        <div
          className="h-32 md:h-64 relative text-left bg-gray-50 dark:bg-gray-900 2xl:rounded-b-[32px] md:-mx-3 bg-no-repeat bg-contain bg-center xl:bg-cover"
          style={{
            backgroundImage: `url(${bannerURL})`,
          }}
        ></div>
        <CappedWidth>
          <div className="mx-5 md:mx-0 lg:mx-5">
            <div className="flex flex-col text-left">
              <div className="z-10 pb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative -mt-14 md:-mt-20 rounded-full border-8 border-white dark:border-gray-900 overflow-hidden group self-start flex-shrink-0">
                    <img
                      src={pfpURL}
                      className="h-24 w-24 md:h-32 md:w-32 z-10 flex-shrink-0"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2
                          className={`text-3xl md:text-4xl font-tomato font-bold text-black dark:text-white ${
                            true ? "whitespace-nowrap" : ""
                          }`}
                        >
                          {hardcodedNFT.token_name}
                        </h2>
                        {true && (
                          <BadgeIcon
                            className="w-5 md:w-6 h-auto text-black dark:text-white"
                            tickClass="text-white dark:text-black"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CappedWidth>
      </div>
      <div className="mt-8 md:mt-12">
        <div className="relative bg-gray-50 dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-800 pb-8 md:py-12">
          <SpotlightItem
            item={hardcodedNFT}
            removeSpotlightItem={() => {}}
            isMyProfile={false}
            listId={0}
            key={hardcodedNFT.nft_id}
            pageProfile={{
              profile_id: "162363", // Can backend spoof?
              slug_address: "",
              name: "",
              img_url: "",
              wallet_addresses_excluding_email_v2: "",
              website_url: "",
              username: "",
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
