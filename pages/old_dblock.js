import React, { useContext, useState, useEffect } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import TokenGridV4 from "../components/TokenGridV4";
import backend from "../lib/backend";

export async function getServerSideProps(context) {
  const { slug } = context.query;
  let error;
  let profile_pic;
  let name;
  let wallet_addresses;
  let restrictedItems;

  if (slug === "d-block-europe") {
    error = null;
    profile_pic =
      "https://showtime-git-youngadz-showtime.vercel.app/artists/dblock.jpg";
    name = "D-Block Europe";
    wallet_addresses = ["0x78e2426d33b365665c82a9f5aba1b7b488930d38"];

    const response_profile = await backend.get(
      `/v2/profile/${wallet_addresses[0]}?limit=150`
    );
    const data_profile = response_profile.data.data;
    const created_items = data_profile.created.sort((a, b) =>
      a.token_name.localeCompare(b.token_name)
    );

    restrictedItems = created_items;
  } else {
    error = "Page not found";
    profile_pic = null;
    name = null;
    wallet_addresses = null;
    restrictedItems = null;
  }
  //https://i1.sndcdn.com/visuals-000204324090-sqz3Ni-t2480x520.jpg
  return {
    props: {
      slug,
      error,
      profile_pic,
      name,
      wallet_addresses,
      restrictedItems,
    },
  };
}

