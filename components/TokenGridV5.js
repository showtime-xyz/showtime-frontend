import { useState, useEffect, useContext, createRef } from "react";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import AppContext from "../context/app-context";
import TokenCard from "./TokenCard";
import useKeyPress from "../hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";

const TokenGridV5 = ({
  dataLength,
  hasMore,
  next,
  endMessage,
  scrollThreshold,
  showUserHiddenItems,

  items,
  isDetail,
  //onFinish,
  isLoading,
  listId,
  isMyProfile,
  openCardMenu,
  setOpenCardMenu,
  detailsModalCloseOnKeyChange,
  changeSpotlightItem,
  extraColumn,
  pageProfile,
  isLoadingMore,
}) => {
  const context = useContext(AppContext);
  const [itemsList, setItemsList] = useState([]);

  const handleRemoveItem = (nft_id) => {
    setItemsList(itemsList.filter((item) => item.nft_id != nft_id));
  };
  //const [showDuplicateNFTs, setShowDuplicateNFTs] = useState({});
  //const [itemsShowing, setItemsShowing] = useState(0);
  //const deduplicatedItemsList = itemsList
  //  .filter((item) => {
  //    return showUserHiddenItems
  //      ? true
  //      : !userHiddenItems
  //      ? true
  //      : !userHiddenItems.includes(item.nft_id);
  //  })
  //  .filter((item) => {
  //    const hash = item?.token_img_url || item?.token_animation_url;
  //    return !item?.hidden_duplicate ? true : showDuplicateNFTs[hash];
  //  });
  //const [hasMore, setHasMore] = useState(true);
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState(null);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  //const itemsToLoad = extraColumn ? 12 : 9;

  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
      setCurrentlyPlayingVideo(null);
    }
  }, [escPress]);

  useEffect(() => {
    setCurrentlyOpenModal(null);
  }, [detailsModalCloseOnKeyChange]);

  const goToNext = () => {
    const currentIndex = itemsList.indexOf(currentlyOpenModal);
    if (currentIndex < itemsList.length - 1) {
      // Get position of next card image and scroll down
      const bodyRect = document.body.getBoundingClientRect();
      if (itemsList[currentIndex + 1].imageRef.current) {
        window.scrollTo({
          top:
            itemsList[currentIndex + 1].imageRef.current.getBoundingClientRect()
              .top -
            bodyRect.top -
            70,
          behavior: "smooth",
        });
      }

      setCurrentlyOpenModal(itemsList[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (rightPress && currentlyOpenModal) {
      mixpanel.track("Next NFT - keyboard");
      goToNext();
    }
  }, [rightPress, itemsList]);

  const goToPrevious = () => {
    const currentIndex = itemsList.indexOf(currentlyOpenModal);
    if (currentIndex - 1 >= 0) {
      // Get position of previous card image and scroll up
      const bodyRect = document.body.getBoundingClientRect();
      if (itemsList[currentIndex - 1].imageRef.current) {
        window.scrollTo({
          top:
            itemsList[currentIndex - 1].imageRef.current.getBoundingClientRect()
              .top -
            bodyRect.top -
            70,
          behavior: "smooth",
        });
      }

      setCurrentlyOpenModal(itemsList[currentIndex - 1]);
    }
  };

  useEffect(() => {
    if (leftPress && currentlyOpenModal) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [leftPress, itemsList]);

  useEffect(() => {
    /*
    const validItems = items.filter(
      (item) =>
        (item.token_hidden !== 1 || isDetail) &&
        (item.token_img_url || item.token_animation_url)
    );
    const groupedItems = _.groupBy(
      validItems,
      (item) => item.token_img_url || item.token_animation_url
    );
    const uniqueItems = Object.values(groupedItems)
      .map((itemGroup) =>
        itemGroup.length > 1
          ? itemGroup.map((item, index) => ({
              ...item,
              hidden_duplicate: index !== 0,
              duplicate_count: itemGroup.length,
            }))
          : itemGroup[0]
      )
      .flat();
    */

    const itemsWithRefs = [];
    _.forEach(items, (item) => {
      item.imageRef = createRef();
      itemsWithRefs.push(item);
    });
    setItemsList(itemsWithRefs);
    //setHasMore(true);
  }, [items]);

  /*useEffect(() => {
    if (context.isMobile) {
      setItemsShowing(4);
    } else {
      setItemsShowing(itemsToLoad);
    }
  }, [context.isMobile]);*/

  /*
  const fetchMoreData = () => {
    if (itemsShowing + itemsToLoad > itemsList.length) {
      setHasMore(false);
      onFinish ? onFinish() : null;
    }
    setItemsShowing(itemsShowing + itemsToLoad);
  };
  */

  const currentIndex = itemsList.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );

  if (!isLoading && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 mt-20 mb-24">
        <div>
          {" "}
          <FontAwesomeIcon style={{ height: 48, width: 48 }} icon={faThLarge} />
        </div>
        <div className="p-3 text-center">No items found.</div>
      </div>
    );
  }
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
            hasNext={!(currentIndex === itemsList.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
        </>
      ) : null}
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        endMessage={endMessage}
        scrollThreshold={scrollThreshold}
      >
        {isLoading ? (
          <div className="mx-auto items-center flex justify-center overflow-hidden py-4 mt-16">
            <div className="loading-card-spinner" />
          </div>
        ) : (
          <>
            <div
              className={`grid ${
                extraColumn
                  ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "lg:grid-cols-2 xl:grid-cols-3"
              }  overflow-hidden`}
            >
              {itemsList.map((item) => (
                <TokenCard
                  key={item.nft_id}
                  originalItem={item}
                  //columns={context.columns}
                  //isMobile={context.isMobile}
                  currentlyPlayingVideo={currentlyPlayingVideo}
                  setCurrentlyPlayingVideo={setCurrentlyPlayingVideo}
                  currentlyOpenModal={currentlyOpenModal}
                  setCurrentlyOpenModal={setCurrentlyOpenModal}
                  //showDuplicateNFTs={showDuplicateNFTs}
                  //setShowDuplicateNFTs={setShowDuplicateNFTs}
                  isMyProfile={isMyProfile}
                  listId={listId}
                  openCardMenu={openCardMenu}
                  setOpenCardMenu={setOpenCardMenu}
                  //userHiddenItems={userHiddenItems}
                  //setUserHiddenItems={setUserHiddenItems}
                  //refreshItems={refreshItems}
                  changeSpotlightItem={changeSpotlightItem}
                  pageProfile={pageProfile}
                  handleRemoveItem={handleRemoveItem}
                  showUserHiddenItems={showUserHiddenItems}
                />
              ))}
            </div>
            {isLoadingMore ? (
              <div className="mx-auto items-center flex justify-center overflow-hidden py-4">
                <div className="loading-card-spinner" />
              </div>
            ) : null}
          </>
        )}
      </InfiniteScroll>
    </>
  );
};

export default TokenGridV5;
