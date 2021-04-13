import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/layout";
import LoadingSpinner from "../components/LoadingSpinner";
import LeaderboardItem from "../components/LeaderboardItem";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { GridTab, GridTabs } from "../components/GridTabs";
import CappedWidth from "../components/CappedWidth";
import TokenGridV4 from "../components/TokenGridV4";
import { formatAddressShort } from "../lib/utilities";
import FollowButton from "../components/FollowButton";
import LeaderboardItemV2 from "../components/LeaderboardItemV2";

// how many leaders to show on first load
const LEADERBOARD_LIMIT = 10;

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Leaderboard = () => {
  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Leaderboard page view");
    }
  }, [typeof context.user]);

  const [leaderboardItems, setLeaderboardItems] = useState([]);
  const [showAllLeaderboardItems, setShowAllLeaderboardItems] = useState(false);
  const [leaderboardDays, setLeaderboardDays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    const getFeatured = async () => {
      setIsLoading(true);
      setShowAllLeaderboardItems(false);
      const result = await backend.get(
        `/v1/leaderboard?days=${leaderboardDays}`
      );
      const data = result?.data?.data;
      setLeaderboardItems(data);
      setIsLoading(false);

      // Reset cache for next load
      backend.get(`/v1/leaderboard?days=${leaderboardDays}&recache=1`);
    };
    getFeatured();
  }, [leaderboardDays]);

  const shownLeaderboardItems = showAllLeaderboardItems
    ? leaderboardItems.slice(0, 20)
    : leaderboardItems.slice(0, LEADERBOARD_LIMIT);

  useEffect(() => {
    const getFeatured = async () => {
      setIsLoadingCards(true);

      const response_featured = await backend.get(
        `/v2/featured?limit=150&days=${leaderboardDays}`
      );
      const data_featured = response_featured.data.data;
      setFeaturedItems(data_featured);
      setIsLoadingCards(false);
    };
    getFeatured();
  }, [leaderboardDays]);

  return (
    <Layout>
      <Head>
        <title>Trending</title>
        <meta name="description" content="Trending creators & items" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Trending creators & items" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_og_card.jpg"
        />
        <meta name="og:title" content="Showtime | Trending" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Showtime | Trending Creators & Items"
        />
        <meta name="twitter:description" content="Trending" />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_twitter_card2.jpg"
        />
      </Head>

      <div className="py-12 sm:py-14 px-8 sm:px-10 text-left  bg-gradient-to-r from-green-400 to-blue-500">
        <CappedWidth>
          <div className="flex flex-row mx-3 text-white">
            <div className="flex-1">
              <div className="text-xl sm:text-2xl">Art & Creators</div>
              <div
                className="text-3xl sm:text-6xl"
                style={{ fontFamily: "Afronaut", textTransform: "capitalize" }}
              >
                Trending
              </div>
              <div className="text-3xl sm:text-6xl">On Showtime</div>
            </div>
          </div>
        </CappedWidth>
      </div>
      <CappedWidth>
        <div className="flex-1 -mt-4 mx-3 lg:w-2/3 lg:pr-6 xl:w-1/2">
          <div className="bg-white rounded-lg shadow-md px-6 py-6 text-center flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-3 md:mb-0">Select a timeframe</div>
            <div className="flex-1 text-left">[ 24 Hours ]</div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 mt-16">
          <div className="px-3 col-span-2 md:col-span-3">
            {/*<h1 className="text-lg sm:text-3xl mb-6 sm:px-3">Pieces</h1>*/}
            <TokenGridV4 items={featuredItems} isLoading={isLoadingCards} />
          </div>
          <div className="sm:px-3">
            {/*<div className="flex flex-row">
              <h1 className="text-lg sm:text-3xl mb-6">Creators</h1>
              <div className="flex-grow"></div>
              <div>[Follow All]</div>
            </div>*/}
            <div className="bg-white rounded-lg shadow-md pt-3">
              <div className="border-b border-gray-200 flex items-center pb-2 px-4 flex-row">
                <div className="m-2 flex-grow">Top Creators</div>
                <div>[Follow All]</div>
              </div>

              {isLoading ? (
                <div className="p-6 mx-auto flex flex-row">
                  <div className="flex-grow"></div>
                  <LoadingSpinner />
                  <div className="flex-grow"></div>
                </div>
              ) : (
                shownLeaderboardItems.map((item, index) => (
                  <LeaderboardItemV2 item={item} index={index} />
                ))
              )}
            </div>

            {!isLoading && (
              <div className="flex flex-row items-center my-2 justify-center">
                {!showAllLeaderboardItems ? (
                  <div
                    className="bg-white text-center px-6 py-2 mt-2 flex items-center w-max shadow-md rounded-full hover:text-stpink  cursor-pointer"
                    onClick={() => {
                      setShowAllLeaderboardItems(true);
                    }}
                  >
                    <div className="mr-2 ">Show More</div>
                    <div>
                      <FontAwesomeIcon
                        style={{ height: 14 }}
                        icon={faArrowDown}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/*<div className="mb-4 mt-8 sm:mt-16 text-left px-5 sm:px-3 flex flex-row items-center">
          <h1 className="text-lg sm:text-3xl">Creators</h1>
        </div>

        <div className="m-auto relative">
          <GridTabs title="">
            <GridTab
              label="24 Hours"
              isActive={leaderboardDays === 1}
              onClickTab={() => {
                setLeaderboardDays(1);
              }}
            />
            <GridTab
              label="7 Days"
              isActive={leaderboardDays === 7}
              onClickTab={() => {
                setLeaderboardDays(7);
              }}
            />
            <GridTab
              label="30 Days"
              isActive={leaderboardDays === 30}
              onClickTab={() => {
                setLeaderboardDays(30);
              }}
            />
          </GridTabs>
          <Content isMobile={context.isMobile}>
            {isLoading ? (
              <div style={{ minHeight: 700 }}>
                <LoadingSpinner />
              </div>
            ) : (
              shownLeaderboardItems.map((item, index) => (
                <LeaderboardItem
                  key={item.profile_id}
                  item={item}
                  index={index}
                />
              ))
            )}
          </Content>

          {!isLoading && (
            <div className="flex flex-row items-center my-2 justify-center">
              {!showAllLeaderboardItems ? (
                <div
                  className="text-center px-6 py-2 mt-2 flex items-center w-max border-2 border-gray-300 rounded-full hover:text-stpink hover:border-stpink cursor-pointer"
                  onClick={() => {
                    setShowAllLeaderboardItems(true);
                  }}
                >
                  <div className="mr-2 ">Show More</div>
                  <div>
                    <FontAwesomeIcon
                      style={{ height: 14 }}
                      icon={faArrowDown}
                    />
                  </div>
                </div>
              ) : (
                <Link href="/c/[collection]" as="/c/all">
                  <a className="showtime-purple-button-icon flex flex-row items-center px-4 py-2 rounded-full my-12">
                    <div className="mr-2">Explore Collections</div>
                    <div className="flex">
                      <FontAwesomeIcon
                        style={{ height: 18 }}
                        icon={faArrowRight}
                      />
                    </div>
                  </a>
                </Link>
              )}
            </div>
          )}
              </div>*/}
      </CappedWidth>
    </Layout>
  );
};

export default Leaderboard;
