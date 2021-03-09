import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import Layout from "../components/layout";
import TokenGridV4 from "../components/TokenGridV4";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { GridTab, GridTabs } from "../components/GridTabs";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function Home() {
  const context = useContext(AppContext);
  const { columns, gridWidth } = context;
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Home page view");
    }
  }, [typeof context.user]);

  const [featuredItems, setFeaturedItems] = useState([]);
  const [featuredDays, setFeaturedDays] = useState(1);
  const [reachedBottom, setReachedBottom] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isLoadingHero, setIsLoadingHero] = useState(false);

  const [heroItems, setHeroItems] = useState([]);

  useEffect(() => {
    const getFeatured = async () => {
      setIsLoadingCards(true);

      const response_featured = await backend.get(
        `/v2/featured?limit=150&days=${featuredDays}`
      );
      const data_featured = response_featured.data.data;
      setFeaturedItems(data_featured);
      setIsLoadingCards(false);
    };
    getFeatured();
    setReachedBottom(false);
  }, [featuredDays]);

  const getHero = async () => {
    setIsLoadingHero(true);
    const response_hero = await backend.get(`/v1/hero`);
    const data_hero = response_hero.data.data;
    setHeroItems(data_hero);
    setIsLoadingHero(false);

    // Reset cache for next load
    backend.get(`/v1/hero?recache=1`);
  };

  useEffect(() => {
    getHero();
  }, []);

  const FilterTabs =
    gridWidth > 0 ? (
      <>
        <GridTabs title="Trending">
          <GridTab
            label="24 Hours"
            isActive={featuredDays === 1}
            onClickTab={() => {
              setFeaturedDays(1);
            }}
          />
          <GridTab
            label="7 Days"
            isActive={featuredDays === 7}
            onClickTab={() => {
              setFeaturedDays(7);
            }}
          />
          <GridTab
            label="30 Days"
            isActive={featuredDays === 30}
            onClickTab={() => {
              setFeaturedDays(30);
            }}
          />
        </GridTabs>
      </>
    ) : null;

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
      {/* <h1
        className="showtime-title text-center mx-auto text-2xl md:text-5xl md:leading-snug mb-5 mt-5 py-10"
        style={{ maxWidth: 700 }}
      >
        Discover and showcase your favorite digital art.
      </h1> */}

      <div
        className="mx-auto mt-16 my-12 md:my-20 md:mt-24 text-center md:text-left"
        style={
          columns === 1
            ? { padding: "0px 16px" }
            : { width: columns * (375 + 20) }
        }
      >
        <h1
          className="text-xl md:text-3xl xl:text-4xl mt-5"
          style={{ maxWidth: 700 }}
        >
          Discover & Showcase
        </h1>
        <h1
          className="text-4xl md:text-7xl xl:text-8xl"
          style={{ fontFamily: "Afronaut" }}
        >
          Your Favorite
        </h1>
        <h1 className="text-4xl md:text-7xl xl:text-8xl">CRYPTO ART.</h1>
      </div>

      {gridWidth && (
        <div
          style={
            context.isMobile
              ? null
              : {
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 10px 6px rgba(34, 48, 67, 3%)",
                  paddingTop: 40,
                  paddingBottom: 40,
                  marginBottom: 30,
                }
          }
        >
          <div className="m-auto" style={{ width: gridWidth }}>
            <div
              className="flex flex-row ml-0 mr-0"
              style={
                context.isMobile
                  ? { padding: "0px 16px", marginBottom: 20 }
                  : { padding: "0px 12px", marginBottom: 16 }
              }
            >
              <h3 className="text-2xl md:text-4xl" style={{ fontWeight: 600 }}>
                Latest{" "}
              </h3>
              <div className="flex-grow sm:hidden"></div>
              <div className="self-end">
                <button
                  className="showtime-random-button px-3 py-1 ml-3"
                  style={{ fontSize: 14, fontWeight: 600 }}
                  onClick={() => {
                    getHero();
                  }}
                >
                  🎲 Random
                </button>
              </div>
              <div className="hidden sm:flex flex-grow"></div>
              <div className="self-end hidden sm:flex">
                <Link href="/c/[collection]" as="/c/all">
                  <a className="explore-more-link">Explore more pieces</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="m-auto" style={{ width: gridWidth }}>
            <TokenGridV4
              items={heroItems.slice(0, context.columns)}
              isLoading={isLoadingHero}
            />
          </div>
        </div>
      )}

      {columns && (
        <div
          className="mx-auto"
          style={columns === 1 ? null : { width: columns * (375 + 20) }}
        >
          {FilterTabs}
        </div>
      )}

      {gridWidth && (
        <div className="m-auto" style={{ width: gridWidth }}>
          <TokenGridV4
            items={featuredItems}
            onFinish={() => {
              setReachedBottom(true);
            }}
            isLoading={isLoadingCards}
          />
        </div>
      )}

      {featuredItems.length > 0 && reachedBottom ? (
        <div className="text-center pt-8 pb-16">
          <Link href="/c/[collection]" as="/c/all">
            <a className="showtime-purple-button-icon flex flex-row items-center">
              <div className="mr-2">Explore more</div>
              <div className="flex">
                <FontAwesomeIcon style={{ height: 18 }} icon={faArrowRight} />
              </div>
            </a>
          </Link>
        </div>
      ) : null}
    </Layout>
  );
}
