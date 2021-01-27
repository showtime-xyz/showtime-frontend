import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Link from "next/link";
import Layout from "../../components/layout";
import TokenGrid from "../../components/TokenGrid";
import backend from "../../lib/backend";
import AppContext from "../../context/app-context";
import ShareButton from "../../components/ShareButton";
import mixpanel from "mixpanel-browser";
//import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { slug } = context.query;

  // Get profile metadata
  const response_profile = await backend.get(`/v1/profile?address=${slug}`);
  const data_profile = response_profile.data.data;

  const name = data_profile.name;
  const img_url = data_profile.img_url;
  const wallet_addresses = data_profile.wallet_addresses;

  // Get owned items
  const response_owned = await backend.get(
    `/v1/owned?address=${slug}&use_cached=1`
  );
  const owned_items = response_owned.data.data;

  // Get liked items
  const response_liked = await backend.get(
    `/v1/liked?address=${slug}&use_cached_only=1`
  );
  const liked_items = response_liked.data.data;

  return {
    props: {
      name,
      img_url,
      wallet_addresses,
      owned_items,
      liked_items,
      slug,
    }, // will be passed to the page component as props
  };
}

const Profile = ({
  name,
  img_url,
  wallet_addresses,
  owned_items,
  liked_items,
  slug,
}) => {
  //const router = useRouter();
  const context = useContext(AppContext);

  const web3Modal = context?.web3Modal;

  const logoutOfWeb3Modal = function () {
    if (web3Modal) web3Modal.clearCachedProvider();
  };

  const [isMyProfile, setIsMyProfile] = useState();

  const [likedItems, setLikedItems] = useState([]);
  const [likedRefreshed, setLikedRefreshed] = useState(false);

  useEffect(() => {
    setLikedItems(liked_items);
    setLikedRefreshed(false);
  }, [liked_items]);

  const [ownedItems, setOwnedItems] = useState([]);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    setOwnedItems(owned_items);
    setOwnedRefreshed(false);
  }, [owned_items]);

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

  useEffect(() => {
    const refreshOwned = async () => {
      if (slug !== "0x0000000000000000000000000000000000000000") {
        const response_owned = await backend.get(`/v1/owned?address=${slug}`);
        if (response_owned.data.data !== owned_items) {
          setOwnedItems(response_owned.data.data);
        }
      }

      setOwnedRefreshed(true);
    };
    refreshOwned();
  }, [owned_items]);

  useEffect(() => {
    const refreshLiked = async () => {
      if (slug !== "0x0000000000000000000000000000000000000000") {
        const response_liked = await backend.get(`/v1/liked?address=${slug}`);
        if (response_liked.data.data !== liked_items) {
          setLikedItems(response_liked.data.data);
        }
      }

      setLikedRefreshed(true);
    };
    refreshLiked();
  }, [owned_items]);

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
      //router.push("/");
      //window.location.href = "/";
      mixpanel.track("Logout");
    } else {
      /* handle errors */
    }
  };

  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 500) {
      setColumns(1);
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1400) {
      setColumns(2);
      setIsMobile(false);
    } else {
      setColumns(3);
      setIsMobile(false);
    }
  }, [context.windowSize]);

  return (
    <Layout>
      <Head>
        <title>Profile | {name ? name : "Unnamed"}</title>

        <meta name="description" content="Digital art owned and liked" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Digital art owned and liked" />
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
          content="Digital art owned and liked"
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

      <div className="text-right">{"\u00A0"}</div>
      <div className="mx-auto flex pt-16 pb-10 flex-col items-center">
        <img
          alt="artist"
          className="showtime-avatar object-cover object-center w-12 h-12 md:w-30 md:h-30"
          src={
            img_url
              ? img_url
              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
          }
        />
        <div className=" mt-4 flex flex-row center-items">
          <ShareButton
            url={typeof window !== "undefined" ? window.location.href : null}
            type={"profile"}
          />
          <div className="text-3xl" style={{ marginRight: 40 }}>
            {name ? name : "Unnamed"}
          </div>
        </div>
        <div className="text-xs mt-4 showtime-profile-address">
          {wallet_addresses[0]}
        </div>
        <div className="mt-2">
          {isMyProfile ? (
            <a
              href="#"
              onClick={() => {
                logout();
              }}
              className="showtime-logout-link"
            >
              Log out
            </a>
          ) : (
            "\u00A0"
          )}
        </div>
      </div>
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-6xl">
          Owned Items
        </div>
      </div>
      <div className="text-center">
        {ownedRefreshed
          ? ownedItems.length === 0
            ? `We couldn't find any items owned by ${
                isMyProfile ? "you" : "this person"
              }.`
            : null
          : ownedItems.length === 0
          ? "Loading..."
          : null}
      </div>

      <TokenGrid columnCount={columns} items={ownedItems} isMobile={isMobile} />

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-6xl">
          Liked Items
        </div>
      </div>
      <div className="text-center">
        {likedRefreshed ? (
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
        ) : null}
      </div>
      <TokenGrid columnCount={columns} items={likedItems} isMobile={isMobile} />
    </Layout>
  );
};

export default Profile;
