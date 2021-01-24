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
import backend from "../lib/backend";
import useWindowSize from "../hooks/useWindowSize";

export async function getServerSideProps(context) {
  // Get featured
  const response_featured = await backend.get("/v1/featured?limit=9");
  const data_featured = response_featured.data.data;

  // Get leaderboard
  const response_leaderboard = await backend.get("/v1/leaderboard?limit=9");
  const data_leaderboard = response_leaderboard.data.data;

  return {
    props: {
      featured_items: data_featured,
      leaderboard: data_leaderboard,
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

  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);

  const size = useWindowSize();
  useEffect(() => {
    if (size && size.width < 500) {
      setColumns(1);
      setIsMobile(true);
    } else if (size && size.width < 1400) {
      setColumns(2);
      setIsMobile(false);
    } else {
      setColumns(3);
      setIsMobile(false);
    }
  }, [size]);
  return (
    <Layout>
      <Head>
        <title>Showtime | Digital Art</title>
        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />
        <meta property="og:image" content="/banner.png" />
        <meta name="og:title" content="Showtime" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Showtime" />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />
        <meta
          name="twitter:image"
          content="https://showtime.kilkka.vercel.app/banner.png"
        />
      </Head>
      <h1
        className="showtime-title text-center mx-auto text-3xl md:text-6xl md:leading-snug"
        style={{ maxWidth: 800 }}
      >
        Discover and showcase your favorite digital art
      </h1>

      <div className="mt-10 mb-24">
        <div className="flex justify-center">
          {user ? (
            <Link href="/p/[slug]" as={`/p/${user.publicAddress}`}>
              <a className="showtime-pink-button-outline">Go to My Profile</a>
            </Link>
          ) : (
            <Link href="/login">
              <a className="showtime-pink-button">
                Sign up with Email or Wallet
              </a>
            </Link>
          )}
        </div>
      </div>
      <TokenGrid
        hasHero
        columnCount={columns}
        items={featured_items}
        myLikes={myLikes}
        setMyLikes={setMyLikes}
        isMobile={isMobile}
      />
      <div className="text-center pt-8 pb-16">
        <Link href="/c/[collection]" as="/c/superrare">
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
