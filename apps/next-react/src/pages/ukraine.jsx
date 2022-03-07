import CappedWidth from "@/components/CappedWidth";
import BadgeIcon from "@/components/Icons/BadgeIcon";
import SpotlightItem from "@/components/SpotlightItem-ukraine";
import Layout from "@/components/layout";

import bannerURL from "../../public/img/ukraine-banner.jpg";

/** Change with the NFT data post mint */
const hardcodedNFT = {
  nft_id: 17625054,
  contract_address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
  token_id: "1",
  like_count: 42,
  token_name: "Help For Ukraine 2022",
  token_description:
    "Showtime is partnering with Ukrainian artists to help raise necessary funds for organizations that are helping those suffering from the war in Ukraine. You can help by purchasing this limited-edition NFT, where all proceeds will go directly to UkraineDAO.",
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
  token_img_twitter_url: null,
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
  collection_name: "Showtime",
  collection_slug: "showtime",
  collection_img_url:
    "http://lh3.googleusercontent.com/HoSAPydLhYadm-jdgAE83mou5Fi5qbwbhv9UqcQuaHHfZreVsykcbFNLBuQhawIWLEa883DeBDprMM76oTHTAvPIrACxBHRK05h5Dw=s120",
  contract_is_creator: 0,
  multiple_owner_pics: [
    "https://lh3.googleusercontent.com/4NZDQhHbwkjrewCLnnuvmsXOrjNMrBCZ4xg3cS7FyJAPiT6T2vrdo3ZkVE8RwkQ-4ticjxTVjyGehJS0xOG3SW1UMEKz7qVFIjj1",
    "https://lh3.googleusercontent.com/BupmR13IW8BOkQyeeFCOqa6KHhHa8GHormxzNN7kOF4RpVC41lGPNepLfvW4eaPpZxlLt3rk2wd91LGvp8C9K2Z7v-uZgGBE9sc",
    "https://lh3.googleusercontent.com/oxWrFL8uDDhnir_y6FAxRDfRvp_RyFWj-LIgtxL49J97RqICaF-Kg0K2yBy7dqvaZCxsUdaul25S6S2FjCpo7bQvLXc7V3SkFzQg",
    "https://lh3.googleusercontent.com/ZD49NfdfFcRmiens3foM_X54_pVEVm8FFWK2cdi4SsVeai8B4eR1zPIYBVy68lspSmbTSOTokS3Rfrfld50CZm_QIk1F_udpZLq6",
  ],
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
                      src="https://pbs.twimg.com/profile_images/1497144819835150338/mOByMguO_400x400.jpg"
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
