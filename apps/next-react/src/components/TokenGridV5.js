import { useState, useEffect, useContext, createRef } from "react";

import AppContext from "@/context/app-context";
import useKeyPress from "@/hooks/useKeyPress";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactSortable } from "react-sortablejs";

import ModalTokenDetail from "./ModalTokenDetail";
import BurnModal from "./Modals/BurnModal";
import TransferModal from "./Modals/TransferModal";
import TokenCard from "./TokenCard";
import BuyModal from "./UI/Modals/BuyModal";
import ListModal from "./UI/Modals/ListModal";
import UnlistModal from "./UI/Modals/UnlistModal";

const TokenGridV5 = ({
  dataLength,
  hasMore,
  next,
  isLoading,
  endMessage,
  scrollThreshold,
  showUserHiddenItems,
  showDuplicates,
  setHasUserHiddenItems,
  items,
  setItems,
  isMyProfile,
  listId,
  detailsModalCloseOnKeyChange,
  changeSpotlightItem,
  pageProfile,
  isLoadingMore,
  isChangingOrder,
  refreshCurrent,
}) => {
  const context = useContext(AppContext);
  const [itemsList, setItemsList] = useState([]);

  const handleRemoveItem = (nft_id) => {
    setItems(items.filter((item) => item.nft_id != nft_id));
  };
  //const [showDuplicateNFTs, setShowDuplicateNFTs] = useState({});
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState(null);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);
  const [transferModal, setTransferModal] = useState(null);
  const [burnModal, setBurnModal] = useState(null);
  const [listModal, setListModal] = useState(null);
  const [unlistModal, setUnlistModal] = useState(null);
  const [buyModal, setBuyModal] = useState(null);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  const handleSetItemsList = (newList) => {
    setItems(newList);
  };

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
    if (rightPress && currentlyOpenModal && !context.commentInputFocused) {
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
    if (leftPress && currentlyOpenModal && !context.commentInputFocused) {
      mixpanel.track("Prior NFT - keyboard");
      goToPrevious();
    }
  }, [leftPress, itemsList]);

  useEffect(() => {
    const itemsWithRefs = [];
    _.forEach(items, (item) => {
      item.imageRef = createRef();
      itemsWithRefs.push(item);
    });
    setItemsList(itemsWithRefs);
  }, [items]);

  const currentIndex = itemsList.findIndex(
    (i) => i.nft_id === currentlyOpenModal?.nft_id
  );

  if (!isLoading && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 mt-20 mb-24">
        <div>
          <FontAwesomeIcon className="w-12 h-12" icon={faThLarge} />
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
            hasNext={!(currentIndex === itemsList.length - 1)}
            hasPrevious={!(currentIndex === 0)}
          />
          <BurnModal
            open={!!burnModal}
            onClose={() => setBurnModal(null)}
            token={burnModal}
          />
          <TransferModal
            open={!!transferModal}
            onClose={() => setTransferModal(null)}
            token={transferModal}
          />
          <ListModal
            open={!!listModal}
            onClose={() => setListModal(null)}
            token={listModal}
            onSuccess={refreshCurrent}
          />
          <UnlistModal
            open={!!unlistModal}
            onClose={() => setUnlistModal(null)}
            token={unlistModal}
            onSuccess={refreshCurrent}
          />
          <BuyModal
            open={!!buyModal}
            onClose={() => setBuyModal(null)}
            token={buyModal} // BuyModal value is the individual item in items
          />
        </>
      ) : null}
      <InfiniteScroll
        style={{ overflow: null }}
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        endMessage={endMessage}
        scrollThreshold={scrollThreshold}
      >
        {isLoading ? (
          <div className="mx-auto items-center flex justify-center overflow-hidden py-4 mt-16">
            <div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 dark:border-gray-300 border-t-gray-800 dark:border-t-gray-800 animate-spin" />
          </div>
        ) : (
          <>
            {isChangingOrder ? (
              <ReactSortable
                list={itemsList}
                animation={200}
                delayOnTouchStart={true}
                delay={2}
                setList={handleSetItemsList}
                className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {itemsList.map((item) => (
                  <TokenCard
                    key={item.nft_id}
                    originalItem={item}
                    currentlyPlayingVideo={currentlyPlayingVideo}
                    setCurrentlyPlayingVideo={setCurrentlyPlayingVideo}
                    currentlyOpenModal={currentlyOpenModal}
                    setCurrentlyOpenModal={setCurrentlyOpenModal}
                    setTransferModal={setTransferModal}
                    setBurnModal={setBurnModal}
                    setListModal={setListModal}
                    setUnlistModal={setUnlistModal}
                    setBuyModal={setBuyModal}
                    isMyProfile={isMyProfile}
                    listId={listId}
                    changeSpotlightItem={changeSpotlightItem}
                    pageProfile={pageProfile}
                    handleRemoveItem={handleRemoveItem}
                    showUserHiddenItems={showUserHiddenItems}
                    showDuplicates={showDuplicates}
                    setHasUserHiddenItems={setHasUserHiddenItems}
                    isChangingOrder={isChangingOrder}
                  />
                ))}
              </ReactSortable>
            ) : (
              <div
                className={
                  "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }
              >
                {itemsList.map((item) => (
                  <TokenCard
                    key={item.nft_id}
                    originalItem={item}
                    currentlyPlayingVideo={currentlyPlayingVideo}
                    setCurrentlyPlayingVideo={setCurrentlyPlayingVideo}
                    currentlyOpenModal={currentlyOpenModal}
                    setCurrentlyOpenModal={setCurrentlyOpenModal}
                    setTransferModal={setTransferModal}
                    setBurnModal={setBurnModal}
                    setListModal={setListModal}
                    setUnlistModal={setUnlistModal}
                    setBuyModal={setBuyModal}
                    isMyProfile={isMyProfile}
                    listId={listId}
                    changeSpotlightItem={changeSpotlightItem}
                    pageProfile={pageProfile}
                    handleRemoveItem={handleRemoveItem}
                    showUserHiddenItems={showUserHiddenItems}
                    showDuplicates={showDuplicates}
                    setHasUserHiddenItems={setHasUserHiddenItems}
                  />
                ))}
              </div>
            )}
            {isLoadingMore ? (
              <div className="mx-auto items-center flex justify-center overflow-hidden py-4">
                <div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
              </div>
            ) : null}
          </>
        )}
      </InfiniteScroll>
    </>
  );
};

export default TokenGridV5;
