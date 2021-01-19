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
    }, // will be passed to the page component as props
  };
}

const Profile = ({
  name,
  img_url,
  wallet_addresses,
  owned_items,
  liked_items,
}) => {
  const router = useRouter();
  const { slug } = router.query;

  const { user } = useAuth();
  const [isMyProfile, setIsMyProfile] = useState(false);

  useEffect(() => {
    if (user) {
      if (slug === user.publicAddress) {
        setIsMyProfile(true);
      }
    }
  }, [user, slug]);

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

  // Immediate try to refresh the owned items without the cache
  const [ownedItems, setOwnedItems] = useState(owned_items);
  const [ownedRefreshed, setOwnedRefreshed] = useState(false);

  useEffect(() => {
    const refreshOwned = async () => {
      const response_owned = await backend.get(
        `/v1/owned?address=${slug}&limit=9`
      );
      setOwnedItems(response_owned.data.data);
      setOwnedRefreshed(true);
    };
    refreshOwned();
  }, [slug]);

  return (
    <Layout key={slug}>
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
      <div>
        DEBUG <br />
        Slug: {slug}
        <br />
        Name: {name} <br />
        URL: {img_url} <br />
        ADDRESS: {wallet_addresses[0]} <br />
        OWNED: {owned_items.length} <br />
        LIKED: {liked_items.length} <br />
        SLUG: {slug} <br />
        Type of owned items: {typeof ownedItems} <br />
        Owned Items lenght: {ownedItems.length}
        <br />
        Owned Refreshed: {ownedRefreshed === true ? "True" : "False"}
        {/*<br />
        Show loading?:{" "}
        {!owned_data &&
        typeof ownedItems !== "undefined" &&
        ownedItems.length === 0
          ? "Loading..."
        : "Not loading"}*/}
      </div>
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Owned Items</div>
      </div>
      {ownedRefreshed === false && ownedItems.length === 0
        ? "Loading..."
        : ownedRefreshed && ownedItems.length === 0
        ? `We couldn't find any items owned by ${
            isMyProfile ? "you" : "this person"
          }.`
        : null}
      <TokenGrid
        key={ownedRefreshed ? slug + "1" : slug + "0"}
        columnCount={2}
        items={ownedItems}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Liked Items</div>
      </div>
      {liked_items.length > 0 ? null : (
        <p>
          {isMyProfile ? "You haven't" : "This person hasn't"} liked any items
          yet.{" "}
          {isMyProfile ? (
            <Link href="/c/superrare">
              <a className="showtime-link">Go explore!</a>
            </Link>
          ) : null}
        </p>
      )}
      <TokenGrid
        key={ownedRefreshed ? slug + "11" : slug + "10"}
        columnCount={2}
        items={liked_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
    </Layout>
  );
};

export default Profile;
