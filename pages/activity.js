import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../components/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import ActivityFeed from "../components/ActivityFeed";

const ACTIVITY_PAGE_LENGTH = 5; // 5 activity items per activity page
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

  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const activityPage = useRef(1);
  const [hasMoreScrolling, setHasMoreScrolling] = useState(true);
  const getActivity = async () => {
    setIsLoading(true);
    const result = await fetch(`/api/getactivity`, {
      method: "POST",
      body: JSON.stringify({
        page: activityPage.current,
      }),
    });
    const resultJson = await result.json();
    const { data } = resultJson;
    if (_.isEmpty(data) || data.length < ACTIVITY_PAGE_LENGTH) {
      setHasMoreScrolling(false);
    }
    setActivity([...activity, ...data]);
    setIsLoading(false);
  };
  useEffect(() => {
    getActivity();
  }, []);

  const getNext = () => {
    activityPage.current = activityPage.current + 1;
    getActivity();
  };
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
            className="m-auto relative"
            style={{
              ...(columns === 1 ? null : { width: gridWidth, paddingLeft: 16 }),
            }}
          >
            <div
              className="mx-auto relative mt-16 mb-4 md:mt-24 text-center md:text-left"
              style={{
                ...(columns === 1
                  ? { padding: "0px 16px" }
                  : { width: gridWidth }),
              }}
            >
              <h1 className="text-xl md:text-3xl xl:text-4xl">Activity</h1>
            </div>
            {/* Page Content */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
              {/* Left Column */}
              <div className="flex flex-col md:col-span-2">
                <div className="border-t border-b h-2 bg-gray-100 border-gray-200" />

                <InfiniteScroll
                  dataLength={activity.length}
                  next={getNext}
                  hasMore={hasMoreScrolling}
                  endMessage={
                    <div className="flex flex-1 items-center justify-center my-4">
                      <div className="text-gray-400">No more activity.</div>
                    </div>
                  }
                >
                  <ActivityFeed activity={[...activity]} />
                </InfiniteScroll>
                <div className="flex h-16 items-center justify-center mt-6">
                  {isLoading && <div className="loading-card-spinner" />}
                </div>
              </div>
              {/* Right Column */}
              <div className="flex flex-col md:col-span-2">
                <div className="p-6 h-max bg-gray-100 rounded-lg sticky top-10">
                  <div className="text-xl">Recommended Follows</div>
                  <div className="bg-gray-200 p-4 rounded-lg">
                    [Recommended follows comp here]
                  </div>
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
