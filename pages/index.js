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
import { faArrowRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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
  const [isLoadingSpotlight, setIsLoadingSpotlight] = useState(false);

  const [heroItems, setHeroItems] = useState([]);
  const [spotlightItems, setSpotlightItems] = useState([]);

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

  const getSpotlight = async () => {
    setIsLoadingSpotlight(true);
    const response_spotlight = await backend.get(`/v1/spotlight`);
    const data_spotlight = response_spotlight.data.data;
    setSpotlightItems(data_spotlight);
    setIsLoadingSpotlight(false);

    // Reset cache for next load
    backend.get(`/v1/spotlight?recache=1`);
  };

  useEffect(() => {
    getHero();
    getSpotlight();
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
        <title>Showtime | Crypto Art</title>
        <meta name="description" content="Discover and showcase crypto art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase crypto art"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/home_og_card.jpg"
        />
        <meta name="og:title" content="Showtime" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Showtime" />
        <meta
          name="twitter:description"
          content="Discover and showcase crypto art"
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/home_twitter_card_2.jpg"
        />
      </Head>

      {columns && (
        <div
          className="mx-auto relative my-16 md:my-24 text-center md:text-left"
          style={{
            ...(columns === 1
              ? { padding: "0px 16px" }
              : { width: gridWidth, paddingLeft: 16 }),
          }}
        >
          <h1
            className="text-xl md:text-3xl xl:text-4xl"
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
          <h1 className="text-4xl md:text-7xl xl:text-8xl">Crypto Art.</h1>
        </div>
      )}

      {gridWidth && (
        <>
          <div style={context.isMobile ? null : { paddingTop: 20 }}>
            <div className="m-auto" style={{ width: gridWidth }}>
              <div
                className="flex flex-row ml-0 mr-0"
                style={
                  context.isMobile
                    ? { padding: "0px 16px", marginBottom: 20 }
                    : { padding: "0px 12px", marginBottom: 16 }
                }
              >
                <h3 className="self-end text-2xl md:text-4xl flex flex-row">
                  <div>User Spotlights</div>
                  {/*<div>
                    <img
                      src="/icons/spotlight_black.png"
                      style={{
                        marginLeft: 8,
                      }}
                      className="w-7 h-7 md:w-10 md:h-10"
                    />
                    </div>*/}
                  <div className="tooltip">
                    <FontAwesomeIcon
                      style={
                        context.isMobile
                          ? {
                              height: 18,
                              color: "#bbb",
                              cursor: "pointer",
                              marginBottom: 2,
                            }
                          : {
                              height: 18,
                              color: "#bbb",
                              cursor: "pointer",
                              marginBottom: 8,
                            }
                      }
                      icon={faInfoCircle}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        opacity: 0.9,
                        width: 200,
                        lineHeight: 1.75,
                      }}
                      className="tooltip-text bg-black p-3 -mt-9 -ml-28 rounded text-white"
                    >
                      Users can pick one item from their profile to spotlight
                    </span>
                  </div>
                </h3>
                <div className="flex-grow "></div>
                <div className="self-end">
                  <div
                    className="ml-4 bg-white text-black border-black rounded-full px-5 py-1 cursor-pointer border-2 hover:text-stpink hover:border-stpink transition-all showtime-random-button"
                    onClick={() => {
                      getSpotlight();
                    }}
                  >
                    <span className="text-sm md:text-base">🎲&nbsp;Random</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-auto"
              style={{ width: gridWidth, minHeight: 700 }}
            >
              <TokenGridV4
                items={spotlightItems.slice(0, context.columns * 2)}
                isLoading={isLoadingSpotlight}
              />
            </div>
          </div>

          <div
            className="text-center pb-10 pt-4"
            style={
              context.columns === 1
                ? { backgroundColor: "rgb(243, 244, 246)" }
                : null
            }
          >
            {/*<Link href="/c/[collection]" as="/c/all">
              <a className="showtime-purple-button-icon flex flex-row items-center px-4 py-2 rounded-full">
                <div className="mr-2">Explore Collections</div>
                <div className="flex">
                  <FontAwesomeIcon style={{ height: 18 }} icon={faArrowRight} />
                </div>
              </a>
            </Link>*/}
          </div>
        </>
      )}

      {gridWidth && (
        <>
          <div style={context.isMobile ? null : { paddingTop: 20 }}>
            <div className="m-auto" style={{ width: gridWidth }}>
              <div
                className="flex flex-row ml-0 mr-0"
                style={
                  context.isMobile
                    ? {
                        padding: "0px 16px",
                        marginBottom: 20,
                        borderTopWidth: 1,
                      }
                    : { padding: "0px 12px", marginBottom: 16 }
                }
              >
                <h3 className="self-end text-2xl md:text-4xl  pt-7">Latest </h3>
                <div className="flex-grow "></div>
                <div className="self-end">
                  <div
                    className="ml-4 bg-white text-black border-black rounded-full px-5 py-1 cursor-pointer border-2 hover:text-stpink hover:border-stpink transition-all showtime-random-button"
                    onClick={() => {
                      getHero();
                    }}
                  >
                    <span className="text-sm md:text-base">🎲 Random</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="m-auto"
              style={{ width: gridWidth, minHeight: 700 }}
            >
              <TokenGridV4
                items={heroItems.slice(0, context.columns * 2)}
                isLoading={isLoadingHero}
              />
            </div>
          </div>

          <div
            className="text-center pb-10 pt-4"
            style={
              context.columns === 1
                ? { backgroundColor: "rgb(243, 244, 246)" }
                : null
            }
          >
            <Link href="/c/[collection]" as="/c/all">
              <a className="showtime-purple-button-icon flex flex-row items-center px-4 py-2 rounded-full">
                <div className="mr-2">Explore Collections</div>
                <div className="flex">
                  <FontAwesomeIcon style={{ height: 18 }} icon={faArrowRight} />
                </div>
              </a>
            </Link>
          </div>
        </>
      )}

      {columns && (
        <div
          className="mx-auto pt-2"
          style={
            columns === 1
              ? { borderTopWidth: 1 }
              : { width: columns * (375 + 20) }
          }
        >
          {FilterTabs}
        </div>
      )}

      {gridWidth && (
        <div className="m-auto" style={{ width: gridWidth, minHeight: 900 }}>
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
            <a className="showtime-purple-button-icon flex flex-row items-center px-4 py-2 rounded-full">
              <div className="mr-2">Explore Collections</div>
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
