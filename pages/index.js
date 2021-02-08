import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Layout from "../components/layout";
//import Leaderboard from "../components/Leaderboard";
import TokenGridV4 from "../components/TokenGridV4";

//import styles from "../styles/Home.module.css";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";

export async function getServerSideProps(context) {
  // Get featured
  //const response_featured = await backend.get("/v2/featured?limit=200");
  //const data_featured = response_featured.data.data;

  // Get leaderboard
  //const response_leaderboard = await backend.get("/v1/leaderboard");
  //const data_leaderboard = response_leaderboard.data.data;

  return {
    props: {
      //featured_items: data_featured,
      //leaderboard: data_leaderboard,
    }, // will be passed to the page component as props
  };
}

export default function Home(
  {
    //featured_items,
    //leaderboard
  }
) {
  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Home page view");
    }
  }, [typeof context.user]);

  const [isHovering, setIsHovering] = useState(false);

  const [featuredItems, setFeaturedItems] = useState([]);

  const [featuredDays, setFeaturedDays] = useState(1);
  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    const getFeatured = async () => {
      const response_featured = await backend.get(
        `/v2/featured?limit=200&days=${featuredDays}`
      );
      const data_featured = response_featured.data.data;
      setFeaturedItems(data_featured);
    };
    getFeatured();
    setReachedBottom(false);
  }, [featuredDays]);

  const [gridWidth, setGridWidth] = useState();
  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setGridWidth(context.windowSize.width);
    } else if (context.windowSize && context.windowSize.width < 1200) {
      setGridWidth(790 - 18);
    } else if (context.windowSize && context.windowSize.width < 1600) {
      setGridWidth(1185 - 18);
    } else {
      setGridWidth(1580 - 18);
    }
  }, [context.windowSize]);

  return (
    <Layout>
      <Head>
        <title>Showtime | Crypto Art</title>
        <meta name="description" content="Discover and showcase crypto art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase crypto art"
        />
        <meta property="og:image" content="/banner.png" />
        <meta name="og:title" content="Showtime" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Showtime" />
        <meta
          name="twitter:description"
          content="Discover and showcase crypto art"
        />
        <meta
          name="twitter:image"
          content="https://showtime.kilkka.vercel.app/banner.png"
        />
      </Head>
      <h1
        className="showtime-title text-center mx-auto text-2xl md:text-5xl md:leading-snug mb-5 mt-5 py-10"
        style={{ maxWidth: 700 }}
      >
        Discover and showcase your favorite crypto art
      </h1>

      {/*context.user ? null : (
        <div className=" mb-16">
          <div className="flex justify-center">
            {context.user ? (
              <Link href="/p/[slug]" as={`/p/${context.user.publicAddress}`}>
                <a
                  className="showtime-pink-button-outline"
                  onClick={() => {
                    mixpanel.track("Go to My Profile button click");
                  }}
                >
                  Go to My Profile
                </a>
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
            )*/}
      {/*<TokenGridV2
        columnCount={columns}
        items={featured_items}
        isMobile={isMobile}
      />*/}

      {gridWidth > 0 ? (
        <div
          className="mx-auto text-center mb-6 text-xs sm:text-sm"
          style={{ width: gridWidth }}
        >
          <div className="mr-1 text-sm sm:text-base uppercase mb-2">
            Trending
          </div>
          {context.windowSize ? (
            context.windowSize.width < 375 ? (
              <>
                <br />
                <br />
              </>
            ) : null
          ) : null}
          <button
            className={
              featuredDays === 1
                ? "showtime-like-button-pink px-3 py-1"
                : "showtime-like-button-white px-3 py-1"
            }
            style={{
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0,
              borderRightWidth: 1,
            }}
            onClick={() => {
              setFeaturedDays(1);
            }}
          >
            Last 24 Hours
          </button>
          <button
            className={
              featuredDays === 7
                ? "showtime-like-button-pink px-3 py-1"
                : "showtime-like-button-white px-3 py-1"
            }
            style={{ borderRadius: 0, borderLeftWidth: 1, borderRightWidth: 1 }}
            onClick={() => {
              setFeaturedDays(7);
            }}
          >
            Last 7 Days
          </button>
          <button
            className={
              featuredDays === 30
                ? "showtime-like-button-pink px-3 py-1"
                : "showtime-like-button-white px-3 py-1"
            }
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeftWidth: 1,
            }}
            onClick={() => {
              setFeaturedDays(30);
            }}
          >
            Last 30 Days
          </button>
        </div>
      ) : null}

      <TokenGridV4
        items={featuredItems}
        onFinish={() => {
          setReachedBottom(true);
        }}
      />

      {featuredItems.length > 0 && reachedBottom ? (
        <div className="text-center pt-8 pb-16">
          <Link href="/c/[collection]" as="/c/superrare">
            <a
              className="showtime-purple-button-icon"
              onMouseOver={() => setIsHovering(true)}
              onMouseOut={() => setIsHovering(false)}
            >
              <span>Browse collections</span>
              <img
                style={{ paddingLeft: 6 }}
                src={
                  isHovering
                    ? "/icons/arrow-right-purple.svg"
                    : "/icons/arrow-right.svg"
                }
                alt="arrow"
              />
            </a>
          </Link>
        </div>
      ) : null}
      {/*<div className="mb-16">
        <Leaderboard topCreators={leaderboard} />
            </div>*/}
    </Layout>
  );
}
