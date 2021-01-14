import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Layout from "../components/layout";
import Leaderboard from "../components/Leaderboard";
import TokenGrid from "../components/TokenGrid";
import useAuth from "../hooks/useAuth";
import useMyLikes from "../hooks/useMyLikes";
//import styles from "../styles/Home.module.css";

export async function getServerSideProps(context) {
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

  // Set up my likes
  const [myLikes, setMyLikes] = useState([]);
  const [myLikesLoaded, setMyLikesLoaded] = useState(false);
  const { data } = useMyLikes(user, myLikesLoaded);
  useEffect(() => {
    if (data) {
      setMyLikesLoaded(true);
      setMyLikes(data.data);
    }
  }, [data]);

  return (
    <Layout>
      <Head>
        <title>Showtime | Digital Art</title>
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
            <Link href="/login">
              <a className="showtime-pink-button">Continue with Email</a>
            </Link>
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
        <Link href="/c/superrare">
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
    </Layout>
  );
}
