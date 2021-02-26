import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import Layout from "../../components/layout";
import TokenGridV4 from "../../components/TokenGridV4";
import backend from "../../lib/backend";
import AppContext from "../../context/app-context";
import ShareButton from "../../components/ShareButton";
import ModalEditProfile from "../../components/ModalEditProfile";
import ModalEditPhoto from "../../components/ModalEditPhoto";
import { GridTabs, GridTab } from "../../components/GridTabs";
import ProfileInfoPill from "../../components/ProfileInfoPill";
import ModalUserList from "../../components/ModalUserList";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(context) {
  const { slug } = context.query;

  // Get profile metadata
  const response_profile = await backend.get(`/v2/profile/${slug}?limit=150`);
  const data_profile = response_profile.data.data;

  const name = data_profile.profile.name;
  const img_url = data_profile.profile.img_url;
  const wallet_addresses = data_profile.profile.wallet_addresses;
  const created_items = data_profile.created;
  const owned_items = data_profile.owned;
  const liked_items = data_profile.liked;
  const followers_list = data_profile.followers;
  const following_list = data_profile.following;

  const bio = data_profile.profile.bio;
  const website_url = data_profile.profile.website_url;

  //console.log(owned_items.length);

  // Get followers
  //const response_followers = await backend.get(`/v1/followers?address=${slug}`);
  //const followers_list = response_followers.data.data;

  // Get following
  //const response_following = await backend.get(`/v1/myfollows?address=${slug}`);
  //const following_list = response_following.data.data;

  return {
    props: {
      name,
      img_url,
      wallet_addresses,
      created_items,
      owned_items,
      liked_items,
      slug,
      followers_list,
      following_list,
      bio,
      website_url,
    }, // will be passed to the page component as props
  };
}

