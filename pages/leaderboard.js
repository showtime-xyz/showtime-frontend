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

// how many leaders to show on first load
const LEADERBOARD_LIMIT = 15;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: ${(p) => (p.isMobile ? "4px 16px" : "10px 12px")};
`;

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Leaderboard = () => {
  const context = useContext(AppContext);
  const { columns, gridWidth } = context;
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
    ? leaderboardItems
    : leaderboardItems.slice(0, LEADERBOARD_LIMIT);

  return (
    <Layout>
      <Head>
        <title>Leaderboard</title>
        <meta name="description" content="Trending creators" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Trending creators" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_og_card.jpg"
        />
        <meta name="og:title" content="Showtime | Leaderboard" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Showtime | Leaderboard" />
        <meta name="twitter:description" content="Trending creators" />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_twitter_card2.jpg"
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
            Leaderboard
          </h1>
          <h1
            className="text-4xl md:text-7xl xl:text-8xl"
            style={{ fontFamily: "Afronaut" }}
          >
            Trending
          </h1>
          <h1 className="text-4xl md:text-7xl xl:text-8xl">Creators.</h1>
        </div>
      )}

      {columns && (
        <>
          <div className="m-auto relative" style={{ width: gridWidth }}>
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

            {/* show more button */}
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
                    {/*<a
                      className="my-12"
                      onClick={() => {
                        mixpanel.track("Explore button click");
                      }}
                    >
                      <div className="text-center px-5 py-3 text-white flex items-center w-max bg-black rounded-full hover:bg-stpink cursor-pointer">
                        <div className="mr-2">Explore Collections</div>
                        <div>
                          <FontAwesomeIcon
                            style={{ height: 14 }}
                            icon={faArrowRight}
                          />
                        </div>
                      </div>
                      
                    </a>*/}
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
          </div>
        </>
      )}
    </Layout>
  );
};

export default Leaderboard;
