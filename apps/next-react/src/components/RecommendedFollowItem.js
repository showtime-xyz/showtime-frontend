import { useContext, useEffect, useState } from "react";
import { DEFAULT_PROFILE_PIC } from "@/lib/constants";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import mixpanel from "mixpanel-browser";
import useKeyPress from "@/hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";
import FollowButton from "./FollowButton";
import AppContext from "@/context/app-context";
import { formatAddressShort, truncateWithEllipses } from "@/lib/utilities";
import RemoveRecommendationButton from "./RemoveRecommendationButton";

const getSmallImageUrl = (img_url) => {
  if (img_url && img_url.includes("https://lh3.googleusercontent.com")) {
    img_url = img_url.split("=")[0] + "=s128";
  }
  return img_url;
};

const Tiles = ({ topItems, setCurrentlyOpenModal }) => {
  const context = useContext(AppContext);

  return (
    topItems?.length > 0 && (
      <div className="flex flex-wrap justify-between sm:justify-start mb-4">
        {topItems.map((topItem, index) => (
          <div key={topItem?.nft_id}>
            {topItem?.token_img_url ? (
              <img
                className="w-[27vw] h-[27vw] max-w-[27vw] max-h-[27vw] sm:w-[12vw] sm:h-[12vw] sm:max-w-[80px] sm:max-h-[80px] object-cover cursor-pointer"
                style={{
                  marginRight:
                    index === topItems.length - 1 ||
                    context.windowSize?.width <= 420
                      ? 0
                      : 14,
                }}
                onClick={() => setCurrentlyOpenModal(topItem)}
                src={getSmallImageUrl(topItem?.token_img_url)}
              />
            ) : (
              <div
                className="w-[27vw] h-[27vw] max-w-[27vw] max-h-[27vw] sm:w-[12vw] sm:h-[12vw] sm:max-w-[80px] sm:max-h-[80px] bg-black cursor-pointer"
                style={{
                  marginRight:
                    index === topItems.length - 1 ||
                    context.windowSize?.width <= 420
                      ? 0
                      : 14,
                }}
                onClick={() => setCurrentlyOpenModal(topItem)}
              >
                <ReactPlayer
                  url={topItem?.token_animation_url}
                  playing={false}
                  loop
                  muted={true}
                  width={"100%"}
                  height={"100%"}
                  playsinline
                  // Disable downloading & right click
                  config={{
                    file: {
                      attributes: {
                        onContextMenu: (e) => e.preventDefault(),
                        controlsList: "nodownload",
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );
};

const RecommendedFollowItem = ({
  item,
  closeModal = () => {},
  liteVersion,
  removeRecommendation,
  followCallback = () => {},
  leftPadding,
}) => {
  const context = useContext(AppContext);
  const [followerCount, setFollowerCount] = useState();
  const isMyProfile = context?.myProfile?.profile_id === item?.profile_id;
  const topItems = liteVersion
    ? item?.top_items.slice(0, 3)
    : item?.top_items.slice(0, 6);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);
  const currentIndex = topItems?.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );
  const goToNext = () => {
    if (currentIndex < topItems.length - 1)
      setCurrentlyOpenModal(topItems[currentIndex + 1]);
  };
  const goToPrevious = () => {
    if (currentIndex - 1 >= 0)
      setCurrentlyOpenModal(topItems[currentIndex - 1]);
  };
  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
    }
    if (rightPress && currentlyOpenModal && !context.commentInputFocused) {
      mixpanel.track("Next NFT - keyboard");
      goToNext();
    }
    if (leftPress && currentlyOpenModal && !context.commentInputFocused) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [escPress, leftPress, rightPress]);

  return (
    <div className="flex flex-col w-full border-t-px dark:border-gray-800 relative">
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            hasNext={!(currentIndex === topItems.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
        </>
      ) : null}
      <div
        className="flex flex-col sm:flex-row sm:justify-between w-full border-t dark:border-gray-800 relative p-4 group"
        style={{ paddingLeft: leftPadding }}
      >
        <div className="flex">
          <Link href="/[profile]" as={`/${item?.username || item.address}`}>
            <a onClick={() => closeModal()} className="min-w-[42px]">
              <img
                className={`rounded-full cursor-pointer ${
                  liteVersion ? "w-11 h-11 mr-2.5" : "w-20 h-20 mr-5"
                }`}
                src={item?.img_url ? item?.img_url : DEFAULT_PROFILE_PIC}
              />
            </a>
          </Link>
          <div
            className={`flex flex-col justify-around truncate ${
              liteVersion ? "max-w-[7.5rem]" : ""
            }`}
          >
            <Link href="/[profile]" as={`/${item?.username || item.address}`}>
              <a onClick={() => closeModal()}>
                <h4
                  className={`font-medium cursor-pointer truncate dark:text-gray-300 hover:text-stpink dark:hover:text-stpink ${
                    liteVersion ? "mr-7" : "text-lg"
                  }`}
                >
                  {truncateWithEllipses(
                    item?.name,
                    context.isMobile ? 19 : 30
                  ) ||
                    formatAddressShort(item.address) ||
                    "Unnamed"}
                </h4>
              </a>
            </Link>
            {!liteVersion && (
              <div className="flex items-center">
                <div className="flex items-center dark:text-gray-400">
                  <div className="flex w-4 h-4 mr-2 text-gray-300">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <p className="text-sm font-medium mr-4">{followerCount}</p>
                  <div className="flex w-4 h-4 mr-2 text-gray-300">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <p className="text-sm font-medium mr-4">
                    {item?.like_count_total}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto">
          {!isMyProfile && (
            <div
              className="mt-5 w-full sm:mt-0 sm:w-auto"
              onClick={() => followCallback(item)}
            >
              <FollowButton
                item={item}
                followerCount={followerCount}
                setFollowerCount={setFollowerCount}
                compact
                homepage
              />
            </div>
          )}

          {liteVersion && (
            <RemoveRecommendationButton
              item={item}
              removeRecommendation={removeRecommendation}
            />
          )}
        </div>
      </div>
      <div style={{ paddingLeft: leftPadding }}>
        {context.windowSize?.width <= 420 ? (
          <Tiles
            topItems={topItems.slice(0, 3)}
            setCurrentlyOpenModal={setCurrentlyOpenModal}
          />
        ) : (
          <Tiles
            topItems={topItems}
            setCurrentlyOpenModal={setCurrentlyOpenModal}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendedFollowItem;