const Profile = ({
  name,
  img_url,
  wallet_addresses,
  created_items,
  owned_items,
  liked_items,
  slug,
  followers_list,
  following_list,
  bio,
  website_url,
}) => {
  //const router = useRouter();
  const context = useContext(AppContext);

  const [isMyProfile, setIsMyProfile] = useState();
  const [isFollowed, setIsFollowed] = useState(false);
  //const [hasFollowerOnlyItems, setHasFollowerOnlyItems] = useState(false);

  /*
  useEffect(() => {
    _.forEach(created_items, (item) => {
      if (item.token_creator_followers_only === 1) {
        setHasFollowerOnlyItems(true);
      }
    });
  }, [created_items]);
  */

  useEffect(() => {
    const checkIfFollowed = async () => {
      var it_is_followed = false;
      await _.forEach(context.myFollows, (follow) => {
        if (wallet_addresses.includes(follow.wallet_address)) {
          it_is_followed = true;
        }
      });
      setIsFollowed(it_is_followed);
    };

    checkIfFollowed();
  }, [context.myFollows, wallet_addresses]);

  const [likedItems, setLikedItems] = useState([]);
  //const [likedRefreshed, setLikedRefreshed] = useState(false);

  useEffect(() => {
    setLikedItems(
      liked_items.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
      )
    );
    //setLikedRefreshed(false);
  }, [liked_items]);

  const [createdItems, setCreatedItems] = useState([]);
  //const [createdRefreshed, setCreatedRefreshed] = useState(false);

  useEffect(() => {
    setCreatedItems(
      created_items.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
        //&& (item.token_creator_followers_only === 0 || (item.token_creator_followers_only && isFollowed))
      )
    );
    //setCreatedRefreshed(false);
  }, [
    created_items,
    //isFollowed
  ]);

  const [ownedItems, setOwnedItems] = useState([]);
  //const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    setOwnedItems(
      owned_items.filter(
        (item) =>
          item.token_hidden !== 1 &&
          (item.token_img_url || item.token_animation_url)
        /*
          && (item.token_creator_followers_only === 0 || 
            (item.token_creator_followers_only &&
              item.creator_id !== item.owner_id) ||
            (item.token_creator_followers_only &&
              item.creator_id === item.owner_id &&
              isFollowed))
          */
      )
    );
    //setOwnedRefreshed(false);
  }, [
    owned_items,
    //isFollowed
  ]);

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
        if (slug === context.user.publicAddress) {
          setIsMyProfile(true);
          mixpanel.track("Self profile view", { slug: slug });
        } else {
          setIsMyProfile(false);
          mixpanel.track("Profile view", { slug: slug });
        }
      } else {
        // Logged out
        setIsMyProfile(false);
        mixpanel.track("Profile view", { slug: slug });
      }
    }
  }, [
    owned_items,
    typeof context.user,
    context.user ? context.user.publicAddress : null,
  ]);

  const logout = async () => {
    await context.logOut();
    setIsMyProfile(false);
  };

  const [columns, setColumns] = useState(2);
  const [gridWidth, setGridWidth] = useState();

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setGridWidth(context.windowSize.width);
      setColumns(1);
    } else if (context.windowSize && context.windowSize.width < 1200) {
      setGridWidth(790 - 18);

      setColumns(2);
    } else if (context.windowSize && context.windowSize.width < 1600) {
      setGridWidth(1185 - 18);
      setColumns(3);
    } else {
      setGridWidth(1580 - 18);
      setColumns(4);
    }
  }, [context.windowSize]);

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out");
    //router.push("/login");
    context.setLoginModalOpen(true);
  };

  const handleFollow = async () => {
    setIsFollowed(true);
    // Change myFollows via setMyFollows
    context.setMyFollows([
      {
        profile_id: null,
        wallet_address: wallet_addresses[0],
        name: name,
        img_url: img_url
          ? img_url
          : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png",
        timestamp: null,
      },
      ...context.myFollows,
    ]);

    setFollowers([
      {
        profile_id: null,
        wallet_address: context.user.publicAddress,
        name: context.myProfile.name,
        img_url: context.myProfile.img_url
          ? context.myProfile.img_url
          : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png",
        timestamp: null,
      },
      ...followers,
    ]);

    // Post changes to the API
    await fetch(`/api/follow/${slug}`, {
      method: "post",
    });

    mixpanel.track("Followed profile");
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter(
        (item) => !wallet_addresses.includes(item.wallet_address)
      )
    );

    setFollowers(
      followers.filter((follower) => {
        //console.log(context.myProfile.wallet_addresses);

        return !context.myProfile.wallet_addresses.includes(
          follower.wallet_address
        );
      })
    );

    // Post changes to the API
    await fetch(`/api/unfollow/${slug}`, {
      method: "post",
    });

    mixpanel.track("Unfollowed profile");
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pictureModalOpen, setPictureModalOpen] = useState(false);

  const [selectedGrid, setSelectedGrid] = useState("created");

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (createdItems.length > 0 && createdItems.length > ownedItems.length) {
      setSelectedGrid("created");
    } else if (ownedItems.length > 0) {
      setSelectedGrid("owned");
    } else {
      setSelectedGrid("liked");
    }
    setShowFollowers(false);
    setShowFollowing(false);
  }, [wallet_addresses, createdItems.length, ownedItems.length]);

  const FilterTabs = (
    <GridTabs>
      <GridTab
        label="Created"
        itemCount={createdItems.length}
        isActive={selectedGrid === "created"}
        onClickTab={() => {
          setSelectedGrid("created");
        }}
      />
      <GridTab
        label="Owned"
        itemCount={ownedItems.length}
        isActive={selectedGrid === "owned"}
        onClickTab={() => {
          setSelectedGrid("owned");
        }}
      />
      <GridTab
        label="Liked"
        itemCount={likedItems.length}
        isActive={selectedGrid === "liked"}
        onClickTab={() => {
          setSelectedGrid("liked");
        }}
      />
    </GridTabs>
  );

  return (
    <Layout>
      <Head>
        <title>
          Profile |{" "}
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
          content="Explore digital art I've created, owned, and liked"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Explore digital art I've created, owned, and liked"
        />
        <meta
          property="og:image"
          content={
            img_url
              ? img_url
              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
          }
        />
        <meta name="og:title" content={name ? name : wallet_addresses[0]} />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={name ? name : wallet_addresses[0]}
        />
        <meta
          name="twitter:description"
          content="Explore digital art I've created, owned, and liked"
        />
        <meta
          name="twitter:image"
          content={
            img_url
              ? img_url
              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
          }
        />
      </Head>

      {typeof document !== "undefined" ? (
        <>
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
          />
          {/* Following modal */}
          <ModalUserList
            title="Following"
            isOpen={showFollowing}
            users={following ? following : []}
            closeModal={() => {
              setShowFollowing(false);
            }}
          />
        </>
      ) : null}

      {/* Start Page Body */}
      {/* Wait until @gridWidth is populated to display page's body */}
      {gridWidth && (
        <>
          <div className="m-auto" style={{ width: gridWidth }}>
            <div className="px-4 md:px-0 flex flex-col md:flex-row items-center md:pb-6 pt-12">
              <div className="flex-grow flex flex-row items-center">
                <div className="flex flex-col ">
                  <div className="flex flex-row items-center text-center">
                    <div className="flex-grow sm:hidden"></div>
                    <div
                      className="text-3xl md:text-5xl showtime-title ml-4 md:ml-0 mt-2 md:mt-0"
                      style={{ fontWeight: 600, wordBreak: "break-word" }}
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
                    </div>
                    <div>
                      <ShareButton
                        url={
                          typeof window !== "undefined"
                            ? window.location.href
                            : null
                        }
                        type={"profile"}
                      />
                    </div>
                    <div className="flex-grow"></div>
                  </div>
                  <div
                    style={{
                      fontWeight: 400,
                      fontSize: 12,
                      marginTop: 8,
                      color: "#999",
                    }}
                  >
                    {columns > 2 ? (
                      wallet_addresses[0]
                    ) : isMyProfile ? (
                      <div className="text-center md:text-left">
                        <a
                          href="#"
                          onClick={() => {
                            setPictureModalOpen(true);
                            mixpanel.track("Open edit photo");
                          }}
                          className="showtime-logout-link"
                          style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                        >
                          {context.myProfile &&
                          context.myProfile.img_url &&
                          !context.myProfile.img_url.includes("opensea-profile")
                            ? "Edit photo"
                            : "Add photo"}
                        </a>
                        {" \u00A0\u00A0\u00A0 "}
                        <a
                          href="#"
                          onClick={() => {
                            setEditModalOpen(true);
                            mixpanel.track("Open edit name");
                          }}
                          className="showtime-logout-link"
                          style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                        >
                          Edit profile
                        </a>
                        {" \u00A0\u00A0\u00A0 "}
                        <a
                          href="#"
                          onClick={() => {
                            logout();
                          }}
                          className="showtime-logout-link "
                          style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                        >
                          Log out
                        </a>
                      </div>
                    ) : null}
                    <div
                      className={`${
                        isMyProfile && context.myProfile
                          ? !context.myProfile.bio &&
                            !context.myProfile.website_url
                            ? "hidden"
                            : "flex-1"
                          : !bio && !website_url
                          ? "hidden"
                          : "flex-1"
                      } mt-8 text-base align-center flex flex-col justify-center items-center md:items-start`}
                    >
                      <h4 className="text-black mb-2 text-lg font-semibold">
                        About
                      </h4>
                      {isMyProfile && context.myProfile ? (
                        context.myProfile.bio ? (
                          <div className="pb-2 sm:mr-16 max-w-xl">
                            <div className="text-center md:text-left">
                              {context.myProfile.bio}
                            </div>
                          </div>
                        ) : null
                      ) : bio ? (
                        <div className="pb-2 sm:mr-16 max-w-xl">
                          <div className="">{bio}</div>
                        </div>
                      ) : null}

                      {isMyProfile && context.myProfile ? (
                        context.myProfile.website_url ? (
                          <div className="pb-4 sm:pb-0 w-min">
                            <a
                              href={
                                context.myProfile.website_url.slice(0, 4) ===
                                "http"
                                  ? context.myProfile.website_url
                                  : "https://" + context.myProfile.website_url
                              }
                              target="_blank"
                              className="flex flex-row items-center justify-center"
                              style={{ color: "rgb(81, 125, 228)" }}
                              onClick={() => {
                                mixpanel.track("Clicked profile website link", {
                                  slug: slug,
                                });
                              }}
                            >
                              <div>{context.myProfile.website_url}</div>
                            </a>
                          </div>
                        ) : null
                      ) : website_url ? (
                        <div className="pb-0">
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
                                slug: slug,
                              });
                            }}
                          >
                            <div style={{ wordWrap: "break-word" }}>
                              {website_url}
                            </div>
                          </a>
                        </div>
                      ) : null}

                      {/* {isMyProfile && context.myProfile ? (
                  !context.myProfile.bio &&
                  !context.myProfile.website_url ? null : (
                    <hr className="pb-4 block sm:hidden" />
                  )
                ) : !bio && !website_url ? null : (
                  <hr className="pb-4 block sm:hidden" />
                )} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="place-self-start text-sm">
                {columns > 2 ? (
                  isMyProfile ? (
                    <>
                      <a
                        href="#"
                        onClick={() => {
                          setPictureModalOpen(true);
                          mixpanel.track("Open edit photo");
                        }}
                        className="showtime-logout-link"
                        style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                      >
                        {context.myProfile &&
                        context.myProfile.img_url &&
                        !context.myProfile.img_url.includes("opensea-profile")
                          ? "Edit photo"
                          : "Add photo"}
                      </a>
                      {" \u00A0\u00A0\u00A0 "}
                      <a
                        href="#"
                        onClick={() => {
                          setEditModalOpen(true);
                          mixpanel.track("Open edit name");
                        }}
                        className="showtime-logout-link"
                        style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                      >
                        Edit profile
                      </a>
                      {" \u00A0\u00A0\u00A0 "}
                      <a
                        href="#"
                        onClick={() => {
                          logout();
                        }}
                        className="showtime-logout-link float-right"
                        style={{ whiteSpace: "nowrap", fontWeight: 400 }}
                      >
                        Log out
                      </a>
                    </>
                  ) : (
                    "\u00A0"
                  )
                ) : null}
              </div>
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
                  ? context.myProfile
                    ? context.myProfile.img_url
                      ? context.myProfile.img_url
                      : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                    : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                  : img_url
                  ? img_url
                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
            />
          </div>

          {/*!isFollowed && hasFollowerOnlyItems ? (
        <div className="text-center py-8">
          This creator has <span style={{ fontWeight: 600 }}>more content</span>{" "}
          you can unlock by <span style={{ fontWeight: 600 }}>Following</span>.
        </div>
      ) : null*/}

          <TokenGridV4
            filterTabs={FilterTabs}
            items={
              selectedGrid === "created"
                ? createdItems
                : selectedGrid === "owned"
                ? ownedItems
                : selectedGrid === "liked"
                ? likedItems
                : null
            }
          />
        </>
      )}
      {/* End Page Body */}
    </Layout>
  );
};

export default Profile;
