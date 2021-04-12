import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import Layout from "../components/layout";
import CappedWidth from "../components/CappedWidth";
import TokenGridV4 from "../components/TokenGridV4";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import ModalEditProfile from "../components/ModalEditProfile";
import ModalEditPhoto from "../components/ModalEditPhoto";
//import { GridTabs, GridTab } from "../components/GridTabs";
import ModalUserList from "../components/ModalUserList";
import ModalAddWallet from "../components/ModalAddWallet";
import ModalAddEmail from "../components/ModalAddEmail.js";
import { formatAddressShort } from "../lib/utilities";
import AddressButton from "../components/AddressButton";
import { SORT_FIELDS } from "../lib/constants";
import Select from "react-dropdown-select";
import SpotlightItem from "../components/SpotlightItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faComment as fasComment,
  faHeart as fasHeart,
  faFingerprint,
  faUser,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

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

    const featured_nft = data_profile.featured_nft;

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
        featured_nft,
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
  featured_nft,
}) => {
  //const router = useRouter();
  const context = useContext(AppContext);

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
      setSpotlightItem(featured_nft);
      setIsLoadingCards(true);

      setCreatedItems([]);
      setOwnedItems([]);
      setLikedItems([]);

      setCreatedHiddenItems([]);
      setOwnedHiddenItems([]);
      setLikedHiddenItems([]);
      //setSpotlightItem();

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
    if (initial_load) {
      setIsLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchItems(true);
  }, [profile_id]);

  useEffect(() => {
    if (
      following_list
        .map((item) => item.profile_id)
        .includes(context.myProfile?.profile_id)
    ) {
      setFollowingMe(true);
    } else {
      setFollowingMe(false);
    }
  }, [following_list, context.myProfile?.profile_id]);

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
  const [followingMe, setFollowingMe] = useState(false);

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

  /*const FilterTabs = (
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
  );*/

  const gridRef = useRef();

  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onEditProfileClick = () => setIsActive(!isActive);

  const createdCount = isLoadingCards
    ? null
    : showUserHiddenItems
    ? createdItems.length
    : createdItems.length == 150 // go ahead and say 150+ if we are at max items
    ? 150
    : createdItems.filter((item) => !createdHiddenItems.includes(item.nft_id))
        .length;

  const ownedCount = isLoadingCards
    ? null
    : showUserHiddenItems
    ? ownedItems.length
    : ownedItems.length == 150 // go ahead and say 150+ if we are at max items
    ? 150
    : ownedItems.filter((item) => !ownedHiddenItems.includes(item.nft_id))
        .length;

  const likedCount = isLoadingCards
    ? null
    : showUserHiddenItems
    ? likedItems.length
    : likedItems.length == 150 // go ahead and say 150+ if we are at max items
    ? 150
    : likedItems.filter((item) => !likedHiddenItems.includes(item.nft_id))
        .length;

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

        <div
          style={{
            background: "linear-gradient(to left, #0186CC, #8145B3)",
          }}
          className="py-6 md:pl-10 text-left" //  bg-gradient-to-r from-gray-900 to-gray-500
        >
          <CappedWidth>
            <div className="flex flex-col md:flex-row text-white items-center pb-3 pt-3">
              <div className="flex-0 py-8">
                <img
                  onClick={() => {
                    if (isMyProfile) {
                      setPictureModalOpen(true);
                      mixpanel.track("Open edit photo");
                    }
                  }}
                  src={
                    isMyProfile
                      ? context.myProfile && context.myProfile.img_url
                        ? context.myProfile.img_url
                        : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                      : img_url
                      ? img_url
                      : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                  }
                  className={`h-24 w-24 rounded-full md:mr-4 border-2 border-white overflow-hidden ${
                    isMyProfile
                      ? "cursor-pointer hover:opacity-90 transition"
                      : ""
                  }`}
                />
              </div>
              <div
                className="flex-1"
                style={{ whiteSpace: "break-spaces", wordBreak: "break-word" }}
              >
                <div className="text-2xl md:text-6xl mb-1 text-center md:text-left max-w-full">
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
                </div>
                <div>
                  {(username ||
                    wallet_addresses_excluding_email.length > 0) && (
                    <div className="flex flex-col md:flex-row items-center justify-start">
                      {username && (
                        <div className="md:mr-2 text-base opacity-80">
                          @{username}
                        </div>
                      )}

                      <div className="flex ml-1">
                        {wallet_addresses_excluding_email.map((address) => {
                          return (
                            <AddressButton key={address} address={address} />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CappedWidth>
        </div>

        <CappedWidth>
          <div className="flex flex-row -mt-8 mx-3">
            <div className="opacity-100 w-full md:w-max mt-4 bg-white rounded-lg shadow-md px-4 py-4 md:py-3 text-center text-gray-900">
              <div className="flex flex-col md:flex-row text-center items-center">
                <div
                  className={`flex-1 ${
                    following?.length > 999 ? null : "w-28"
                  }  flex flex-col md:flex-row items-center cursor-pointer hover:opacity-80 mb-4 md:mb-0`}
                  onClick={() => {
                    setShowFollowing(true);
                  }}
                >
                  <div className="flex-grow"></div>
                  <div className="text-lg mr-2">
                    {following && following.length !== null
                      ? Number(following.length).toLocaleString()
                      : null}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                  <div className="flex-grow"></div>
                </div>
                {!context.isMobile && (
                  <div
                    className="border-r border-gray-400 mx-4"
                    style={{ width: 2, height: 20 }}
                  ></div>
                )}
                <div
                  className={`flex-1 ${
                    followers?.length > 999 ? null : "w-28"
                  }  flex flex-col md:flex-row items-center cursor-pointer hover:opacity-80 mb-4 md:mb-0`}
                  onClick={() => {
                    setShowFollowers(true);
                  }}
                >
                  <div className="flex-grow"></div>
                  <div className="text-lg mr-2">
                    {followers && followers.length !== null
                      ? Number(followers.length).toLocaleString()
                      : null}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                  <div className="flex-grow"></div>
                </div>
                {!context.isMobile && (
                  <div
                    className="border-r border-gray-400 mx-4"
                    style={{ width: 2, height: 20 }}
                  ></div>
                )}
                <div className="flex-1 w-36 flex flex-row items-center relative">
                  <div className="flex-grow"></div>

                  {!isMyProfile ? (
                    <div
                      className={`w-32 py-2 rounded-full text-sm cursor-pointer hover:opacity-80 transition-all ${
                        isFollowed
                          ? "bg-white text-gray-600 border border-gray-500"
                          : "bg-black text-white border border-black"
                      }  `}
                      onClick={
                        context.user
                          ? isFollowed
                            ? handleUnfollow
                            : handleFollow
                          : handleLoggedOutFollow
                      }
                    >
                      {isFollowed
                        ? "Following"
                        : followingMe
                        ? "Follow Back"
                        : "Follow"}
                    </div>
                  ) : (
                    <>
                      <div
                        className="w-32 py-2 rounded-full text-sm cursor-pointer hover:opacity-80 transition-all bg-white text-black border border-black"
                        onClick={onEditProfileClick}
                      >
                        Edit Profile
                      </div>

                      <div
                        ref={dropdownRef}
                        className={`absolute text-center top-12 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-md transform ${
                          isActive
                            ? "visible opacity-1 translate-y-2"
                            : "invisible opacity-0"
                        }`}
                        style={{ zIndex: 1 }}
                      >
                        <div
                          className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                          onClick={() => {
                            setIsActive(false);
                            editAccount();
                          }}
                        >
                          Edit Info
                        </div>
                        <div
                          className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                          onClick={() => {
                            setIsActive(false);
                            editPhoto();
                          }}
                        >
                          {context.myProfile &&
                          context.myProfile.img_url &&
                          !context.myProfile.img_url.includes("opensea-profile")
                            ? "Edit Photo"
                            : "Add Photo"}
                        </div>
                        <div
                          className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                          onClick={() => {
                            setIsActive(false);
                            addWallet();
                          }}
                        >
                          Add Wallet
                        </div>
                        {hasEmailAddress ? null : (
                          <div
                            className="py-2 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                            onClick={() => {
                              setIsActive(false);
                              addEmail();
                            }}
                          >
                            Add Email
                          </div>
                        )}
                        <div
                          className="py-2 px-8 hover:text-stpink hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap transition-all"
                          onClick={() => {
                            setIsActive(false);
                            logout();
                          }}
                        >
                          Log Out
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex-grow"></div>
                </div>
              </div>
            </div>
            <div className="flex-grow"></div>
          </div>

          <div className="px-3 mt-8">
            {isMyProfile && context.myProfile?.bio ? (
              <div className="text-gray-500 flex flex-row">
                <div>
                  <FontAwesomeIcon
                    style={{ height: 16, width: 16 }}
                    className="mr-2 ml-2"
                    icon={faUser}
                  />
                </div>
                <div>{context.myProfile.bio}</div>
              </div>
            ) : null}

            {!isMyProfile && bio ? (
              <div className="text-gray-500 flex flex-row">
                <div>
                  <FontAwesomeIcon
                    style={{ height: 16, width: 16 }}
                    className="mr-2 ml-2"
                    icon={faUser}
                  />
                </div>
                <div>{bio}</div>
              </div>
            ) : null}

            {isMyProfile && context?.myProfile?.website_url ? (
              <div
                className={`text-gray-500 flex flex-row ${
                  isMyProfile && context?.myProfile?.bio ? "mt-1" : null
                }
            `}
              >
                <div>
                  <FontAwesomeIcon
                    style={{ height: 16, width: 16 }}
                    className="mr-2 ml-2"
                    icon={faLink}
                  />{" "}
                </div>
                <div>
                  <a
                    href={
                      context.myProfile.website_url.slice(0, 4) === "http"
                        ? context.myProfile.website_url
                        : "https://" + context.myProfile.website_url
                    }
                    target="_blank"
                    style={{ color: "rgb(81, 125, 228)" }}
                    onClick={() => {
                      mixpanel.track("Clicked profile website link", {
                        slug: slug_address,
                      });
                    }}
                  >
                    <div
                      className="hover:opacity-90"
                      style={{ wordBreak: "break-all" }}
                    >
                      {context.myProfile.website_url}
                    </div>
                  </a>
                </div>
              </div>
            ) : null}

            {!isMyProfile && website_url ? (
              <div
                className={`text-gray-500 flex flex-row ${
                  !isMyProfile && bio ? "mt-1" : null
                }
            `}
              >
                <div>
                  <FontAwesomeIcon
                    style={{ height: 16, width: 16 }}
                    className="mr-2 ml-2"
                    icon={faLink}
                  />{" "}
                </div>
                <div>
                  <a
                    href={
                      website_url.slice(0, 4) === "http"
                        ? website_url
                        : "https://" + website_url
                    }
                    target="_blank"
                    style={{ color: "rgb(81, 125, 228)" }}
                    onClick={() => {
                      mixpanel.track("Clicked profile website link", {
                        slug: slug_address,
                      });
                    }}
                  >
                    <div
                      className="hover:opacity-90"
                      style={{ wordBreak: "break-all" }}
                    >
                      {website_url}
                    </div>
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </CappedWidth>
        {spotlightItem ? (
          <div className="mt-8 md:mt-16">
            <div className="relative bg-white border-t border-b border-gray-200 py-16 pb-8 md:pb-16 mb-4">
              <SpotlightItem
                item={spotlightItem}
                removeSpotlightItem={() => {
                  handleChangeSpotlightItem(null);
                  mixpanel.track("Removed Spotlight Item");
                }}
                isMyProfile={isMyProfile}
                openCardMenu={openCardMenu}
                setOpenCardMenu={setOpenCardMenu}
                listId={0}
                refreshItems={() => {
                  updateCreated(selectedCreatedSortField, false);
                  updateOwned(selectedOwnedSortField, false);
                }}
                key={spotlightItem.nft_id}
              />
            </div>
          </div>
        ) : null}
        <CappedWidth>
          <div className="m-auto">
            {/*<div className="py-12 px-3 ">
              <hr />
          </div>*/}
            <div
              ref={gridRef}
              className="grid lg:grid-cols-3 xl:grid-cols-4 pt-0"
            >
              <div className="px-3">
                <div className="h-max sticky top-24 ">
                  <div className="px-4 py-4 rounded-lg bg-white shadow-md mt-16 mb-4 md:mb-0">
                    <div className="border-b border-gray-200 mx-2 mb-2 pb-4 flex flex-row items-center">
                      <div className="mr-2">
                        <img
                          src={
                            isMyProfile
                              ? context.myProfile && context.myProfile.img_url
                                ? context.myProfile.img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                              : img_url
                              ? img_url
                              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          style={{ width: 22, height: 22 }}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        {isMyProfile
                          ? context.myProfile?.name
                            ? context.myProfile?.name
                            : wallet_addresses_excluding_email &&
                              wallet_addresses_excluding_email.length > 0
                            ? formatAddressShort(
                                wallet_addresses_excluding_email[0]
                              )
                            : "Unnamed"
                          : null}
                        {!isMyProfile
                          ? name != "Unnamed"
                            ? name
                            : wallet_addresses_excluding_email &&
                              wallet_addresses_excluding_email.length > 0
                            ? formatAddressShort(
                                wallet_addresses_excluding_email[0]
                              )
                            : "Unnamed"
                          : null}
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedGrid(1);
                        if (gridRef?.current?.getBoundingClientRect().top < 0) {
                          window.scroll({
                            top: gridRef?.current?.offsetTop + 30,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`hover:bg-stpurple100 p-2 mb-1 rounded-lg px-3 ${
                        selectedGrid === 1
                          ? "text-stpurple700 bg-stpurple100"
                          : "text-gray-500"
                      } hover:text-stpurple700 cursor-pointer flex flex-row transition-all items-center`}
                    >
                      <FontAwesomeIcon
                        icon={faFingerprint}
                        className="mr-2 w-4 h-4"
                      />

                      <div>Created</div>
                      <div className="flex-grow"></div>
                      <div className="rounded-full text-center text-sm">
                        {createdCount}
                        <span
                          className={
                            createdCount == 150 ? "visible" : "invisible"
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedGrid(2);
                        if (gridRef?.current?.getBoundingClientRect().top < 0) {
                          window.scroll({
                            top: gridRef?.current?.offsetTop + 30,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`hover:bg-stteal100 mb-1 p-2 rounded-lg px-3 ${
                        selectedGrid === 2
                          ? "text-stteal700 bg-stteal100"
                          : "text-gray-500"
                      } hover:text-stteal700 cursor-pointer flex flex-row transition-all items-center`}
                    >
                      <FontAwesomeIcon
                        icon={selectedGrid === 2 ? fasComment : faComment}
                        className="mr-2 w-4 h-4"
                      />
                      <div>Owned</div>
                      <div className="flex-grow"></div>
                      <div className="rounded-full text-center text-sm">
                        {ownedCount}
                        <span
                          className={
                            ownedCount == 150 ? "visible" : "invisible"
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedGrid(3);
                        if (gridRef?.current?.getBoundingClientRect().top < 0) {
                          window.scroll({
                            top: gridRef?.current?.offsetTop + 30,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`hover:bg-stred100 p-2 rounded-lg px-3 ${
                        selectedGrid === 3
                          ? "text-stred bg-stred100"
                          : "text-gray-500"
                      } hover:text-stred cursor-pointer flex flex-row transition-all items-center`}
                    >
                      <FontAwesomeIcon
                        icon={selectedGrid === 3 ? fasHeart : faHeart}
                        className="mr-2 w-4 h-4"
                      />
                      <div>Liked</div>
                      <div className="flex-grow"></div>
                      <div className="rounded-full text-center text-sm">
                        {likedCount}
                        <span
                          className={
                            likedCount == 150 ? "visible" : "invisible"
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {isMyProfile ? (
                      <div className="flex">
                        <div className="flex-grow"></div>
                        <div
                          className="text-right text-xs mt-3 ml-6 mr-1 text-gray-400 cursor-pointer hover:text-gray-700"
                          onClick={() => {
                            setShowUserHiddenItems(!showUserHiddenItems);
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
                </div>
              </div>
              <div className="lg:col-span-2 xl:col-span-3 min-h-screen">
                {!isLoadingCards && (
                  <div
                    className={`flex h-12 items-center px-3 my-2  md:text-base ${
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
                  >
                    <div className="flex-1"></div>
                    <div className="py-2 px-2 mr-1 text-sm text-gray-500">
                      Sort by:
                    </div>

                    <Select
                      className="text-sm"
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
                      key={selectedGrid}
                    />
                  </div>
                )}

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
                  detailsModalCloseOnKeyChange={slug_address}
                  changeSpotlightItem={handleChangeSpotlightItem}
                />
              </div>
            </div>
          </div>
          {/* End Page Body */}
        </CappedWidth>
      </Layout>
    </div>
  );
};

export default Profile;
