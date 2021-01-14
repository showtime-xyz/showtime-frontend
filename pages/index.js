import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Iron from "@hapi/iron";
import Layout from "../components/layout";
import Leaderboard from "../components/Leaderboard";
import TokenGrid from "../components/TokenGrid";
import CookieService from "../lib/cookie";
import useAuth from "../hooks/useAuth";
//import styles from "../styles/Home.module.css";

export async function getServerSideProps(context) {
  // Get user

  /*
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
    mylikes = data_mylikes.data.like_list;
  }
  */

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
      featured_items: data_featured.data,
      leaderboard: data_leaderboard.data,
    }, // will be passed to the page component as props
  };
}

export default function Home({ featured_items, leaderboard }) {
  const { user } = useAuth();
  const [myLikes, setMyLikes] = useState([]);

  useEffect(() => {
    if (user) {
      console.log(
        `${process.env.BACKEND_URL}/v1/mylikes?address=${user.publicAddress}`
      );
      const getMyLikes = async () => {
        const res_mylikes = await fetch(
          `${process.env.BACKEND_URL}/v1/mylikes?address=${user.publicAddress}`
        );
        const data_mylikes = await res_mylikes.json();
        setMyLikes(data_mylikes.data);
      };
      getMyLikes();
    } else {
      setMyLikes([]);
    }
  }, [user]);

  return (
    <Layout user={user}>
      <Head>
        <title>Digital Art</title>
      </Head>
      <h1
        className="showtime-title text-center mx-auto"
        style={{ maxWidth: 1000 }}
      >
        Discover and showcase your favorite digital art
      </h1>
      <div className="mt-10 mb-24">
        <div className="flex justify-center">
          {user ? (
            <Link href={`/p/${user.publicAddress}`}>
              <a className="showtime-pink-button-outline">Go to My Profile</a>
            </Link>
          ) : (
            <button className="showtime-pink-button">
              Continue with Email
            </button>
          )}
        </div>
      </div>
      <TokenGrid
        hasHero
        columnCount={2}
        items={featured_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
      />
      <div className="text-center pt-8 pb-16">
        <Link href="/discover?collection=superrare">
          <a className="showtime-purple-button-icon">
            <span>Discover more artwork</span>
            <img
              style={{ paddingLeft: 6 }}
              src={"/icons/arrow-right.svg"}
              alt="arrow"
            />
          </a>
        </Link>
      </div>
      <div className="mb-16">
        <Leaderboard topCreators={leaderboard} />
      </div>

      {/*<Link href="/login">
        <a>Login</a>
      </Link>
  <h1>Welcome to Showtime!</h1>*/}
    </Layout>
  );
}