const Profile = ({
  slug,
  error,
  profile_pic,
  name,
  wallet_addresses,
  restrictedItems,
}) => {
  const context = useContext(AppContext);

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

  const handleLoggedOutFollow = () => {
    mixpanel.track("Follow but logged out - drop page");
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
        img_url: profile_pic,
        timestamp: null,
      },
      ...context.myFollows,
    ]);

    /*
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
    */

    // Post changes to the API
    await fetch(`/api/follow/${wallet_addresses[0]}`, {
      method: "post",
    });

    mixpanel.track("Followed profile - drop page");
  };

  const handleUnfollow = async () => {
    setIsFollowed(false);
    // Change myLikes via setMyLikes
    context.setMyFollows(
      context.myFollows.filter(
        (item) => !wallet_addresses.includes(item.wallet_address)
      )
    );

    /*
    setFollowers(
      followers.filter(
        (follower) =>
          !context.myProfile.wallet_addresses.includes(follower.wallet_address)
      )
    );
    */

    // Post changes to the API
    await fetch(`/api/unfollow/${wallet_addresses[0]}`, {
      method: "post",
    });

    mixpanel.track("Unfollowed profile - drop page");
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center p-16">{error}</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Head>
        <title>{name} NFT Drop</title>

        <meta
          name="description"
          content="D-Block Europe NFTs - First Collectible Drop"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="D-Block Europe NFTs - First Collectible Drop"
        />
        <meta property="og:image" content={profile_pic} />
        <meta name="og:title" content={name} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={name} />
        <meta
          name="twitter:description"
          content="D-Block Europe NFTs - First Collectible Drop"
        />
        <meta name="twitter:image" content={profile_pic} />
      </Head>
      <div
        style={{
          height: 550,
          backgroundColor: "black",
          backgroundImage: `url(/artists/dblock_bg4.jpg)`,
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="flex flex-col w-full p-4"
      >
        <div className="flex-grow"></div>
        <div
          style={{ backgroundColor: "white", opacity: 0.9 }}
          className="p-4 md:p-6 rounded-lg sm:mx-16 sm:my-8 flex flex-col sm:flex-row items-center w-full sm:w-4/5 md:w-3/5 xl:w-2/5"
        >
          <img
            alt="artist"
            className="rounded-full object-cover object-center w-24 h-24 md:w-32 md:h-32"
            src={profile_pic}
          />
          <div className="ml-0 sm:ml-4 lg:ml-8  text-center sm:text-left">
            <div className="text-2xl md:text-3xl pt-0 sm:pt-2">
              {name}
              <img
                src="/icons/verified.png"
                style={{
                  width: 36,
                  height: 36,
                  display: "inline-block",
                  marginBottom: 4,
                }}
              />
            </div>
            <div className="text-sm mt-2">
              Official page for artists @YoungAdz1 @dirtbike_lb
            </div>
            <div className="inline-block sm:hidden text-center">
              <div className="flex flex-row my-4">
                <div className="flex-grow"></div>
                <a
                  href="https://www.instagram.com/dblock_europe/"
                  target="_blank"
                  style={{
                    fontSize: 14,
                    color: "rgb(81, 125, 228)",
                  }}
                  className="flex flex-row items-center"
                >
                  <FontAwesomeIcon
                    style={{
                      height: 16,
                      margin: "auto",
                      marginLeft: 16,
                      marginRight: 4,
                    }}
                    icon={faInstagram}
                  />
                  <div style={{ marginRight: 14 }}>dblock_europe</div>
                </a>
                <div className="flex-grow"></div>
              </div>
              <button
                className={
                  isFollowed
                    ? "showtime-green-button text-base px-3 py-1  items-center"
                    : "showtime-like-button-white-green-hover text-base px-3 py-1  items-center"
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
            </div>
            <div className="mt-4  flex-row items-center hidden sm:flex">
              <div className="tooltip text-center sm:text-left">
                <button
                  className={
                    isFollowed
                      ? "showtime-green-button text-base px-3 py-1  items-center"
                      : "showtime-like-button-white-green-hover text-base px-3 py-1  items-center"
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
                    Sign in to follow
                  </span>
                )}
              </div>
              <div>
                <a
                  href="https://www.instagram.com/dblock_europe/"
                  target="_blank"
                  style={{ fontSize: 14, color: "rgb(81, 125, 228)" }}
                  className="flex flex-row items-center"
                >
                  <FontAwesomeIcon
                    style={{
                      height: 20,
                      margin: "auto",
                      marginLeft: 16,
                      marginRight: 4,
                    }}
                    icon={faInstagram}
                  />
                  <div>dblock_europe</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-4 md:m-16 text-center">
        <div className="text-2xl sm:text-3xl mt-16 sm:mt-8 md:mt-0">
          D-Block Europe NFTs - First Collectible Drop
        </div>
        <div className="p-4 sm:w-4/5 lg:w-1/2" style={{ margin: "auto" }}>
          This is the first NFT drop of D-Block Europe (Young Adz X Dirtbike
          LB). There is ONLY 4 collectibles from this drop, and that will never
          change. You can own a piece of history forever. There is a 10% royalty
          fees that will be paid back to D-Block for future resales.
        </div>

        <>
          <div className="my-8">
            <div className="tooltip">
              <a
                className="showtime-pink-button"
                style={
                  isFollowed
                    ? { width: 180, margin: "auto", cursor: "pointer" }
                    : {
                        width: 180,
                        margin: "auto",
                        cursor: "not-allowed",
                        opacity: 0.7,
                      }
                }
                href={
                  isFollowed
                    ? "https://opensea.io/collection/d-block-europe"
                    : null
                }
                target={isFollowed ? "_blank" : null}
              >
                {isFollowed ? null : (
                  <FontAwesomeIcon
                    style={{
                      height: 16,
                      margin: "auto",
                      marginBottom: 4,
                      marginRight: 6,
                      display: "inline-block",
                    }}
                    icon={faLock}
                  />
                )}
                <div style={{ display: "inline-block", marginRight: 6 }}>
                  Bid on items
                </div>

                {isFollowed ? (
                  <FontAwesomeIcon
                    style={{
                      height: 16,
                      margin: "auto",
                      marginBottom: 4,
                      display: "inline-block",
                    }}
                    icon={faExternalLinkAlt}
                  />
                ) : null}
              </a>
              {isFollowed ? null : (
                <span
                  style={{ fontSize: 12, opacity: 0.9, width: 220 }}
                  className="tooltip-text bg-black p-3 -mt-9 -ml-48 rounded text-white"
                >
                  Follow {name} to unlock link
                </span>
              )}
            </div>
            {isFollowed ? null : (
              <div className="mt-6 mb-16">
                <span>Follow</span> {name} 👆 to bid on the NFTs
              </div>
            )}
          </div>
          {/*<div className="flex flex-col sm:flex-row w-full">
              <div className="flex flex-col lg:flex-row w-full">
                <div
                  style={{
                    backgroundColor: "white",
                    height: 400,
                    color: "#aaa",
                  }}
                  className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col mb-4"
                >
                  <div className="flex-grow"></div>
                  <div>
                    <FontAwesomeIcon
                      style={{
                        height: 48,
                        margin: "auto",
                        color: "#ccc",
                        marginBottom: 4,
                      }}
                      icon={faLock}
                    />
                    Followers only
                  </div>
                  <div className="flex-grow"></div>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    height: 400,
                    color: "#aaa",
                  }}
                  className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col mb-4"
                >
                  <div className="flex-grow"></div>
                  <div>
                    <FontAwesomeIcon
                      style={{
                        height: 48,
                        margin: "auto",
                        color: "#ccc",
                        marginBottom: 4,
                      }}
                      icon={faLock}
                    />
                    Followers only
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row w-full">
                <div
                  style={{
                    backgroundColor: "white",
                    height: 400,
                    color: "#aaa",
                  }}
                  className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col mb-4"
                >
                  <div className="flex-grow"></div>
                  <div>
                    <FontAwesomeIcon
                      style={{
                        height: 48,
                        margin: "auto",
                        color: "#ccc",
                        marginBottom: 4,
                      }}
                      icon={faLock}
                    />
                    Followers only
                  </div>
                  <div className="flex-grow"></div>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    height: 400,
                    color: "#aaa",
                  }}
                  className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col  mb-4"
                >
                  <div className="flex-grow"></div>
                  <div>
                    <FontAwesomeIcon
                      style={{
                        height: 48,
                        margin: "auto",
                        color: "#ccc",
                        marginBottom: 4,
                      }}
                      icon={faLock}
                    />
                    Followers only
                  </div>
                  <div className="flex-grow"></div>
                </div>
              </div>
                    </div>*/}
        </>
      </div>
      <div className="text-left mt-8">
        <TokenGridV4 items={restrictedItems} />
      </div>
    </Layout>
  );
};

export default Profile;
