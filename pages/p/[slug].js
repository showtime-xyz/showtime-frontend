import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import Layout from "../../components/layout";
import TokenGrid from "../../components/TokenGrid";
import TokenGridV2 from "../../components/TokenGridV2";
import backend from "../../lib/backend";
import AppContext from "../../context/app-context";
import ShareButton from "../../components/ShareButton";
import FollowGrid from "../../components/FollowGrid";
import { useRouter } from "next/router";
import Modal from "../../components/Modal";

export async function getServerSideProps(context) {
  const { slug } = context.query;

  // Get profile metadata
  const response_profile = await backend.get(`/v2/profile/${slug}`);
  const data_profile = response_profile.data.data;

  const name = data_profile.profile.name;
  const img_url = data_profile.profile.img_url;
  const wallet_addresses = data_profile.profile.wallet_addresses;
  const created_items = data_profile.created;
  const owned_items = data_profile.owned;
  const liked_items = data_profile.liked;

  // Get followers
  const response_followers = await backend.get(`/v1/followers?address=${slug}`);
  const followers_list = response_followers.data.data;

  // Get following
  const response_following = await backend.get(`/v1/myfollows?address=${slug}`);
  const following_list = response_following.data.data;

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
}) => {
  const router = useRouter();
  const context = useContext(AppContext);

  const web3Modal = context?.web3Modal;

  const logoutOfWeb3Modal = function () {
    if (web3Modal) web3Modal.clearCachedProvider();
  };

  const [isMyProfile, setIsMyProfile] = useState();
  const [isFollowed, setIsFollowed] = useState(false);

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
  const [likedRefreshed, setLikedRefreshed] = useState(false);

  useEffect(() => {
    setLikedItems(liked_items);
    setLikedRefreshed(false);
  }, [liked_items]);

  const [createdItems, setCreatedItems] = useState([]);
  const [createdRefreshed, setCreatedRefreshed] = useState(false);

  useEffect(() => {
    setCreatedItems(created_items);
    setCreatedRefreshed(false);
  }, [created_items]);

  const [ownedItems, setOwnedItems] = useState([]);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    setOwnedItems(owned_items);
    setOwnedRefreshed(false);
  }, [owned_items]);

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
  }, [owned_items, typeof context.user]);

  /*
  useEffect(() => {
    let isSubscribed = true;

    const refreshOwned = async () => {
      if (slug !== "0x0000000000000000000000000000000000000000") {
        const response_owned = await backend.get(`/v1/owned?address=${slug}`);
        if (response_owned.data.data !== owned_items) {
          if (isSubscribed) {
            setOwnedItems(response_owned.data.data);
          }
        }
      }

      setOwnedRefreshed(true);
    };
    refreshOwned();

    return () => (isSubscribed = false);
  }, [owned_items]);

  useEffect(() => {
    let isSubscribed = true;

    const refreshLiked = async () => {
      if (slug !== "0x0000000000000000000000000000000000000000") {
        const response_liked = await backend.get(`/v1/liked?address=${slug}`);
        if (response_liked.data.data !== liked_items) {
          if (isSubscribed) {
            setLikedItems(response_liked.data.data);
          }
        }
      }

      setLikedRefreshed(true);
    };
    refreshLiked();

    return () => (isSubscribed = false);
  }, [owned_items]);
  */

  const logout = async () => {
    const authRequest = await fetch("/api/logout", {
      method: "POST",
    });

    if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
      //router.push("/");
      logoutOfWeb3Modal();
      context.setUser(null);
      context.setMyLikes([]);
      context.setMyFollows([]);
      //router.push("/");
      //window.location.href = "/";
      mixpanel.track("Logout");
      setIsMyProfile(false);
    } else {
      /* handle errors */
    }
  };

  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 800) {
      setColumns(1);
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1400) {
      setColumns(2);
      setIsMobile(false);
    } else if (context.windowSize && context.windowSize.width < 1800) {
      setColumns(3);
      setIsMobile(false);
    } else {
      setColumns(4);
      setIsMobile(false);
    }
  }, [context.windowSize]);

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out");
    router.push("/login");
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
      followers.filter(
        (follower) =>
          !context.myProfile.wallet_addresses.includes(follower.wallet_address)
      )
    );

    // Post changes to the API
    await fetch(`/api/unfollow/${slug}`, {
      method: "post",
    });

    mixpanel.track("Unfollowed profile");
  };

  const [editModalOpen, setEditModalOpen] = useState(false);

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
        <Modal isOpen={editModalOpen} setEditModalOpen={setEditModalOpen} />
      ) : null}

      <div
        className=" text-sm showtime-profile-address text-left mt-3 py-2 px-4 visible lg:invisible"
        style={
          isMyProfile
            ? {
                backgroundColor: "#fff",
                borderRadius: 7,
                borderWidth: 1,
                color: "#333",
                borderColor: "#ccc",
              }
            : {
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0)",
              }
        }
      >
        {isMyProfile ? (
          <>
            <a
              href="#"
              onClick={() => {
                setEditModalOpen(true);
              }}
              className="showtime-logout-link"
              style={{ whiteSpace: "nowrap", fontWeight: 400 }}
            >
              Edit name
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
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
        <div className="col-span-1 text-center">
          <div>
            <img
              alt="artist"
              className="rounded-full object-cover object-center w-28 h-28 lg:w-40 lg:h-40 mx-auto"
              src={
                img_url
                  ? img_url
                  : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
              }
            />
          </div>
          <div
            className="mt-4 mb-8 flex flex-row"
            style={{ whiteSpace: "nowrap" }}
          >
            <div className="flex-grow"></div>
            {isMyProfile ? null : (
              <div className="tooltip ">
                <button
                  className={
                    isFollowed
                      ? "showtime-green-button text-sm px-3 py-1 md:text-base items-center ml-10"
                      : "showtime-like-button-white-green-hover text-sm px-3 py-1 md:text-base items-center ml-10"
                  }
                  onClick={() =>
                    context.user
                      ? isFollowed
                        ? handleUnfollow()
                        : handleFollow()
                      : handleLoggedOutFollow()
                  }
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
                {context.user ? null : (
                  <span
                    style={{ fontSize: 12, opacity: 0.9, width: 110 }}
                    className="tooltip-text bg-black p-3 -mt-7 -ml-24 rounded text-white"
                  >
                    Log in to follow
                  </span>
                )}
              </div>
            )}
            <div>
              <ShareButton
                url={
                  typeof window !== "undefined" ? window.location.href : null
                }
                type={"profile"}
              />
            </div>
            <div className="flex-grow"></div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="text-sm showtime-profile-address float-right text-right hidden lg:block">
            {isMyProfile ? (
              <>
                <a
                  href="#"
                  onClick={() => {
                    setEditModalOpen(true);
                  }}
                  className="showtime-logout-link"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Edit name
                </a>
                {" \u00A0\u00A0\u00A0 "}
                <a
                  href="#"
                  onClick={() => {
                    logout();
                  }}
                  className="showtime-logout-link"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Log out
                </a>
              </>
            ) : (
              "\u00A0"
            )}
            <div className="text-xs mt-2" style={{ color: "#999" }}>
              {columns > 2 ? wallet_addresses[0] : null}
            </div>
          </div>
          <div className="text-left text-3xl md:text-5xl mb-4 pb-4 border-b-2 border-gray-300 showtime-title">
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
            {followers && followers.length > 0 ? (
              <>
                <div className="mb-2">
                  {followers.length > 1
                    ? `${followers.length} Followers`
                    : "1 Follower"}
                </div>

                <FollowGrid people={followers} />
              </>
            ) : (
              <div>
                No followers yet
                <br />
                <br />
              </div>
            )}
          </div>

          <div>
            {following && following.length > 0 ? (
              <>
                <div className="mb-2">
                  {following.length > 1
                    ? `${following.length} Following`
                    : "1 Following"}
                </div>

                <FollowGrid people={following} />
              </>
            ) : (
              <div>
                Not following anyone yet
                <br />
                <br />
              </div>
            )}
          </div>
        </div>
      </div>

      {createdItems.length === 0 ? null : (
        <>
          <div className="flex flex-col text-center w-full border-t-2 border-gray-300">
            <div className="showtime-title text-center mx-auto text-3xl md:text-5xl py-10">
              Created Items
            </div>
          </div>
          <div className="text-center mb-4">
            {createdItems.length === 0
              ? `We couldn't find any items created by ${
                  isMyProfile ? "you" : "this person"
                }.`
              : null}
          </div>
        </>
      )}

      <TokenGridV2
        columnCount={columns}
        items={createdItems}
        isMobile={isMobile}
      />

      {ownedItems.length === 0 ? null : (
        <>
          <div className="flex flex-col text-center w-full border-t-2 border-gray-300 mt-8">
            <div className="showtime-title text-center mx-auto text-3xl md:text-5xl py-10">
              Owned Items
            </div>
          </div>
          <div className="text-center mb-4">
            {ownedItems.length === 0
              ? `We couldn't find any items owned by ${
                  isMyProfile ? "you" : "this person"
                }.`
              : null}
            {/*ownedRefreshed
          ? ownedItems.length === 0
            ? `We couldn't find any items owned by ${
                isMyProfile ? "you" : "this person"
              }.`
            : null
          : ownedItems.length === 0
          ? "Loading..."
            : null*/}
          </div>
          <TokenGridV2
            columnCount={columns}
            items={ownedItems}
            isMobile={isMobile}
          />{" "}
        </>
      )}

      {likedItems.length === 0 ? null : (
        <>
          <div className="flex flex-col text-center w-full  border-t-2 border-gray-300 mt-8">
            <div className="showtime-title text-center mx-auto text-3xl md:text-5xl py-10">
              Liked Items
            </div>
          </div>
          <div className="text-center mb-4">
            {/*likedRefreshed ? (
          likedItems.length === 0 ? (
            isMyProfile ? (
              <>
                {`You haven't liked any items yet. `}
                <Link href="/c/superrare">
                  <a className="showtime-link">Go explore!</a>
                </Link>
              </>
            ) : (
              "This person hasn't liked any items yet."
            )
          ) : null
        ) : likedItems.length === 0 ? (
          "Loading..."
        ) : null*/}

            {likedItems.length === 0 ? (
              isMyProfile ? (
                <>
                  {`You haven't liked any items yet. `}
                  <Link href="/c/superrare">
                    <a className="showtime-link">Go explore!</a>
                  </Link>
                </>
              ) : (
                "This person hasn't liked any items yet."
              )
            ) : null}
          </div>
          <TokenGridV2
            columnCount={columns}
            items={likedItems}
            isMobile={isMobile}
          />
        </>
      )}
    </Layout>
  );
};

export default Profile;
