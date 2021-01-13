import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Iron from "@hapi/iron";
import Layout from "../components/layout";
import Leaderboard from "../components/Leaderboard";
import TokenGrid from "../components/TokenGrid";
import CookieService from "../lib/cookie";
//import styles from "../styles/Home.module.css";

export async function getServerSideProps(context) {
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

  // Get mylikes
  let mylikes = [];
  if (user) {
    const res_mylikes = await fetch(
      `${process.env.BACKEND_URL}/v1/mylikes?address=${user.publicAddress}`
    );
    const data_mylikes = await res_mylikes.json();
    mylikes = data_mylikes.data;
  }

  // Get featured
  const res_featured = await fetch(
    `${process.env.BACKEND_URL}/v1/featured?maxItemCount=9`
  );
  const data_featured = await res_featured.json();

  // Get leaderboard
  const res_leaderboard = await fetch(
    `${process.env.BACKEND_URL}/v1/leaderboard?maxItemCount=9`
  );
  const data_leaderboard = await res_leaderboard.json();

  return {
    props: {
      user: user,
      mylikes: mylikes,
      featured_items: data_featured.data,
      leaderboard: data_leaderboard.data,
    }, // will be passed to the page component as props
  };
}

export default function Home({ featured_items, leaderboard, user, mylikes }) {
  const [myLikes, setMyLikes] = useState(mylikes);

  /*
  const [featuredLikedItems, setFeaturedLikedItems] = useState([]);
  

  // Augment content with my like status
  // Doing client-side, so we can update the interactions
  useEffect(() => {
    var newFeaturedLikedItems = [];

    if (featured_items.length > 0 && myLikes) {
      _.forEach(featured_items, function (item) {
        item.liked = false;

        _.forEach(myLikes, function (like) {
          if (
            item.asset_contract.address === like.contract &&
            item.token_id === like.token_id
          ) {
            item.liked = true;
          }
        });

        newFeaturedLikedItems.push(item);
      });
      setFeaturedLikedItems(newFeaturedLikedItems);
    }
  }, [featured_items, myLikes]);
  */

  return (
    <Layout user={user}>
      <Head>
        <title>Digital Art</title>
      </Head>
      <h1
        className="showtime-title text-center mx-auto"
        style={{ maxWidth: 1000 }}
      >
        Discover and showcase your favorite digital art{" "}
        {myLikes ? myLikes.length : null}
      </h1>
      <>
        <div className="flex justify-center">
          {user ? (
            <Link href="/profile">
              <a className="showtime-pink-button-outline">Go to My Profile</a>
            </Link>
          ) : (
            <button className="showtime-pink-button">
              Continue with Email
            </button>
          )}
        </div>
      </>
      <TokenGrid
        hasHero
        columnCount={2}
        items={featured_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
      <Leaderboard topCreators={leaderboard} />

      {/*<Link href="/login">
        <a>Login</a>
      </Link>
  <h1>Welcome to Showtime!</h1>*/}
    </Layout>
  );
}
