import React, { useContext, useState, useEffect } from "react";
import Layout from "../components/layout";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";

export async function getServerSideProps(context) {
  const { slug } = context.query;
  let error;
  let profile_pic;
  let name;

  if (slug === "youngadz1") {
    error = null;
    profile_pic =
      "https://pbs.twimg.com/media/EudKXKdXUAMZmVc?format=jpg&name=large";
    name = "Young Adz";
  } else {
    error = "Page not found";
    profile_pic = null;
    name = null;
  }
  //https://i1.sndcdn.com/visuals-000204324090-sqz3Ni-t2480x520.jpg
  return {
    props: {
      slug,
      error,
      profile_pic,
      name,
    },
  };
}

const Profile = ({ slug, error, profile_pic, name }) => {
  const context = useContext(AppContext);

  const [isFollowed, setIsFollowed] = useState(false);

  /*
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
  }, [context.myFollows, wallet_addresses]);*/

  const handleUnfollow = () => {};
  const handleFollow = () => {};
  const handleLoggedOutFollow = () => {};

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
          backgroundImage:
            "url(https://pbs.twimg.com/media/Et-IBH0XMAY0BIb?format=jpg&name=large)",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="flex flex-col w-full"
      >
        <div className="flex-grow"></div>
        <div
          style={{ backgroundColor: "white", width: 600, opacity: 0.95 }}
          className="p-6 rounded-lg m-16 flex flex-row items-center"
        >
          <img
            alt="artist"
            className="rounded-full object-cover object-center w-32 h-32"
            src={profile_pic}
          />
          <div className="ml-8">
            <div className="text-3xl" style={{ fontWeight: 600 }}>
              Young Adz
            </div>
            <div className="text-sm mt-2">
              BANDO BABY NEW ALBUM OUT NOW #TheBlueprint @dirtbike_lb @dbegaming
              @dblock_europe
            </div>
            <div className="mt-4">
              <div className="tooltip text-center md:text-left">
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
      <div className="m-16 text-center">
        <div className="text-3xl" style={{ fontWeight: 600 }}>
          Fans Exclusive Photography Drop
        </div>
        <div className="my-8">
          You need to <span style={{ fontWeight: 600 }}>follow</span> Young Adz
          👆 to access this collection
        </div>
        <div className="flex flex-row w-full">
          <div
            style={{
              backgroundColor: "white",
              height: 400,
            }}
            className="rounded-md border-2 flex-1 mr-4 flex flex-col"
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
            className="rounded-md border-2 flex-1 mr-4 flex flex-col"
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
            className="rounded-md border-2 flex-1 mr-4 flex flex-col"
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
            className="rounded-md border-2 flex-1 flex flex-col"
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
    </Layout>
  );
};

export default Profile;
