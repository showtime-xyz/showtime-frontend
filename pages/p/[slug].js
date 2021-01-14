import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Iron from "@hapi/iron";
import Layout from "../../components/layout";
import Leaderboard from "../../components/Leaderboard";
import TokenGrid from "../../components/TokenGrid";
import CookieService from "../../lib/cookie";
//import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import useAuth from "../../hooks/useAuth";
import useMyLikes from "../../hooks/useMyLikes";

export async function getServerSideProps(context) {
  const { slug } = context.query;

  /*
  // Get user
  const getUserFromContext = async (context) => {
    let user = null;
    let cookieDict;
    try {
      if (context.req.headers.cookie) {
        cookieDict = context.req.headers.cookie
          .split("; ")
          .reduce((prev, current) => {
            const [name, value] = current.split("=");
            prev[name] = value;
            return prev;
          }, {});

        if (cookieDict.api_token) {
          user = await Iron.unseal(
            CookieService.getAuthToken(cookieDict),
            process.env.ENCRYPTION_SECRET,
            Iron.defaults
          );
        }
      }
    } catch (error) {}

    return user;
  };
  const user = await getUserFromContext(context);
  */

  // Get mylikes
  let name = null;
  let img_url = null;
  let wallet_addresses = [];

  let owned_items = [];
  let liked_items = [];

  // Get profile metadata
  const res_profile = await fetch(
    `${process.env.BACKEND_URL}/v1/profile?address=${slug}`
  );
  const data_profile = await res_profile.json();

  const profile_metadata = data_profile.data;
  name = profile_metadata.name;
  img_url = profile_metadata.img_url;
  wallet_addresses = profile_metadata.wallet_addresses;

  // Get owned items
  const res_owned = await fetch(
    //`${process.env.BACKEND_URL}/v1/owned?address=${user.publicAddress}&maxItemCount=9`
    `${process.env.BACKEND_URL}/v1/owned?address=0x73113a65011acbad72730577defd95aaf268e22a&maxItemCount=9&useCached=1`
  );
  const data_owned = await res_owned.json();
  owned_items = data_owned.data;

  // Get liked items
  const res_liked = await fetch(
    `${process.env.BACKEND_URL}/v1/liked?address=${slug}&maxItemCount=9`
  );
  const data_liked = await res_liked.json();
  liked_items = data_liked.data;

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

export default function Profile({
  name,
  img_url,
  public_address,
  owned_items,
  liked_items,
}) {
  //const router = useRouter();
  //const { slug } = router.query;

  const { user } = useAuth();

  const [myLikes, setMyLikes] = useState([]);
  const [myLikesLoaded, setMyLikesLoaded] = useState(false);
  const { data } = useMyLikes(user, myLikesLoaded);
  useEffect(() => {
    if (data) {
      setMyLikesLoaded(true);
      setMyLikes(data.data.like_list);
    }
  }, [data]);

  const [ownedItems, setOwnedItems] = useState(owned_items);

  /*
  useEffect(() => {
    if (my_likes && !myLikesLoaded) {
      setMyLikes(my_likes);
      setMyLikesLoaded(true);
    }
  }, [my_likes, myLikesLoaded]);*/

  /*
  useEffect(() => {
    if (user) {
      const getMyLikes = async () => {
        const res_mylikes = await fetch(
          `${process.env.BACKEND_URL}/v1/mylikes?address=${user.publicAddress}`
        );
        const data_mylikes = await res_mylikes.json();
        setMyLikes(data_mylikes.data.like_list);
      };
      getMyLikes();
    } else {
      setMyLikes([]);
    }
  }, [user]);
  */

  useEffect(() => {
    const refetchOwnedItems = async () => {
      // Get owned items
      const res_owned = await fetch(
        `${process.env.BACKEND_URL}/v1/owned?address=0x73113a65011acbad72730577defd95aaf268e22a&maxItemCount=9`
      );
      const data_owned = await res_owned.json();
      owned_items = data_owned.data;
      setOwnedItems(owned_items);
    };
    refetchOwnedItems();
  }, []);

  return (
    <Layout user={user}>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="mx-auto flex pt-20 pb-10 flex-col items-center">
        <img
          alt="artist"
          className="showtime-avatar object-cover object-center "
          src={img_url}
        />
        <div className="text-3xl mt-4">{name ? name : public_address}</div>
      </div>
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Owned Items</div>
      </div>

      <TokenGrid
        hasHero
        columnCount={2}
        items={ownedItems}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
        allHeros={true}
      />
      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto">Liked Items</div>
      </div>
      <TokenGrid
        columnCount={2}
        items={liked_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />

      {/*<Link href="/login">
        <a>Login</a>
      </Link>
  <h1>Welcome to Showtime!</h1>*/}
    </Layout>
  );
}
