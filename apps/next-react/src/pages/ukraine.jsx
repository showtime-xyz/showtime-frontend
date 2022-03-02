import CappedWidth from "@/components/CappedWidth";
import BadgeIcon from "@/components/Icons/BadgeIcon";
import SpotlightItem from "@/components/SpotlightItem-ukraine";
import Layout from "@/components/layout";

<<<<<<< HEAD
import bannerURL from "../../public/img/ukraine-banner.jpg";

/** Change with the NFT data post mint */
=======
>>>>>>> f93d8a91 (feature(ukraine): donation page)
const hardcodedNFT = {
  nft_id: 17625054,
  contract_address: "0x8a13628dd5d600ca1e8bf9dbc685b735f615cb90",
  token_id: "1",
  like_count: 42,
<<<<<<< HEAD
  token_name: "Help For Ukraine 2022",
  token_description:
    "Showtime is partnering with Ukrainian artists to help raise necessary funds for organizations that are helping those suffering from the war in Ukraine. You can help by purchasing this limited-edition NFT, where all proceeds will go directly to UkraineDAO.",
=======
  token_name: "Placeholder NFT Name",
  token_description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
>>>>>>> f93d8a91 (feature(ukraine): donation page)
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
<<<<<<< HEAD
          className="h-32 md:h-64 relative text-left bg-gray-50 dark:bg-gray-900 2xl:rounded-b-[32px] md:-mx-3 bg-no-repeat bg-contain bg-center xl:bg-cover"
          style={{
            backgroundImage: `url(${bannerURL})`,
          }}
=======
          className="h-32 md:h-64 relative text-left bg-gray-50 dark:bg-gray-900 2xl:rounded-b-[32px] md:-mx-3 bg-no-repeat bg-center bg-cover"
          style={{ backgroundImage: `url()` }}
>>>>>>> f93d8a91 (feature(ukraine): donation page)
        ></div>
        <CappedWidth>
          <div className="mx-5 md:mx-0 lg:mx-5">
            <div className="flex flex-col text-left">
              <div className="z-10 pb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative -mt-14 md:-mt-20 rounded-full border-8 border-white dark:border-gray-900 overflow-hidden group self-start flex-shrink-0">
                    <img
<<<<<<< HEAD
                      src="https://pbs.twimg.com/profile_images/1497144819835150338/mOByMguO_400x400.jpg"
                      className="h-24 w-24 md:h-32 md:w-32 z-10 flex-shrink-0"
                    />
=======
                      src="https://storage.googleapis.com/nft-public-profile-pics/147991_1619920081.jpg"
                      className="h-24 w-24 md:h-32 md:w-32 z-10 flex-shrink-0"
                    />
                    {/* {isMyProfile && (
                        <button
                          onClick={editPhoto}
                          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg backdrop-saturate-150 transition duration-300 flex items-center justify-center rounded-full"
                        >
                          <UploadIcon className="w-10 h-10 text-white dark:text-gray-300" />
                        </button>
                      )} */}
                  </div>
                  <div className="hidden md:block">
                    {/* {wallet_addresses_excluding_email_v2 && (
                        <AddressCollection
                          addresses={wallet_addresses_excluding_email_v2}
                          isMyProfile={isMyProfile}
                        />
                      )} */}
                  </div>
                </div>
                <div className="flex items-center space-x-8 md:space-x-4 lg:space-x-8">
                  <div className="hidden md:block">
                    {/* <FollowStats
                        {...{
                          following_count,
                          followersCount,
                          isMyProfile,
                          setShowFollowing,
                          setShowFollowers,
                        }}
                      /> */}
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <Button
                        style={
                          isMyProfile
                            ? "tertiary_gray"
                            : isFollowed
                            ? "tertiary"
                            : "primary"
                        }
                        onClick={
                          isAuthenticated
                            ? isMyProfile
                              ? editAccount
                              : isFollowed
                              ? handleUnfollow
                              : context.disableFollows
                              ? null
                              : handleFollow
                            : handleLoggedOutFollow
                        }
                        className={`space-x-2 !rounded-full ${
                          isFollowed || isMyProfile
                            ? "dark:text-gray-400"
                            : "text-white"
                        }`}
                      >
                        {isMyProfile ? (
                          <span className="font-semibold whitespace-nowrap">
                            Edit Profile
                          </span>
                        ) : isFollowed ? (
                          <span className="font-bold">Following</span>
                        ) : (
                          <span className="font-bold">
                            {followingMe ? "Follow Back" : "Follow"}
                          </span>
                        )}
                      </Button> */}
