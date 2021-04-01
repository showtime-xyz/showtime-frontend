import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Layout from "../components/layout";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import ActivityFeed from "../components/ActivityFeed";

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Activity = () => {
  const context = useContext(AppContext);
  const { columns, gridWidth } = context;
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Leaderboard page view");
    }
  }, [typeof context.user]);

  const ACTIVITY_FEED = [
    {
      type: "LIKE",
      timestamp: "2021-02-14T14:14:41",
      actor_data: {
        wallet_address: "0xc986ca9476edc3c021c04e3306f9e37eed9071ab",
        username: "blonded",
        name: "blonded",
        profile_img_url:
          "https://storage.googleapis.com/nft-public-profile-pics/138698_1613232609.jpg",
      },
      activity_data: {
        amount: 1,
        nft_id: "1234",
        nft_img_url: [
          "https://lh3.googleusercontent.com/MlhWuUVejA3dpoNqrfwJbPkFF6azVVvtiTRG2WhIQzi7RtCs6Ih56iRbLc-RfZr1fjIKG29a7Zgb-1ratEj2oRLnBv_EqEC3vM6bew=w375",
        ],
      },
    },
  ];

  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getActivity = async () => {
      setIsLoading(true);
      // const result = await backend.get(
      //   `/v1/leaderboard?days=${leaderboardDays}`
      // );
      // const data = result?.data?.data;
      setActivity(ACTIVITY_FEED);
      setIsLoading(false);

      // Reset cache for next load
      // backend.get(`/v1/activity?days=${leaderboardDays}&recache=1`);
    };
    getActivity();
  }, []);
  return (
    <Layout>
      <Head>
        <title>Activity</title>
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

      {gridWidth && (
        <>
          <div
            className="m-auto relative mt-4"
            style={{ width: gridWidth < 900 ? gridWidth : 900 }}
          >
            <div className="mx-auto relative mt-16 md:mt-24 text-center md:text-left p-4 md:px-0">
              <h1
                className="text-2xl md:text-3xl xl:text-4xl"
                style={{ maxWidth: 700 }}
              >
                Activity
              </h1>
            </div>
            {/* Page Content */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              {/* Left Column */}
              <div className="flex flex-col md:col-span-2">
                <div className="border-t border-b h-2 bg-gray-100 border-gray-200" />

                <ActivityFeed
                  activity={[
                    ...activity,
                    ...activity,
                    ...activity,
                    ...activity,
                    ...activity,
                    ...activity,
                    ...activity,
                    ...activity,
                  ]}
                />
              </div>
              {/* Right Column */}
              <div className="flex flex-col">
                <div className="p-4 h-max bg-gray-100 rounded-lg sticky top-0">
                  <div>Recommended Follows</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Activity;
