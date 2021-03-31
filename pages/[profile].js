import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import Layout from "../components/layout";
import TokenGridV4 from "../components/TokenGridV4";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
//import ShareButton from "../components/ShareButton";
import ModalEditProfile from "../components/ModalEditProfile";
import ModalEditPhoto from "../components/ModalEditPhoto";
import { GridTabs, GridTab } from "../components/GridTabs";
import ProfileInfoPill from "../components/ProfileInfoPill";
import ModalUserList from "../components/ModalUserList";
import ModalAddWallet from "../components/ModalAddWallet";
import ModalAddEmail from "../components/ModalAddEmail.js";
//import { formatAddressShort, copyToClipBoard } from "../lib/utilities";
import AddressButton from "../components/AddressButton";
import { SORT_FIELDS } from "../lib/constants";
import Select from "react-dropdown-select";
import SpotlightItem from "../components/SpotlightItem";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faSun } from "@fortawesome/free-regular-svg-icons";
//import styled from "styled-components";

export async function getServerSideProps(context) {
  const { res, query } = context;

  const slug_address = query.profile;

  if (slug_address.includes("apple-touch-icon")) {
    res.writeHead(404);
    res.end();
    return { props: {} };
  }

  // Get profile metadata
  let response_profile;
  try {
    response_profile = await backend.get(`/v2/profile_server/${slug_address}`);

    const data_profile = response_profile.data.data;
    const name = data_profile.profile.name;
    const img_url = data_profile.profile.img_url;
    const wallet_addresses = data_profile.profile.wallet_addresses;
    const wallet_addresses_excluding_email =
      data_profile.profile.wallet_addresses_excluding_email;
    const followers_list = data_profile.followers;
    const following_list = data_profile.following;

    const bio = data_profile.profile.bio;
    const website_url = data_profile.profile.website_url;
    const profile_id = data_profile.profile.profile_id;
    const username = data_profile.profile.username;
    const default_list_id = data_profile.profile.default_list_id;
    const default_created_sort_id =
      data_profile.profile.default_created_sort_id;
    const default_owned_sort_id = data_profile.profile.default_owned_sort_id;
    const featured_nft_id = data_profile.profile.featured_nft_id;

    const featured_nft_img_url = data_profile.profile.featured_nft_img_url;

    return {
      props: {
        name,
        img_url,
        wallet_addresses,
        wallet_addresses_excluding_email,
        slug_address,
        followers_list,
        following_list,
        bio,
        website_url,
        profile_id,
        username,
        default_list_id,
        default_created_sort_id,
        default_owned_sort_id,
        featured_nft_img_url,
        featured_nft_id,
      }, // will be passed to the page component as props
    };
  } catch (err) {
    if (err.response.status == 400) {
      // Redirect to homepage
      res.writeHead(302, { location: "/" });
      res.end();
      return { props: {} };
    } else {
      res.writeHead(404);
      res.end();
      return { props: {} };
    }
  }
}