>>>>>>> f93d8a91 (feature(ukraine): donation page)
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
<<<<<<< HEAD
                          {hardcodedNFT.token_name}
=======
                          Unnamed
>>>>>>> f93d8a91 (feature(ukraine): donation page)
                        </h2>
                        {true && (
                          <BadgeIcon
                            className="w-5 md:w-6 h-auto text-black dark:text-white"
                            tickClass="text-white dark:text-black"
                          />
                        )}
                      </div>
<<<<<<< HEAD
                    </div>
                  </div>
=======
                      {/* <div className="mt-2 flex items-center space-x-2">
                          {(username ||
                            (wallet_addresses_excluding_email_v2 &&
                              wallet_addresses_excluding_email_v2.length >
                                0)) && (
                            <p className="flex flex-row items-center justify-start">
                              {username && (
                                <span className="font-tomato font-bold tracking-wider dark:text-gray-300">
                                  @{username}
                                </span>
                              )}
                            </p>
                          )}
                          {followingMe && (
                            <span className="font-medium text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                              Follows You
                            </span>
                          )}
                        </div> */}
                    </div>
                    {/* <div className="hidden md:block">
                        {isAuthenticated && !isMyProfile && (
                          <FollowersInCommon profileId={profile_id} />
                        )}
                      </div> */}
                  </div>
                  {/* <div className="flex justify-between">
                      <div>
                        {bio ? (
                          <div className="text-black dark:text-gray-400 text-sm max-w-2xl text-left md:text-base mt-4 block break-words">
                            {moreBioShown
                              ? bioWithMentions
                              : shortBioWithMentions}
                            {!moreBioShown &&
                              bio &&
                              bio.length > initialBioLength && (
                                <a
                                  onClick={() => setMoreBioShown(true)}
                                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 cursor-pointer"
                                >
                                  {" "}
                                  more
                                </a>
                              )}
                          </div>
                        ) : null}
                      </div> */}
                  {/* <LinkCollection
                        className="hidden md:block"
                        links={links}
                        website_url={website_url}
                        slug_address={slug_address}
                      />
                    </div>
                    {wallet_addresses_excluding_email_v2 && (
                      <div className="mt-8 md:hidden">
                        <AddressCollection
                          addresses={wallet_addresses_excluding_email_v2}
                          isMyProfile={isMyProfile}
                        />
                      </div>
                    )}
                    <div className="mt-4 md:hidden">
                      <FollowStats
                        {...{
                          following,
                          following_count,
                          followers,
                          followersCount,
                          isMyProfile,
                          setShowFollowing,
                          setShowFollowers,
                        }}
                      />
                    </div>
                    <div className="mt-4 md:hidden">
                      {isAuthenticated && !isMyProfile && (
                        <FollowersInCommon profileId={profile_id} />
                      )}
                    </div>
                    <LinkCollection
                      className="md:hidden"
                      links={links}
                      website_url={website_url}
                      slug_address={slug_address}
                    /> */}
>>>>>>> f93d8a91 (feature(ukraine): donation page)
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
<<<<<<< HEAD
              profile_id: "162363", // Can backend spoof?
=======
              profile_id: "162363",
>>>>>>> f93d8a91 (feature(ukraine): donation page)
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
