import { useState, useEffect } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";

import TokenGrid from "../../components/TokenGrid";

import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";
//import useOwned from "../../hooks/useOwned";
import backend from "../../lib/backend";
import Link from "next/link";
import { useRouter } from "next/router";

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
    `/v1/owned?address=${slug}&limit=9&use_cached=1`
  );
  const owned_items = response_owned.data.data;

  // Get liked items
  const response_liked = await backend.get(`/v1/liked?address=${slug}&limit=9`);
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
  const [ownedItems, setOwnedItems] = useState([]);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);

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
      const response_owned = await backend.get(
        `/v1/owned?address=${slug}&limit=9`
      );
      if (response_owned.data.data !== owned_items) {
        setOwnedItems(response_owned.data.data);
      }

      setOwnedRefreshed(true);
    };
    refreshOwned();
  }, [owned_items]);

  return (
    <Layout>
      <Head>
        <title>Profile | {name ? name : "[Unnamed]"}</title>
      </Head>
      <div className="mx-auto flex pt-20 pb-10 flex-col items-center">
        <img
          alt="artist"
          className="showtime-avatar object-cover object-center "
          src={
            img_url
              ? img_url
              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
          }
        />
        <div className="text-3xl mt-4">{name ? name : wallet_addresses[0]}</div>
      </div>
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Owned Items</div>
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
        columnCount={2}
        items={ownedItems}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Liked Items</div>
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
        columnCount={2}
        items={liked_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
    </Layout>
  );
};

export default Profile;
