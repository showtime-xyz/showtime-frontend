import { useState, useEffect, useContext, createRef } from "react";
import _ from "lodash";
import mixpanel from "mixpanel-browser";
import InfiniteScroll from "react-infinite-scroll-component";
import AppContext from "../context/app-context";
import TokenCard from "./TokenCard";
import useKeyPress from "../hooks/useKeyPress";
import ModalTokenDetail from "./ModalTokenDetail";

const TokenGridV4 = ({ items, isDetail, onFinish }) => {
  const context = useContext(AppContext);

  const [itemsList, setItemsList] = useState([]);
  const [itemsLikedList, setItemsLikedList] = useState([]);
  const [myItemLikes, setMyItemLikes] = useState([]);
  const [itemsShowing, setItemsShowing] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMobile, setIsMobile] = useState(null);
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

  useEffect(() => {
    if (rightPress && currentlyOpenModal) {
      const currentIndex = itemsLikedList.indexOf(currentlyOpenModal);
      if (currentIndex < itemsLikedList.length - 1) {
        if (itemsShowing - 6 < currentIndex - 1) {
          fetchMoreData();
        }

        // Get position of next card image and scroll down
        const bodyRect = document.body.getBoundingClientRect();
        if (itemsLikedList[currentIndex + 1].imageRef.current) {
          window.scrollTo({
            top:
              itemsLikedList[
                currentIndex + 1
              ].imageRef.current.getBoundingClientRect().top -
              bodyRect.top -
              70,
            behavior: "smooth",
          });
        }

        setCurrentlyOpenModal(itemsLikedList[currentIndex + 1]);
      }
    }
  }, [rightPress, itemsLikedList]);

  useEffect(() => {
    if (leftPress && currentlyOpenModal) {
      const currentIndex = itemsLikedList.indexOf(currentlyOpenModal);
      if (currentIndex - 1 >= 0) {
        // Get position of previous card image and scroll up
        const bodyRect = document.body.getBoundingClientRect();
        if (itemsLikedList[currentIndex - 1].imageRef.current) {
          window.scrollTo({
            top:
              itemsLikedList[
                currentIndex - 1
              ].imageRef.current.getBoundingClientRect().top -
              bodyRect.top -
              70,
            behavior: "smooth",
          });
        }

        setCurrentlyOpenModal(itemsLikedList[currentIndex - 1]);
      }
    }
  }, [leftPress, itemsLikedList]);

  const addRefs = (list) => {
    var newList = [];
    _.forEach(list, function (item) {
      item.imageRef = createRef();
      newList.push(item);
    });
    return newList;
  };

  useEffect(() => {
    setItemsList(
      addRefs(
        items.filter(
          (item) =>
            (item.token_hidden !== 1 || isDetail) &&
            (item.token_img_url || item.token_animation_url)
        )
      )
    );
    if (isMobile) {
      setItemsShowing(4);
    } else {
      setItemsShowing(8);
    }

    setHasMore(true);
  }, [items, isMobile]);

  useEffect(() => {
    setMyItemLikes(context.myLikes ? context.myLikes : []);
  }, [context.myLikes]);

  const handleLike = async (tid) => {
    // Change myLikes via setMyLikes
    context.setMyLikes([...context.myLikes, tid]);

    // Update the like counts for each item
    var newItemsList = [...itemsList];
    _.forEach(newItemsList, function (item) {
      if (item.tid === tid) {
        item.like_count = item.like_count + 1;
      }
    });
    setItemsList(newItemsList);

    // Post changes to the API
    await fetch(`/api/like/${tid}`, {
      method: "post",
    });

    mixpanel.track("Liked item");
  };

  const fetchMoreData = () => {
    if (itemsShowing + 8 > itemsLikedList.length) {
      setHasMore(false);
      onFinish ? onFinish() : null;
    }
    setItemsShowing(itemsShowing + 8);
  };

  const handleUnlike = async (tid) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(context.myLikes.filter((item) => !(item === tid)));

    // Update the like counts for each item
    var newItemsList = [...itemsList];
    _.forEach(newItemsList, function (item) {
      if (item.tid === tid) {
        item.like_count = item.like_count - 1;
      }
    });
    setItemsList(newItemsList);

    // Post changes to the API
    await fetch(`/api/unlike/${tid}`, {
      method: "post",
    });

    mixpanel.track("Unliked item");
  };

  // Augment content with my like status
  useEffect(() => {
    const newItemsLikedList = [];
    _.forEach([...itemsList], function (item) {
      item.liked = false;
      _.forEach([...myItemLikes], function (like) {
        if (item.tid === like) {
          item.liked = true;
        }
      });

      // Add ref to the image for getting dimensions

      newItemsLikedList.push(item);
    });
    setItemsLikedList(newItemsLikedList);
  }, [itemsList, myItemLikes]);

  const [columns, setColumns] = useState(null);

  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setColumns(1);
      setIsMobile(true);
    } else if (context.windowSize && context.windowSize.width < 1200) {
      setColumns(2);
      setIsMobile(false);
    } else if (context.windowSize && context.windowSize.width < 1600) {
      setColumns(3);
      setIsMobile(false);
    } else {
      setColumns(4);
      setIsMobile(false);
    }
  }, [context.windowSize]);

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
            showTooltip={isMobile === false}

            /*likeButton={
              <LikeButton
                isLiked={this.props.item.liked}
                likeCount={this.props.item.like_count}
                handleLike={this.props.handleLike}
                handleLikeArgs={{
                  tid: this.props.item.tid,
                }}
                handleUnlike={this.props.handleUnlike}
                handleUnlikeArgs={{
                  tid: this.props.item.tid,
                }}
                showTooltip={this.props.isMobile === false}
              />
            }
            shareButton={
              <ShareButton
                url={
                  window.location.protocol +
                  "//" +
                  window.location.hostname +
                  (window.location.port ? ":" + window.location.port : "") +
                  `/t/${this.props.item.contract_address}/${this.props.item.token_id}`
                }
                type={"item"}
              />
            }
            originalImageDimensions={
              this.imageRef && this.imageRef.current
                ? {
                    height: this.imageRef.current.clientHeight,
                    width: this.imageRef.current.clientWidth,
                  }
                : { height: null, width: null }
            }*/
          />
        </>
      ) : null}
      <InfiniteScroll
        dataLength={itemsShowing}
        next={fetchMoreData}
        hasMore={hasMore}
        /*loader={
        <div>
          <h4 className="w-full text-center">Loading more...</h4>
        </div>
      }*/
      >
        <div
          className={`grid grid-cols-${columns} mx-auto`}
          style={columns === 1 ? null : { width: columns * (375 + 20) }}
        >
          {itemsLikedList.slice(0, itemsShowing).map((item) => (
            <TokenCard
              key={item.tid}
              item={item}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              columns={columns}
              isMobile={isMobile}
              currentlyPlayingVideo={currentlyPlayingVideo}
              setCurrentlyPlayingVideo={setCurrentlyPlayingVideo}
              currentlyOpenModal={currentlyOpenModal}
              setCurrentlyOpenModal={setCurrentlyOpenModal}
            />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default TokenGridV4;
