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
import ModalEditCover from "../components/ModalEditCover";
import ModalUserList from "../components/ModalUserList";
import ModalAddWallet from "../components/ModalAddWallet";
import ModalAddEmail from "../components/ModalAddEmail.js";
import {
  formatAddressShort,
  removeTags,
  truncateWithEllipses,
} from "../lib/utilities";
import AddressButton from "../components/AddressButton";
import { SORT_FIELDS } from "../lib/constants";
import Select from "react-dropdown-select";
import SpotlightItem from "../components/SpotlightItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faImage } from "@fortawesome/free-regular-svg-icons";
import ProfileFollowersPill from "../components/ProfileFollowersPill";
import {
  faHeart as fasHeart,
  faFingerprint,
  faLink,
  faImage as fasImage,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const initialBioLength = 160;

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
    const cover_url = data_profile.profile.cover_url;
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
    const featured_nft_img_url = data_profile.profile.featured_nft_img_url;
    const featured_nft = data_profile.featured_nft;
    const links = data_profile.profile.links;

    return {
      props: {
        name,
        img_url,
        cover_url,
        wallet_addresses,
        wallet_addresses_excluding_email,
        slug_address,
        followers_list,
        following_list,
        bio,
        profile_id,
        username,
        default_list_id,
        default_created_sort_id,
        default_owned_sort_id,
        featured_nft_img_url,
        featured_nft,
        website_url,
        links,
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
  cover_url,
  wallet_addresses,
  wallet_addresses_excluding_email,
  slug_address,
  followers_list,
  following_list,
  bio,
  profile_id,
  username,
  default_list_id,
  default_created_sort_id,
  default_owned_sort_id,
  featured_nft_img_url,
  featured_nft,
  website_url,
  links,
}) => {
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
  //const [hasSpotlightItem, setHasSpotlightItem] = useState(false);

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
      //setHasSpotlightItem(featured_nft ? true : false);
      setMoreBioShown(false);
      setIsLoadingCards(true);

      setCreatedItems([]);
      setOwnedItems([]);
      setLikedItems([]);

      setCreatedHiddenItems([]);
      setOwnedHiddenItems([]);
      setLikedHiddenItems([]);

      setSpotlightItem(featured_nft);
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
  const [coverModalOpen, setCoverModalOpen] = useState(false);
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

  const gridRef = useRef();

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

  const [moreBioShown, setMoreBioShown] = useState(false);

  const likedCount = isLoadingCards
    ? null
    : showUserHiddenItems
    ? likedItems.length
    : likedItems.length == 150 // go ahead and say 150+ if we are at max items
    ? 150
    : likedItems.filter((item) => !likedHiddenItems.includes(item.nft_id))
        .length;

  const profileToDisplay = isMyProfile
    ? context.myProfile
    : {
        name,
        website_url,
        bio,
        img_url,
        cover_url,
        username,
        links: links.map((link) => ({
          name: link.type__name,
          prefix: link.type__prefix,
          icon_url: link.type__icon_url,
          type_id: link.type_id,
          user_input: link.user_input,
        })),
        wallet_addresses_excluding_email,
      };

  const [showSocialLinks, setShowSocialLinks] = useState(false);

  useEffect(() => {
    if (context.isMobile === true) {
      profileToDisplay?.links?.length > 2 ||
      (profileToDisplay?.links?.length > 1 && profileToDisplay?.website_url)
        ? setShowSocialLinks(false)
        : setShowSocialLinks(true);
    } else {
      setShowSocialLinks(true);
    }
  }, [context?.isMobile, isLoadingCards]);

  const toggleShowSocialLinks = () => {
    setShowSocialLinks(!showSocialLinks);
  };

  return (
    <div
      onClick={() => {
        setOpenCardMenu(null);
      }}
    >
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
          {editModalOpen && (
            <ModalEditProfile
              isOpen={editModalOpen}
              setEditModalOpen={setEditModalOpen}
            />
          )}
          <ModalEditPhoto
            isOpen={pictureModalOpen}
            setEditModalOpen={setPictureModalOpen}
          />
          <ModalEditCover
            isOpen={coverModalOpen}
            setEditModalOpen={setCoverModalOpen}
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
      <Layout>
        <Head>
          <title>
            {profileToDisplay?.name ? profileToDisplay.name : "Unnamed"}
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

        <div
          className="h-48 relative py-6 md:pl-10 text-left bg-gradient-to-b from-black to-gray-800"
          style={
            profileToDisplay?.cover_url
              ? {
                  backgroundImage: `url(${profileToDisplay.cover_url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                }
              : {}
          }
        >
          {isMyProfile && (
            <div
              className="absolute top-2 right-2 text-white text-sm cursor-pointer bg-black bg-opacity-50 py-1 px-2 rounded-lg hover:bg-opacity-80"
              onClick={() => {
                if (isMyProfile) {
                  setCoverModalOpen(true);
                  mixpanel.track("Open edit cover photo");
                }
              }}
            >
              Change Cover
            </div>
          )}
        </div>
        <CappedWidth>
          <div className="relative">
            <div className="flex sm:pb-2 -mt-14 justify-center sm:justify-start px-3">
              <img
                onClick={() => {
                  if (isMyProfile) {
                    setPictureModalOpen(true);
                    mixpanel.track("Open edit photo");
                  }
                }}
                src={
                  profileToDisplay?.img_url
                    ? profileToDisplay.img_url
                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                }
                className={`h-32 w-32 rounded-full md:mr-4 border-2 border-white overflow-hidden ${
                  isMyProfile
                    ? "cursor-pointer hover:opacity-90 transition"
                    : ""
                }`}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row text-black items-center pb-6 sm:pb-3 pt-3 sm:mx-3">
            <div
              className="flex-1"
              style={{ whiteSpace: "break-spaces", wordBreak: "break-word" }}
            >
              <div className="text-2xl md:text-6xl mt-1 sm:mt-0 sm:mb-1 text-center md:text-left max-w-full">
                {profileToDisplay?.name
                  ? profileToDisplay.name
                  : wallet_addresses_excluding_email &&
                    wallet_addresses_excluding_email.length > 0
                  ? formatAddressShort(wallet_addresses_excluding_email[0])
                  : "Unnamed"}
              </div>
              <div className="my-1">
                {(username || wallet_addresses_excluding_email.length > 0) && (
                  <div className="flex flex-col md:flex-row items-center justify-start">
                    {username && (
                      <div className="md:mr-2 text-base text-gray-500">
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

        <CappedWidth>
          <div className="flex flex-row mx-3 relative">
            <div className="w-full md:w-max">
              <ProfileFollowersPill
                following={following}
                followers={followers}
                isFollowed={isFollowed}
                isMyProfile={isMyProfile}
                followingMe={followingMe}
                handleUnfollow={handleUnfollow}
                handleFollow={handleFollow}
                handleLoggedOutFollow={handleLoggedOutFollow}
                hasEmailAddress={hasEmailAddress}
                setShowFollowers={setShowFollowers}
                setShowFollowing={setShowFollowing}
                editAccount={editAccount}
                editPhoto={editPhoto}
                addWallet={addWallet}
                addEmail={addEmail}
                logout={logout}
              />
            </div>
            <div className="flex-grow"></div>
          </div>

          <div className="px-6 sm:px-1 mt-2 ">
            {/* Use context info for logged in user - reflected immediately after changes */}
            {profileToDisplay?.bio ? (
              // <div className="text-gray-500 flex flex-row">
              //   <div className="max-w-prose text-sm sm:text-base">
              //     {context.myProfile.bio}
              //   </div>
              // </div>
              <div
                style={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  display: "block",
                }}
                className="text-black text-sm max-w-prose text-center md:text-left md:ml-2 md:text-base"
              >
                {moreBioShown
                  ? profileToDisplay.bio
                  : truncateWithEllipses(
                      profileToDisplay.bio,
                      initialBioLength
                    )}
                {!moreBioShown &&
                  profileToDisplay?.bio &&
                  profileToDisplay.bio.length > initialBioLength && (
                    <a
                      onClick={() => setMoreBioShown(true)}
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {" "}
                      more
                    </a>
                  )}
              </div>
            ) : null}

            {/* Use context info for logged in user - reflected immediately after changes */}
            {context.isMobile &&
            (profileToDisplay?.links?.length > 2 ||
              (profileToDisplay?.links?.length > 1 &&
                profileToDisplay?.website_url)) ? (
              <div
                className={`flex cursor-pointer items-center hover:opacity-70 justify-center text-gray-600 text-sm  md:justify-start ${
                  profileToDisplay?.bio ? "mt-3" : ""
                }`}
                onClick={toggleShowSocialLinks}
              >
                <div className="mr-1">View links</div>{" "}
                <div
                  className={`transition-all ${
                    showSocialLinks ? "transform rotate-90" : "rotate-0"
                  }`}
                >
                  <FontAwesomeIcon
                    style={{ height: 14, width: 14 }}
                    className=""
                    icon={faArrowRight}
                  />{" "}
                </div>
              </div>
            ) : null}

            <div
              className={`md:ml-2 flex flex-wrap max-w-prose items-center justify-center md:justify-start ${
                showSocialLinks
                  ? "visible opacity-1 translate-y-2"
                  : "invisible opacity-0 translate-y-0 h-0"
              } transition-all transform md:mt-3`}
            >
              {profileToDisplay?.website_url ? (
                <a
                  href={
                    profileToDisplay.website_url.slice(0, 4) === "http"
                      ? profileToDisplay.website_url
                      : "https://" + profileToDisplay.website_url
                  }
                  target="_blank"
                  // style={{ color: "rgb(81, 125, 228)" }}
                  onClick={() => {
                    mixpanel.track("Clicked profile website link", {
                      slug: slug_address,
                    });
                  }}
                  className="mr-5 my-1 md:my-0"
                >
                  <div
                    className="flex text-sm text-gray-500 md:text-base flex-row py-1 hover:opacity-80"
                    // style={{ color: "#353535" }}
                  >
                    <div>
                      <FontAwesomeIcon
                        style={{ height: 14, width: 14 }}
                        className="mr-2 opacity-70"
                        icon={faLink}
                        style={{ color: "#353535" }}
                      />{" "}
                    </div>
                    <div>
                      <div
                        // className="hover:opacity-90"
                        style={{ wordBreak: "break-all" }}
                      >
                        {profileToDisplay.website_url}
                      </div>
                    </div>
                  </div>
                </a>
              ) : null}
              {/* map out social links */}
              {profileToDisplay?.links &&
                profileToDisplay.links.map((socialLink) => (
                  <a
                    href={
                      `https://${socialLink.prefix}` + socialLink.user_input
                    }
                    target="_blank"
                    // style={{ color: "rgb(81, 125, 228)" }}
                    onClick={() => {
                      mixpanel.track(
                        `Clicked ${socialLink.name} profile link`,
                        {
                          slug: slug_address,
                        }
                      );
                    }}
                    className="mr-5 my-1 md:my-0"
                    key={socialLink.type_id}
                  >
                    <div
                      className="text-gray-500 flex text-sm  md:text-base flex-row py-1 items-center hover:opacity-80"
                      // style={{ color: "#353535" }}
                    >
                      {socialLink.icon_url && (
                        <img
                          src={socialLink.icon_url}
                          alt=""
                          className="flex-shrink-0 h-5 w-5 mr-1 opacity-70"
                        />
                      )}
                      <div>
                        <div className="" style={{ wordBreak: "break-all" }}>
                          {socialLink.name}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </CappedWidth>
        {spotlightItem ? (
          <div className="mt-16 sm:mt-8 md:mt-16">
            <div className="relative bg-white border-t border-b border-gray-200 sm:py-16 sm:pb-8 md:pb-16 mb-4">
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
                pageProfile={{
                  profile_id,
                  slug_address,
                  name,
                  img_url,
                  wallet_addresses_excluding_email,
                  slug_address,
                  website_url,
                  profile_id,
                  username,
                }}
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
              <div className="sm:px-3">
                <div className="h-max sticky top-24 ">
                  <div className="px-2 sm:px-4 py-2 sm:py-4 sm:rounded-lg bg-white border-t border-b sm:border-none border-gray-200  sm:shadow-md mt-16">
                    <div className="border-b border-gray-200 sm:mx-2 mb-2 pb-4  ">
                      <div className="flex flex-row items-center mt-2 ml-2 sm:mt-0 sm:ml-0">
                        <div className="mr-2">
                          <img
                            src={
                              profileToDisplay && profileToDisplay.img_url
                                ? profileToDisplay.img_url
                                : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                            }
                            style={{ width: 22, height: 22 }}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          {profileToDisplay?.name
                            ? profileToDisplay.name
                            : wallet_addresses_excluding_email &&
                              wallet_addresses_excluding_email.length > 0
                            ? formatAddressShort(
                                wallet_addresses_excluding_email[0]
                              )
                            : "Unnamed"}
                        </div>
                        <div className="flex-grow"></div>
                        {isMyProfile ? (
                          <div className="flex sm:hidden">
                            <div className="flex-grow flex"></div>
                            <div
                              className=" text-xs mr-2 text-gray-400 cursor-pointer hover:text-gray-700"
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
                    <div className="flex flex-row sm:flex-col">
                      <div
                        onClick={() => {
                          setSelectedGrid(1);
                          if (
                            gridRef?.current?.getBoundingClientRect().top < 0
                          ) {
                            window.scroll({
                              top: gridRef?.current?.offsetTop + 30,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className={`flex-1 hover:bg-stpurple100 p-2 sm:mb-1 ml-1 sm:ml-0 rounded-lg px-3  ${
                          selectedGrid === 1
                            ? "text-stpurple700 bg-stpurple100"
                            : "text-gray-500"
                        } hover:text-stpurple700 cursor-pointer flex flex-row transition-all items-center`}
                      >
                        <div className="w-6 hidden sm:block">
                          <FontAwesomeIcon
                            icon={faFingerprint}
                            className="mr-2"
                          />
                        </div>
                        <div className="flex-grow sm:hidden"></div>
                        <div className="sm:hidden mr-1">
                          {createdCount}
                          {createdCount == 150 ? "+" : ""}
                        </div>
                        <div>Created</div>
                        <div className="flex-grow"></div>
                        <div className="rounded-full text-center text-sm hidden sm:block">
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
                          if (
                            gridRef?.current?.getBoundingClientRect().top < 0
                          ) {
                            window.scroll({
                              top: gridRef?.current?.offsetTop + 30,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className={`flex-1 hover:bg-stteal100 sm:mb-1 p-2  rounded-lg px-3 ${
                          selectedGrid === 2
                            ? "text-stteal700 bg-stteal100"
                            : "text-gray-500"
                        } hover:text-stteal700 cursor-pointer flex flex-row transition-all items-center`}
                      >
                        <div className="w-6 hidden sm:block">
                          <FontAwesomeIcon
                            icon={selectedGrid === 2 ? fasImage : faImage}
                            className="mr-2"
                          />
                        </div>
                        <div className="flex-grow sm:hidden"></div>
                        <div className="sm:hidden mr-1">
                          {ownedCount}
                          {ownedCount == 150 ? "+" : ""}
                        </div>
                        <div>Owned</div>
                        <div className="flex-grow"></div>
                        <div className="rounded-full text-center text-sm hidden sm:block">
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
                          if (
                            gridRef?.current?.getBoundingClientRect().top < 0
                          ) {
                            window.scroll({
                              top: gridRef?.current?.offsetTop + 30,
                              behavior: "smooth",
                            });
                          }
                        }}
                        className={`flex-1 hover:bg-stred100 p-2 sm:mt-0 mr-1 sm:mr-0 rounded-lg px-3 ${
                          selectedGrid === 3
                            ? "text-stred bg-stred100"
                            : "text-gray-500"
                        } hover:text-stred cursor-pointer flex flex-row transition-all items-center`}
                      >
                        <div className="w-6 hidden sm:block">
                          <FontAwesomeIcon
                            icon={selectedGrid === 3 ? fasHeart : faHeart}
                            className="mr-2"
                          />
                        </div>
                        <div className="flex-grow sm:hidden"></div>
                        <div className="sm:hidden mr-1">
                          {likedCount}
                          {likedCount == 150 ? "+" : ""}
                        </div>
                        <div>Liked</div>
                        <div className="flex-grow"></div>
                        <div className="rounded-full text-center text-sm hidden sm:block">
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
                  </div>
                  <div>
                    {isMyProfile ? (
                      <div className="flex hidden sm:flex">
                        <div className="flex-grow flex"></div>
                        <div
                          className=" text-xs mt-3 ml-6 mr-1 text-gray-400 cursor-pointer hover:text-gray-700"
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
                    className={`sm:mt-0 flex h-12 items-center px-3 my-2  md:text-base ${
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
                    <div className="py-2 px-2 mr-1  text-sm text-gray-500">
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
                  key={`grid_${selectedGrid}_${profile_id}_${
                    isLoadingCards || isRefreshingCards
                  }`}
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
                  pageProfile={{
                    profile_id,
                    slug_address,
                    name,
                    img_url,
                    wallet_addresses_excluding_email,
                    slug_address,
                    website_url,
                    profile_id,
                    username,
                  }} // to customize owned by list
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