const Profile = ({
  name,
  img_url,
  wallet_addresses,
  wallet_addresses_excluding_email,
  slug_address,
  followers_list,
  following_list,
  bio,
  website_url,
  profile_id,
  username,
  default_list_id,
  default_created_sort_id,
  default_owned_sort_id,
  featured_nft_img_url,
  featured_nft_id,
}) => {
  //const router = useRouter();
  const context = useContext(AppContext);
  const { columns, gridWidth } = context;

  const [isMyProfile, setIsMyProfile] = useState();
  const [isFollowed, setIsFollowed] = useState(false);
  const [hasEmailAddress, setHasEmailAddress] = useState(false);

  useEffect(() => {
    var it_is_followed = false;
    _.forEach(context.myFollows, (follow) => {
      if (follow?.profile_id === profile_id) {
        it_is_followed = true;
      }
    });
    setIsFollowed(it_is_followed);
  }, [context.myFollows, profile_id]);

  const [createdItems, setCreatedItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [likedItems, setLikedItems] = useState([]);
  const [spotlightItem, setSpotlightItem] = useState();

  const [createdHiddenItems, setCreatedHiddenItems] = useState([]);
  const [ownedHiddenItems, setOwnedHiddenItems] = useState([]);
  const [likedHiddenItems, setLikedHiddenItems] = useState([]);

  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isRefreshingCards, setIsRefreshingCards] = useState(false);

  const [selectedCreatedSortField, setSelectedCreatedSortField] = useState(
    default_created_sort_id || 1
  );
  const [selectedOwnedSortField, setSelectedOwnedSortField] = useState(
    default_owned_sort_id || 1
  );

  // Fetch the created/owned/liked items
  const fetchItems = async (initial_load) => {
    // clear out existing from page (if switching profiles)
    if (initial_load) {
      setIsLoadingCards(true);

      setCreatedItems([]);
      setOwnedItems([]);
      setLikedItems([]);

      setCreatedHiddenItems([]);
      setOwnedHiddenItems([]);
      setLikedHiddenItems([]);
      setSpotlightItem();

      setSelectedCreatedSortField(default_created_sort_id || 1);
      setSelectedOwnedSortField(default_owned_sort_id || 1);
    }

    const response_profile = await backend.get(
      `/v2/profile_client/${slug_address}?limit=150`
    );
    const data_profile = response_profile.data.data;
    setCreatedHiddenItems(data_profile.created_hidden);
    setOwnedHiddenItems(data_profile.owned_hidden);
    setLikedHiddenItems(data_profile.liked_hidden);

    setCreatedItems(
      data_profile.created.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
        //&& !data_profile.created_hidden.includes(item.nft_id)
      )
    );
    setOwnedItems(
      data_profile.owned.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
        //&& !data_profile.owned_hidden.includes(item.nft_id)
      )
    );
    setLikedItems(
      data_profile.liked.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
        //&& !data_profile.liked_hidden.includes(item.nft_id)
      )
    );

    // look for spotlight item
    let spotlight;
    spotlight = data_profile.created.find(
      (item) => item.nft_id === featured_nft_id
    );
    if (!spotlight) {
      spotlight = data_profile.owned.find(
        (item) => item.nft_id === featured_nft_id
      );
    }
    setSpotlightItem(spotlight);
    if (initial_load) {
      setIsLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchItems(true);
  }, [profile_id]);

  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    setFollowers(followers_list);
  }, [followers_list]);

  const [following, setFollowing] = useState([]);
  useEffect(() => {
    setFollowing(following_list);
  }, [following_list]);

  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      if (context.user) {
        // Logged in?
        if (
          context.myProfile?.wallet_addresses
            .map((a) => a.toLowerCase())
            .includes(slug_address.toLowerCase()) ||
          slug_address.toLowerCase() ===
            context.myProfile?.username?.toLowerCase()
        ) {
          setIsMyProfile(true);
          if (
            wallet_addresses.length === wallet_addresses_excluding_email.length
          ) {
            setHasEmailAddress(false);
          } else {
            setHasEmailAddress(true);
          }
          mixpanel.track("Self profile view", { slug: slug_address });
        } else {
          setIsMyProfile(false);
          mixpanel.track("Profile view", { slug: slug_address });
        }
      } else {
        // Logged out
        setIsMyProfile(false);
        mixpanel.track("Profile view", { slug: slug_address });
      }
    }
  }, [
    profile_id,
    typeof context.user,
    context.myProfile,
    context.user ? context.user.publicAddress : null,
    slug_address,
  ]);

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out");
    context.setLoginModalOpen(true);
  };

  const handleFollow = async () => {
    setIsFollowed(true);
    // Change myFollows via setMyFollows
    context.setMyFollows([
      {
        profile_id: profile_id,
        wallet_address: wallet_addresses[0],
        name: name,
        img_url: img_url
          ? img_url
          : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png",
        timestamp: null,
        username: username,
      },
      ...context.myFollows,
    ]);

    setFollowers([
      {
        profile_id: context.myProfile.profile_id,
        wallet_address: context.user.publicAddress,
        name: context.myProfile.name,
        img_url: context.myProfile.img_url
          ? context.myProfile.img_url
          : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png",
        timestamp: null,
        username: context.myProfile.username,
      },
      ...followers,
    ]);

    // Post changes to the API
    await fetch(`/api/follow_v2/${profile_id}`, {
      method: "post",
    });

    mixpanel.track("Followed profile");
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter((item) => item.profile_id != profile_id)
    );

    setFollowers(
      followers.filter((follower) => {
        return context.myProfile.profile_id != follower.profile_id;
      })
    );

    // Post changes to the API
    await fetch(`/api/unfollow_v2/${profile_id}`, {
      method: "post",
    });

    mixpanel.track("Unfollowed profile");
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [pictureModalOpen, setPictureModalOpen] = useState(false);

  const [selectedGrid, setSelectedGrid] = useState(1);
  const sortFieldOptions = Object.keys(SORT_FIELDS);

  const updateCreated = async (selectedCreatedSortField, showCardRefresh) => {
    if (showCardRefresh) {
      setIsRefreshingCards(true);
    }

    const response_profile = await backend.get(
      `/v2/profile_client/${slug_address}?limit=150&tab=created&sort=${selectedCreatedSortField}`
    );
    const data_profile = response_profile.data.data;

    setCreatedItems(
      data_profile.created.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
      )
    );
    if (showCardRefresh) {
      setIsRefreshingCards(false);
    }
  };

  const updateOwned = async (selectedOwnedSortField, showCardRefresh) => {
    if (showCardRefresh) {
      setIsRefreshingCards(true);
    }

    const response_profile = await backend.get(
      `/v2/profile_client/${slug_address}?limit=150&tab=owned&sort=${selectedOwnedSortField}`
    );
    const data_profile = response_profile.data.data;

    setOwnedItems(
      data_profile.owned.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
      )
    );
    if (showCardRefresh) {
      setIsRefreshingCards(false);
    }
  };

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [openCardMenu, setOpenCardMenu] = useState(null);
  const [showUserHiddenItems, setShowUserHiddenItems] = useState(false);

  useEffect(() => {
    // if user has a default_list_id configured, use it
    if (default_list_id) {
      setSelectedGrid(default_list_id);
    } else {
      // If use doesn't have default_tab, pick first non-empty tab
      if (isLoadingCards) {
        setSelectedGrid(1);
      } else {
        if (
          createdItems.length > 0 &&
          createdItems.length >= ownedItems.length
        ) {
          setSelectedGrid(1);
        } else if (ownedItems.length > 0) {
          setSelectedGrid(2);
        } else {
          setSelectedGrid(3);
        }
      }
    }

    setShowFollowers(false);
    setShowFollowing(false);
  }, [
    profile_id,
    default_list_id,
    //createdItems.length,
    //ownedItems.length,
    isLoadingCards,
  ]);

  const handleChangeSpotlightItem = async (nft) => {
    const nftId = nft ? nft.nft_id : null;
    setSpotlightItem(nft);

    // Post changes to the API
    await fetch("/api/updatespotlight", {
      method: "post",
      body: JSON.stringify({
        nft_id: nftId,
      }),
    });
  };

  // profilePill Edit profile actions
  const editAccount = () => {
    setEditModalOpen(true);
    mixpanel.track("Open edit name");
  };

  const editPhoto = () => {
    setPictureModalOpen(true);
    mixpanel.track("Open edit photo");
  };

  const addWallet = () => {
    setWalletModalOpen(true);
    mixpanel.track("Open add wallet");
  };

  const addEmail = () => {
    setEmailModalOpen(true);
    mixpanel.track("Open add email");
  };

  const logout = async () => {
    await context.logOut();
    setIsMyProfile(false);
  };

  const FilterTabs = (
    <GridTabs>
      <GridTab
        label="Created"
        itemCount={
          isLoadingCards
            ? null
            : showUserHiddenItems
            ? createdItems.length
            : createdItems.length == 150 // go ahead and say 150+ if we are at max items
            ? 150
            : createdItems.filter(
                (item) => !createdHiddenItems.includes(item.nft_id)
              ).length
        }
        isActive={selectedGrid === 1}
        onClickTab={() => {
          setSelectedGrid(1);
        }}
      />
      <GridTab
        label="Owned"
        itemCount={
          isLoadingCards
            ? null
            : showUserHiddenItems
            ? ownedItems.length
            : ownedItems.length == 150 // go ahead and say 150+ if we are at max items
            ? 150
            : ownedItems.filter(
                (item) => !ownedHiddenItems.includes(item.nft_id)
              ).length
        }
        isActive={selectedGrid === 2}
        onClickTab={() => {
          setSelectedGrid(2);
        }}
      />
      <GridTab
        label="Liked"
        itemCount={
          isLoadingCards
            ? null
            : showUserHiddenItems
            ? likedItems.length
            : likedItems.length == 150 // go ahead and say 150+ if we are at max items
            ? 150
            : likedItems.filter(
                (item) => !likedHiddenItems.includes(item.nft_id)
              ).length
        }
        isActive={selectedGrid === 3}
        onClickTab={() => {
          setSelectedGrid(3);
        }}
      />
    </GridTabs>
  );

  return (
    <div
      onClick={() => {
        setOpenCardMenu(null);
      }}
    >
      <Layout>
        <Head>
          <title>
            {isMyProfile
              ? context.myProfile
                ? context.myProfile.name
                  ? context.myProfile.name
                  : "Unnamed"
                : name
                ? name
                : "Unnamed"
              : name
              ? name
              : "Unnamed"}
          </title>

          <meta
            name="description"
            content="Explore crypto art I've created, owned, and liked"
          />
          <meta property="og:type" content="website" />
          <meta
            name="og:description"
            content="Explore crypto art I've created, owned, and liked"
          />
          <meta
            property="og:image"
            content={
              featured_nft_img_url
                ? featured_nft_img_url
                : img_url
                ? img_url
                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
            }
          />
          <meta name="og:title" content={name ? name : wallet_addresses[0]} />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={name ? name : wallet_addresses[0]}
          />
          <meta
            name="twitter:description"
            content="Explore crypto art I've created, owned, and liked"
          />
          <meta
            name="twitter:image"
            content={
              featured_nft_img_url
                ? featured_nft_img_url
                : img_url
                ? img_url
                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
            }
          />
        </Head>

        {typeof document !== "undefined" ? (
          <>
            <ModalAddWallet
              isOpen={walletModalOpen}
              setWalletModalOpen={setWalletModalOpen}
              walletAddresses={wallet_addresses}
            />
            <ModalAddEmail
              isOpen={emailModalOpen}
              setEmailModalOpen={setEmailModalOpen}
              walletAddresses={wallet_addresses}
              setHasEmailAddress={setHasEmailAddress}
            />
            <ModalEditProfile
              isOpen={editModalOpen}
              setEditModalOpen={setEditModalOpen}
            />
            <ModalEditPhoto
              isOpen={pictureModalOpen}
              setEditModalOpen={setPictureModalOpen}
            />
            {/* Followers modal */}
            <ModalUserList
              title="Followers"
              isOpen={showFollowers}
              users={followers ? followers : []}
              closeModal={() => {
                setShowFollowers(false);
              }}
              emptyMessage="No followers yet."
            />
            {/* Following modal */}
            <ModalUserList
              title="Following"
              isOpen={showFollowing}
              users={following ? following : []}
              closeModal={() => {
                setShowFollowing(false);
              }}
              emptyMessage="Not following anyone yet."
            />
          </>
        ) : null}

        {/* Start Page Body */}
        {/* Wait until @gridWidth is populated to display page's body */}

        {gridWidth && (
          <div className="m-auto relative" style={{ width: gridWidth }}>
            <div
              style={
                context.columns == 1
                  ? { marginLeft: 16, marginRight: 16 }
                  : { marginLeft: 12, marginRight: 12 }
              }
            >
              <h1
                style={{ wordWrap: "break-word" }}
                className={`text-4xl md:text-6xl sm:mb-2 text-center md:text-left mt-12 sm:mt-20 ${
                  (wallet_addresses_excluding_email.length === 0 ||
                    context.columns === 1) &&
                  !username
                    ? "mb-8"
                    : "mb-0"
                }`}
              >
                {isMyProfile
                  ? context.myProfile
                    ? context.myProfile.name
                      ? context.myProfile.name
                      : "Unnamed"
                    : name
                    ? name
                    : "Unnamed"
                  : name
                  ? name
                  : "Unnamed"}
              </h1>
              {(username ||
                (wallet_addresses_excluding_email.length > 0 &&
                  context.columns > 1)) && (
                <div className="flex flex-row justify-center items-center md:justify-start mb-12">
                  {username && (
                    <div className="mr-2 text-base text-gray-500">
                      @{username}
                    </div>
                  )}
                  {context.columns === 1 ? null : (
                    <div className="flex mr-2 md:mr-0">
                      {wallet_addresses_excluding_email.map((address) => {
                        return (
                          <AddressButton key={address} address={address} />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {gridWidth && (
          <div className="m-auto" style={{ width: gridWidth }}>
            <div
              style={
                context.columns == 1
                  ? { marginLeft: 16, marginRight: 16 }
                  : { marginLeft: 12, marginRight: 12 }
              }
            >
              <div
                className={`${
                  isMyProfile && context.myProfile
                    ? !context.myProfile.bio && !context.myProfile.website_url
                      ? "hidden"
                      : "flex-1"
                    : !bio && !website_url
                    ? "hidden"
                    : "flex-1"
                } mt-4 pb-2 text-base align-center flex flex-col justify-center items-center md:items-start`}
              >
                {/*<h4 className="text-black mb-2 text-lg font-semibold">About</h4>*/}
                {isMyProfile && context.myProfile ? (
                  context.myProfile.bio ? (
                    <div className="max-w-xl">
                      <div className="text-center md:text-left">
                        {context.myProfile.bio}
                      </div>
                    </div>
                  ) : null
                ) : bio ? (
                  <div className="max-w-xl">
                    <div className="text-center md:text-left">
                      <div className="">{bio}</div>
                    </div>
                  </div>
                ) : null}

                {isMyProfile && context.myProfile ? (
                  context.myProfile.website_url ? (
                    <a
                      href={
                        context.myProfile.website_url.slice(0, 4) === "http"
                          ? context.myProfile.website_url
                          : "https://" + context.myProfile.website_url
                      }
                      target="_blank"
                      className="flex flex-row items-center justify-center"
                      style={{ color: "rgb(81, 125, 228)" }}
                      onClick={() => {
                        mixpanel.track("Clicked profile website link", {
                          slug: slug_address,
                        });
                      }}
                    >
                      <div style={{ wordBreak: "break-all" }}>
                        {context.myProfile.website_url}
                      </div>
                    </a>
                  ) : null
                ) : website_url ? (
                  <a
                    href={
                      website_url.slice(0, 4) === "http"
                        ? website_url
                        : "https://" + website_url
                    }
                    target="_blank"
                    className="flex flex-row"
                    style={{ color: "rgb(81, 125, 228)" }}
                    onClick={() => {
                      mixpanel.track("Clicked profile website link", {
                        slug: slug_address,
                      });
                    }}
                  >
                    <div style={{ wordBreak: "break-all" }}>{website_url}</div>
                  </a>
                ) : null}
              </div>

              <ProfileInfoPill
                isFollowed={isFollowed}
                isMyProfile={isMyProfile}
                onClickFollow={
                  context.user
                    ? isFollowed
                      ? handleUnfollow
                      : handleFollow
                    : handleLoggedOutFollow
                }
                onClickPhoto={() => {
                  setPictureModalOpen(true);
                  mixpanel.track("Open edit photo");
                }}
                numFollowers={followers && followers.length}
                numFollowing={following && following.length}
                showFollowers={() => {
                  setShowFollowers(true);
                }}
                showFollowing={() => {
                  setShowFollowing(true);
                }}
                profileImageUrl={
                  isMyProfile
                    ? context.myProfile && context.myProfile.img_url
                      ? context.myProfile.img_url
                      : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                    : img_url
                    ? img_url
                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                }
                profileActions={{
                  editAccount,
                  editPhoto,
                  addWallet,
                  addEmail,
                  logout,
                }}
                hasEmailAddress={hasEmailAddress}
              />
            </div>
            {featured_nft_id && spotlightItem && (
              <>
                <div className="mx-auto" style={{ width: gridWidth }}>
                  <div
                    style={
                      context.isMobile
                        ? { padding: "0px 16px 20px 16px" }
                        : { padding: "0px 12px 0px 12px" }
                    }
                  >
                    <div
                      className="mt-8"
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <div
                        className="flex flex-row"
                        style={{
                          width: "max-content",
                          padding: "15px 0px",
                          marginRight: 25,
                          whiteSpace: "nowrap",
                          borderBottom: "3px solid #e45cff",
                          transition: "all 300ms ease",
                          color: "#e45cff",
                        }}
                      >
                        <div>Spotlight</div>
                        <div>
                          <img
                            src="/icons/spotlight_flip.png"
                            style={{
                              height: 20,
                              width: 20,
                              marginLeft: 8,
                            }}
                            width={20}
                            height={20}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mx-auto flex flex-col justify-center items-center md:items-start"
                  style={{
                    maxWidth: context.columns == 4 ? 1185 : gridWidth,
                  }}
                >
                  <SpotlightItem
                    item={spotlightItem}
                    removeSpotlightItem={() => handleChangeSpotlightItem(null)}
                    isMyProfile={isMyProfile}
                    openCardMenu={openCardMenu}
                    setOpenCardMenu={setOpenCardMenu}
                    listId={0}
                    refreshItems={() => {
                      updateCreated(selectedCreatedSortField, false);
                      updateOwned(selectedOwnedSortField, false);
                    }}
                  />
                </div>
              </>
            )}

            <div
              className="mx-auto"
              style={
                context.isMobile && featured_nft_id && spotlightItem
                  ? { width: gridWidth, borderTopWidth: 1 }
                  : { width: gridWidth }
              }
            >
              <div className="pt-4">{FilterTabs}</div>

              <div>
                {isMyProfile ? (
                  <div className="flex">
                    <div className="flex-grow"></div>
                    <div
                      className="text-right pr-4 text-sm hidden-items-link pb-1"
                      onClick={() => {
                        setShowUserHiddenItems(!showUserHiddenItems);
                      }}
                      style={{
                        fontWeight: 400,
                        fontSize: 12,
                        marginTop: -65,
                      }}
                    >
                      {createdHiddenItems.length === 0 &&
                      ownedHiddenItems.length === 0 &&
                      likedHiddenItems.length === 0
                        ? null
                        : showUserHiddenItems
                        ? "Hide hidden"
                        : "Show hidden"}
                    </div>
                  </div>
                ) : null}
              </div>

              {!isLoadingCards && (
                <div
                  className={`flex items-center text-sm rounded-md md:text-base ${
                    selectedGrid === 3
                      ? "invisible"
                      : selectedGrid === 1 &&
                        createdItems.filter(
                          (item) => !createdHiddenItems.includes(item.nft_id)
                        ).length === 0
                      ? "invisible"
                      : selectedGrid === 2 &&
                        ownedItems.filter(
                          (item) => !ownedHiddenItems.includes(item.nft_id)
                        ).length === 0
                      ? "invisible"
                      : null
                  }`}
                  style={
                    context.columns === 1
                      ? { marginTop: -12, marginRight: 16, marginBottom: 8 }
                      : { marginTop: -20, marginRight: 12, marginBottom: 0 }
                  }
                >
                  <div className="flex-1"></div>
                  <div className="py-2 px-2 w-max cursor-pointer mr-1">
                    Sort by:
                  </div>

                  <Select
                    options={sortFieldOptions.map((key) => SORT_FIELDS[key])}
                    labelField="label"
                    valueField="key"
                    values={[
                      SORT_FIELDS[
                        sortFieldOptions[
                          selectedGrid === 1
                            ? selectedCreatedSortField - 1
                            : selectedOwnedSortField - 1
                        ]
                      ],
                    ]}
                    searchable={false}
                    onChange={(values) => {
                      if (selectedGrid === 1) {
                        setSelectedCreatedSortField(values[0]["id"]);
                        updateCreated(values[0]["id"], true);
                      } else {
                        setSelectedOwnedSortField(values[0]["id"]);
                        updateOwned(values[0]["id"], true);
                      }
                    }}
                    style={
                      context.columns === 1
                        ? {
                            fontSize: 14,
                            width: 140,
                          }
                        : {
                            fontSize: 16,
                            width: 150,
                          }
                    }
                    key={selectedGrid}
                  />
                </div>
              )}
            </div>

            <TokenGridV4
              items={
                selectedGrid === 1
                  ? createdItems
                  : selectedGrid === 2
                  ? ownedItems
                  : selectedGrid === 3
                  ? likedItems
                  : null
              }
              isLoading={isLoadingCards || isRefreshingCards}
              listId={
                selectedGrid === 1
                  ? 1
                  : selectedGrid === 2
                  ? 2
                  : selectedGrid === 3
                  ? 3
                  : null
              }
              isMyProfile={isMyProfile}
              openCardMenu={openCardMenu}
              setOpenCardMenu={setOpenCardMenu}
              userHiddenItems={
                selectedGrid === 1
                  ? createdHiddenItems
                  : selectedGrid === 2
                  ? ownedHiddenItems
                  : selectedGrid === 3
                  ? likedHiddenItems
                  : null
              }
              setUserHiddenItems={
                selectedGrid === 1
                  ? setCreatedHiddenItems
                  : selectedGrid === 2
                  ? setOwnedHiddenItems
                  : selectedGrid === 3
                  ? setLikedHiddenItems
                  : null
              }
              showUserHiddenItems={showUserHiddenItems}
              refreshItems={
                selectedGrid === 1
                  ? () => updateCreated(selectedCreatedSortField, false)
                  : () => updateOwned(selectedOwnedSortField, false)
              }
              changeSpotlightItem={handleChangeSpotlightItem}
            />
          </div>
        )}
        {/* End Page Body */}
      </Layout>
    </div>
  );
};

export default Profile;
