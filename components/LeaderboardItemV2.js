import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";
import AppContext from "../context/app-context";
import ModalTokenDetail from "./ModalTokenDetail";
import useKeyPress from "../hooks/useKeyPress";
//import ReactPlayer from "react-player";
import { formatAddressShort } from "../lib/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import MiniFollowButton from "../components/MiniFollowButton";
import mixpanel from "mixpanel-browser";
import ActivityImages from "./ActivityImages";

const LeaderboardItemV2 = ({
  item,
  index,
  //trendingCreatorOpen,
  //setTrendingCreatorOpen,
}) => {
  const context = useContext(AppContext);
  //const [followerCount, setFollowerCount] = useState();
  const isMyProfile = context?.myProfile?.profile_id === item?.profile_id;
  const topItems = item?.top_items.slice(0, 4);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);
  const currentIndex = topItems?.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );
  const goToNext = () => {
    if (currentIndex < topItems.length - 1) {
      setCurrentlyOpenModal(topItems[currentIndex + 1]);
    }
  };
  const goToPrevious = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentlyOpenModal(topItems[currentIndex - 1]);
    }
  };
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");
  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
    }
    if (rightPress && currentlyOpenModal) {
      mixpanel.track("Next NFT - keyboard");
      goToNext();
    }
    if (leftPress && currentlyOpenModal) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [escPress, leftPress, rightPress]);

  const containerRef = useRef();

  const [thumnailsOpen, setThumbnailsOpen] = useState(false);
  const handleOpenModal = (index) => {
    setCurrentlyOpenModal(topItems[index]);
  };

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            columns={context.columns}
            hasNext={!(currentIndex === topItems.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
        </>
      ) : null}
      <div key={item.profile_id} className="border-b px-4 py-4">
        <div className="flex flex-row items-center" ref={containerRef}>
          <div className="relative mr-1 w-16 flex-none">
            <Link href="/[profile]" as={`/${item?.username || item.address}`}>
              <a className="cursor-pointer">
                <img
                  src={
                    item?.img_url
                      ? item?.img_url
                      : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                  }
                  className="rounded-full h-12 w-12 hover:opacity-90"
                />
              </a>
            </Link>
            <div
              className="absolute rounded-full bg-white text-center self-center h-6 w-6"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.16)",
                fontSize: 13,
                fontWeight: 500,
                paddingTop: 1,

                color: "#010101",
                bottom: 0,
                right: 8,
              }}
            >
              {index + 1}
            </div>
          </div>

          <div className="flex flex-grow overflow-hidden pr-1">
            <Link href="/[profile]" as={`/${item?.username || item.address}`}>
              <a className="hover:text-stpink cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap">
                {item?.name || formatAddressShort(item.address) || "Unnamed"}{" "}
              </a>
            </Link>
            {context.myProfile?.profile_id !== item?.profile_id && (
              <div className="ml-2" style={{ marginTop: 3 }}>
                <MiniFollowButton profileId={item?.profile_id} />
              </div>
            )}
          </div>
          <div>
            <div
              onClick={() => {
                setThumbnailsOpen(!thumnailsOpen);
              }}
              className={`cursor-pointer rounded-full border  ${
                thumnailsOpen
                  ? "border-stpink text-stpink"
                  : "border-gray-400 text-gray-700 hover:opacity-80 "
              } text-center px-2 py-1`}
            >
              <FontAwesomeIcon icon={faThLarge} />
            </div>
          </div>
        </div>

        {topItems?.length > 0 && thumnailsOpen ? (
          <div className="flex mt-4 max-w-full">
            <ActivityImages
              nfts={topItems}
              openModal={handleOpenModal}
              roundAllCorners
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default LeaderboardItemV2;
