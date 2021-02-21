import React, { useContext, useState, useEffect } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";

export async function getServerSideProps(context) {
  const { slug } = context.query;
  let error;
  let profile_pic;
  let name;
  let wallet_addresses;

  if (slug === "youngadz1") {
    error = null;
    profile_pic =
      "https://showtime-git-youngadz-showtime.vercel.app/artists/youngadz.jpeg";
    name = "Young Adz";
    wallet_addresses = ["0x2645FC9eE4f6242083dC078343d9176F60B2Ee63"];
  } else {
    error = "Page not found";
    profile_pic = null;
    name = null;
    wallet_addresses = null;
  }
  //https://i1.sndcdn.com/visuals-000204324090-sqz3Ni-t2480x520.jpg
  return {
    props: {
      slug,
      error,
      profile_pic,
      name,
      wallet_addresses,
    },
  };
}

const Profile = ({ slug, error, profile_pic, name, wallet_addresses }) => {
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
        <title>{name}</title>

        <meta name="description" content="Fans exclusive photography drop" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Fans exclusive photography drop" />
        <meta property="og:image" content={profile_pic} />
        <meta name="og:title" content={name} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={name} />
        <meta
          name="twitter:description"
          content="Fans exclusive photography drop"
        />
        <meta name="twitter:image" content={profile_pic} />
      </Head>
      <div
        style={{
          height: 500,
          backgroundColor: "black",
          backgroundImage: `url(https://pbs.twimg.com/media/Et-IBH0XMAY0BIb?format=jpg&name=large)`,
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="flex flex-col w-full p-4 md:p-8"
      >
        <div className="flex-grow"></div>
        <div
          style={{ backgroundColor: "white", opacity: 0.95 }}
          className="p-4 md:p-6 rounded-lg sm:m-16 flex flex-col sm:flex-row items-center w-full sm:w-4/5 md:w-3/5 lg:w-2/5"
        >
          <img
            alt="artist"
            className="rounded-full object-cover object-center w-32 h-32"
            src={profile_pic}
          />
          <div className="ml-0 sm:ml-8  text-center sm:text-left">
            <div className="text-3xl pt-2 sm:pt-2" style={{ fontWeight: 600 }}>
              Young Adz
            </div>
            <div className="text-sm mt-2">
              BANDO BABY NEW ALBUM OUT NOW #TheBlueprint @dirtbike_lb @dbegaming
              @dblock_europe
            </div>
            <div className="mt-4">
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
            </div>
          </div>
        </div>
      </div>
      <div className="m-4 md:m-16 text-center">
        <div
          className="text-3xl mt-16 sm:mt-8 md:mt-0"
          style={{ fontWeight: 600 }}
        >
          Fans Exclusive Photography Drop
        </div>
        <div className="my-8">
          You need to <span style={{ fontWeight: 600 }}>follow</span> Young Adz
          👆 to access this collection
        </div>
        <div className="flex flex-col sm:flex-row w-full">
          <div className="flex flex-col lg:flex-row w-full">
            <div
              style={{
                backgroundColor: "white",
                height: 400,
              }}
              className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col mb-4"
            >
              <div className="flex-grow"></div>
              <div>
                <FontAwesomeIcon
                  style={{ height: 48, margin: "auto", color: "#ccc" }}
                  icon={faLock}
                />
              </div>
              <div className="flex-grow"></div>
            </div>
            <div
              style={{ backgroundColor: "white", height: 400 }}
              className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col mb-4"
            >
              <div className="flex-grow"></div>
              <div>
                <FontAwesomeIcon
                  style={{ height: 48, margin: "auto", color: "#ccc" }}
                  icon={faLock}
                />
              </div>
              <div className="flex-grow"></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row w-full">
            <div
              style={{ backgroundColor: "white", height: 400 }}
              className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col mb-4"
            >
              <div className="flex-grow"></div>
              <div>
                <FontAwesomeIcon
                  style={{ height: 48, margin: "auto", color: "#ccc" }}
                  icon={faLock}
                />
              </div>
              <div className="flex-grow"></div>
            </div>
            <div
              style={{ backgroundColor: "white", height: 400 }}
              className="rounded-md border-2 flex-1 mr-0 sm:mr-4 flex flex-col  mb-4"
            >
              <div className="flex-grow"></div>
              <div>
                <FontAwesomeIcon
                  style={{ height: 48, margin: "auto", color: "#ccc" }}
                  icon={faLock}
                />
              </div>
              <div className="flex-grow"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
