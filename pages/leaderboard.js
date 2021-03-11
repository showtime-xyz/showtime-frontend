import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Head from "next/head";
import _ from "lodash";
import Layout from "../components/layout";
import LoadingSpinner from "../components/LoadingSpinner";
import LeaderboardItem from "../components/LeaderboardItem";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { GridTab, GridTabs } from "../components/GridTabs";

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
  const [leaderboardDays, setLeaderboardDays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getFeatured = async () => {
      setIsLoading(true);
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

  return (
    <Layout>
      <Head>
        <title>{"Showtime | Leaderboard"}</title>
        <meta name="description" content="Most popular creators" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Most popular creators" />
        <meta property="og:image" content="/banner.png" />
        <meta name="og:title" content="Showtime | Leaderboard" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Showtime | Leaderboard" />
        <meta name="twitter:description" content="Most popular creators" />
        <meta
          name="twitter:image"
          content="https://showtime.kilkka.vercel.app/banner.png"
        />
      </Head>
      {columns && (
        <>
          <div
            className="mx-auto mt-16 my-12 md:my-20 md:mt-24 text-center md:text-left"
            style={
              columns === 1
                ? { padding: "0px 16px" }
                : { width: gridWidth, paddingLeft: 16 }
            }
          >
            <h1
              className="text-xl md:text-3xl xl:text-4xl mt-5"
              style={{ maxWidth: 700 }}
            >
              {"Leaderboard"}
            </h1>
            <h1
              className="text-4xl md:text-7xl xl:text-8xl"
              style={{ fontFamily: "Afronaut" }}
            >
              {"Most popular "}
            </h1>
            <h1
              className="text-4xl md:text-7xl xl:text-8xl"
              style={{ fontFamily: "Afronaut" }}
            >
              {"creators."}
            </h1>
          </div>

          <div className="m-auto" style={{ width: gridWidth }}>
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
                leaderboardItems.map((item) => (
                  <LeaderboardItem key={item.profile_id} item={item} />
                ))
              )}
            </Content>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Leaderboard;
