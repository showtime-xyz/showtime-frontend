import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../components/layout";
import InfiniteScroll from "react-infinite-scroll-component";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import useKeyPress from "../hooks/useKeyPress";
import ActivityFeed from "../components/ActivityFeed";
import ModalTokenDetail from "../components/ModalTokenDetail";
import ActivityRecommendedFollows from "../components/ActivityRecommendedFollows";
import backend from "../lib/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";

const ACTIVITY_PAGE_LENGTH = 5; // 5 activity items per activity page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Activity = () => {
  const context = useContext(AppContext);
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

    // filter out possible repeats
    let filteredData = [];
    await data.forEach((newItem) => {
      if (!activity.find((actItem) => actItem.id === newItem.id)) {
        filteredData.push(newItem);
      }
    });
    setActivity([...activity, ...filteredData]);
    setIsLoading(false);
  };
  useEffect(() => {
    setActivity([]);
    getActivity();
  }, [context.user]);

  const getNext = () => {
    console.log("getnext");
    activityPage.current = activityPage.current + 1;
    getActivity();
  };

  const [itemOpenInModal, setItemOpenInModal] = useState(null);
  const handleSetItemOpenInModal = ({ index, nftGroup }) => {
    setItemOpenInModal({ index, nftGroup });
  };

  const goToNext = () => {
    if (itemOpenInModal?.index < itemOpenInModal?.nftGroup.length - 1) {
      setItemOpenInModal({
        nftGroup: itemOpenInModal?.nftGroup,
        index: itemOpenInModal?.index + 1,
      });
    }
  };

  const goToPrevious = () => {
    if (itemOpenInModal?.index - 1 >= 0) {
      setItemOpenInModal({
        nftGroup: itemOpenInModal?.nftGroup,
        index: itemOpenInModal?.index - 1,
      });
    }
  };

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  useEffect(() => {
    if (escPress) {
      mixpanel.track("Activity - Close NFT Modal - keyboard");
      setItemOpenInModal(null);
    }
    if (rightPress && itemOpenInModal) {
      mixpanel.track("Activity - Next NFT - keyboard");
      goToNext();
    }
    if (leftPress && itemOpenInModal) {
      mixpanel.track("Activity - Prior NFT - keyboard");
      goToPrevious();
    }
  }, [escPress, leftPress, rightPress]);

  /*
  const handleOpenModal = (index) => {
    setItemOpenInModal({ nftGroup: spotlightItems, index });
  };

  
  const [spotlightItems, setSpotlightItems] = useState([]);

  const getSpotlight = async () => {
    //setIsLoadingSpotlight(true);
    const response_spotlight = await backend.get(`/v1/spotlight`);
    const data_spotlight = response_spotlight.data.data;
    setSpotlightItems(data_spotlight.slice(0, 1));
    //setIsLoadingSpotlight(false);

    // Reset cache for next load
    backend.get(`/v1/spotlight?recache=1`);
  };

  useEffect(() => {
    //getHero();
    getSpotlight();
  }, []);
  */

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
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={itemOpenInModal}
            setEditModalOpen={setItemOpenInModal}
            item={
              itemOpenInModal?.nftGroup
                ? itemOpenInModal.nftGroup[itemOpenInModal?.index]
                : null
            }
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            hasNext={
              !(
                itemOpenInModal?.index ===
                itemOpenInModal?.nftGroup?.length - 1
              )
            }
            hasPrevious={!(itemOpenInModal?.index === 0)}
          />
        </>
      ) : null}

      <>
        <div className="m-auto relative">
          <div className="mb-8 mt-36 text-left">
            <h1 className="text-4xl" style={{ fontFamily: "Afronaut" }}>
              News Feed
            </h1>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div>
              <div className="px-4 py-4 h-max rounded-lg sticky top-24 bg-white shadow-md">
                <div className="hover:bg-blue-100 p-2 rounded-lg px-3 text-blue-500 cursor-pointer">
                  All News
                </div>
                <div className="hover:bg-purple-100 p-2 rounded-lg px-3 text-gray-500 hover:text-purple-500 cursor-pointer flex flex-row items-center">
                  <FontAwesomeIcon
                    icon={faFingerprint}
                    className="mr-2 w-4 h-4"
                  />
                  <div>Creations</div>
                </div>
                <div className="hover:bg-pink-100 p-2 rounded-lg px-3 text-gray-500 hover:text-pink-500 cursor-pointer flex flex-row items-center">
                  <FontAwesomeIcon icon={faHeart} className="mr-2 w-4 h-4" />
                  <div>Likes</div>
                </div>
                <div className="hover:bg-blue-100 p-2 rounded-lg px-3 text-gray-500 hover:text-blue-500 cursor-pointer flex flex-row items-center">
                  <FontAwesomeIcon icon={faComment} className="mr-2 w-4 h-4" />
                  <div>Comments</div>
                </div>
                <div className="hover:bg-green-100 p-2 rounded-lg px-3 text-gray-500 hover:text-green-600 cursor-pointer flex flex-row items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 w-4 h-4" />
                  <div>Follows</div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="" />

              <InfiniteScroll
                dataLength={activity.length}
                next={getNext}
                hasMore={hasMoreScrolling}
                endMessage={
                  <div className="flex flex-1 items-center justify-center my-4">
                    {context.user ? (
                      <div className="text-gray-400">No more activity.</div>
                    ) : (
                      <div className="text-gray-400">
                        <span
                          className="cursor-pointer text-gray-800 hover:text-stpink"
                          onClick={() => context.setLoginModalOpen(true)}
                        >
                          Sign in
                        </span>{" "}
                        to view more & customize
                      </div>
                    )}
                  </div>
                }
                scrollThreshold={0.5}
              >
                <ActivityFeed
                  activity={[...activity]}
                  setItemOpenInModal={handleSetItemOpenInModal}
                />
              </InfiniteScroll>
              <div className="flex h-16 items-center justify-center mt-6">
                {isLoading && <div className="loading-card-spinner" />}
              </div>
            </div>
            <div>
              <div className=" py-4 h-max rounded-lg sticky top-24 bg-white shadow-md">
                <ActivityRecommendedFollows />
              </div>

              {/*<div className="sticky top-24">
                <div className="px-6 h-max rounded-lg border border-gray-200 bg-white shadow-md">
                  Community Spotlights [Refresh]
                  {spotlightItems ? (
                    <>
                      <div className="flex mt-4 max-w-full">
                        <ActivityImages
                          nfts={spotlightItems}
                          openModal={handleOpenModal}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="px-6 h-max rounded-lg mt-8 border border-gray-200 bg-white shadow-md">
                  Trending [Refresh]
                  <br />
                  <br />
                  <br />
                </div>
                  </div>*/}
            </div>
          </div>

          {/* Page Content */}
          <div className="flex">
            {/* Left Column */}

            <div className="flex flex-col"></div>

            <div className="flex flex-col"></div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export default Activity;
