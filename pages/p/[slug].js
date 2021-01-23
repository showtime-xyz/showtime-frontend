import { useState, useEffect } from "react";
import Head from "next/head";
import _ from "lodash";
import Link from "next/link";
import Layout from "../../components/layout";
import TokenGrid from "../../components/TokenGrid";
import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
import backend from "../../lib/backend";
import useWindowSize from "../../hooks/useWindowSize";

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
  const response_liked = await backend.get(`/v1/liked?address=${slug}`);
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
  const { user } = useAuth();

  const [isMyProfile, setIsMyProfile] = useState(false);

  const [ownedItems, setOwnedItems] = useState([]);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    setOwnedItems(owned_items);
    setOwnedRefreshed(false);
  }, [owned_items]);

  useEffect(() => {
    if (user) {
      if (slug === user.publicAddress) {
        setIsMyProfile(true);
      } else {
        setIsMyProfile(false);
      }
    } else {
      setIsMyProfile(false);
    }
  }, [owned_items, user]);

  // Set up my likes
  const [myLikes, setMyLikes] = useState([]);
  const [myLikesLoaded, setMyLikesLoaded] = useState(false);
  const { data: like_data } = useMyLikes(user, myLikesLoaded);
  useEffect(() => {
    if (like_data) {
      setMyLikesLoaded(true);
      setMyLikes(like_data.data);
    }
  }, [like_data]);

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

  const logout = () => {
    console.log("Log out");
  };

  const [columns, setColumns] = useState(2);

  const size = useWindowSize();
  useEffect(() => {
    if (size && size.width < 500) {
      setColumns(1);
    } else {
      setColumns(2);
    }
  }, [size]);

  return (
    <Layout>
      <Head>
        <title>Profile | {name ? name : "[Unnamed]"}</title>

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

      <div className="text-right">
        {/*isMyProfile ? (
          <a
            href="#"
            onClick={() => {
              logout();
            }}
            className="showtime-header-link"
          >
            Log out
          </a>
          
        ) : (
          "\u00A0"
        )*/}
        {"\u00A0"}
      </div>
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
        <div className={name ? "text-3xl mt-4" : "text-xs md:text-xl mt-4"}>
          {name ? name : wallet_addresses[0]}
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

      <TokenGrid
        columnCount={columns}
        items={ownedItems}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-6xl">
          Liked Items
        </div>
      </div>

      {liked_items.length > 0 ? null : (
        <div className="text-center">
          {isMyProfile ? "You haven't" : "This person hasn't"} liked any items
          yet.{" "}
          {isMyProfile ? (
            <Link href="/c/superrare">
              <a className="showtime-link">Go explore!</a>
            </Link>
          ) : null}
        </div>
      )}
      <TokenGrid
        columnCount={columns}
        items={liked_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
    </Layout>
  );
};

export default Profile;
