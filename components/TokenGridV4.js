import { useState, useEffect, useContext, createRef } from "react";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import InfiniteScroll from "react-infinite-scroll-component";
import AppContext from "../context/app-context";
import TokenCard from "./TokenCard";
import useKeyPress from "../hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";

const TokenGridV4 = ({ items, isDetail, onFinish, filterTabs, isLoading }) => {
  const context = useContext(AppContext);
  const [itemsList, setItemsList] = useState([]);
  const [showDuplicateNFTs, setShowDuplicateNFTs] = useState({});
  const [itemsShowing, setItemsShowing] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState(null);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState(null);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");
  const escPress = useKeyPress("Escape");

  useEffect(() => {
    if (escPress) {
      setCurrentlyOpenModal(null);
      setCurrentlyPlayingVideo(null);
    }
  }, [escPress]);

  const goToNext = () => {
    const currentIndex = itemsList.indexOf(currentlyOpenModal);
    if (currentIndex < itemsList.length - 1) {
      if (itemsShowing - 6 < currentIndex - 1) {
        fetchMoreData();
      }

      // Get position of next card image and scroll down
      const bodyRect = document.body.getBoundingClientRect();
      if (itemsList[currentIndex + 1].imageRef.current) {
        window.scrollTo({
          top:
            itemsList[
              currentIndex + 1
            ].imageRef.current.getBoundingClientRect().top -
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
            itemsList[
              currentIndex - 1
            ].imageRef.current.getBoundingClientRect().top -
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

  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  useEffect(() => {
    const currentIndex = itemsList.indexOf(currentlyOpenModal);
    if (currentIndex === 0) {
      setHasPrevious(false);
    } else {
      setHasPrevious(true);
    }

    if (currentIndex === itemsList.length - 1) {
      setHasNext(false);
    } else {
      setHasNext(true);
    }
  }, [currentlyOpenModal]);

  useEffect(() => {
    const validItems = items.filter(
      item =>
        (item.token_hidden !== 1 || isDetail) &&
        (item.token_img_url || item.token_animation_url)
    );
    const groupedItems = _.groupBy(validItems, item => item.token_img_url || item.token_animation_url);
    const uniqueItems = Object.values(groupedItems).map(itemGroup => {
      return itemGroup.length > 1
        ? itemGroup.map((item, index) => ({ ...item, hidden_duplicate: index !== 0, duplicate_count: itemGroup.length }))
        : itemGroup[0];
    }).flat();
    const myLikes = context.myLikes || [];
    const itemsWithLikedMetadata = myLikes.length > 0
      ? uniqueItems.map(item => ({ ...item, liked: myLikes.includes(item.nft_id) }))
      : uniqueItems;
    const itemsWithRefs = [];
    _.forEach(itemsWithLikedMetadata, (item) => {
      item.imageRef = createRef();
      itemsWithRefs.push(item);
    });
    setItemsList(itemsWithRefs);
    setHasMore(true);
  }, [items, context.myLikes]);

  useEffect(() => {
    if (context.isMobile) {
      setItemsShowing(4);
    } else {
      setItemsShowing(8);
    }
  }, [context.isMobile]);


  const fetchMoreData = () => {
    if (itemsShowing + 8 > itemsList.length) {
      setHasMore(false);
      onFinish ? onFinish() : null;
    }
    setItemsShowing(itemsShowing + 8);
  };

  const handleLike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, nft_id]);
    if (currentlyOpenModal && currentlyOpenModal.nft_id === nft_id) {
      setCurrentlyOpenModal({ ...currentlyOpenModal, liked: true })
    }
    // Post changes to the API
    await fetch(`/api/like_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };

  const handleUnlike = async (nft_id) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === nft_id)));
    if (currentlyOpenModal && currentlyOpenModal.nft_id === nft_id) {
      setCurrentlyOpenModal({ ...currentlyOpenModal, liked: false })
    }
    // Post changes to the API
    await fetch(`/api/unlike_v3/${nft_id}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalTokenDetail
            isOpen={currentlyOpenModal}
            setEditModalOpen={setCurrentlyOpenModal}
            item={currentlyOpenModal}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            showTooltip={context.isMobile === false}
            goToNext={goToNext}
            goToPrevious={goToPrevious}
            columns={context.columns}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </>
      ) : null}
      <InfiniteScroll
        dataLength={itemsShowing}
        next={fetchMoreData}
        hasMore={hasMore}
      >
        <div
          className={`mx-auto`}
          style={
            context.columns === 1
              ? null
              : { width: context.columns * (375 + 20) }
          }
        >
          {filterTabs}
        </div>
        {isLoading ? (
          <div
            className="mx-auto items-center flex justify-center overflow-hidden"
            style={
              context.columns === 1
                ? null
                : { width: context.columns * (375 + 20) }
            }
          >
            <div className="loading-card-spinner" />
          </div>
        ) : (
          <div
            className={`grid grid-cols-${context.columns} mx-auto overflow-hidden`}
            style={
              context.columns === 1
                ? null
                : { width: context.columns * (375 + 20) }
            }
          >
            {itemsList
              .filter(item => {
                const hash = item.token_img_url || item.token_animation_url;
                return !item.hidden_duplicate ? true : showDuplicateNFTs[hash];
              })
              .slice(0, itemsShowing)
              .map((item) => (
                <TokenCard
                  key={item.nft_id}
                  item={item}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  columns={context.columns}
                  isMobile={context.isMobile}
                  currentlyPlayingVideo={currentlyPlayingVideo}
                  setCurrentlyPlayingVideo={setCurrentlyPlayingVideo}
                  currentlyOpenModal={currentlyOpenModal}
                  setCurrentlyOpenModal={setCurrentlyOpenModal}
                  showDuplicateNFTs={showDuplicateNFTs}
                  setShowDuplicateNFTs={setShowDuplicateNFTs}
                />
              ))}
          </div>
        )}
      </InfiniteScroll>
    </>
  );
};

export default TokenGridV4;
