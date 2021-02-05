import { useState, useEffect, useContext } from "react";
import _ from "lodash";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import TokenSquareV3 from "./TokenSquareV3";
import TokenHeroV2 from "./TokenHeroV2";
import InfiniteScroll from "react-infinite-scroll-component";

const TokenGridV4 = ({ items, isDetail, onFinish }) => {
  const context = useContext(AppContext);

  const [itemsList, setItemsList] = useState([]);
  const [itemsLikedList, setItemsLikedList] = useState([]);
  const [myItemLikes, setMyItemLikes] = useState([]);
  const [itemsShowing, setItemsShowing] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setItemsList(
      items.filter(
        (item) => (item.token_hidden !== 1 || isDetail) && item.token_img_url
      )
    );
    setItemsShowing(8);
    setHasMore(true);
    console.log(items);
  }, [items]);

  useEffect(() => {
    setMyItemLikes(context.myLikes ? context.myLikes : []);
  }, [context.myLikes]);

  const handleLike = async ({ tid }) => {
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

  const handleUnlike = async ({ tid }) => {
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

      newItemsLikedList.push(item);
    });
    setItemsLikedList(newItemsLikedList);
  }, [itemsList, myItemLikes]);

  const [columns, setColumns] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
    <InfiniteScroll
      dataLength={itemsShowing}
      next={fetchMoreData}
      hasMore={hasMore}

      //loader={
      //  <div>
      //    <h4 className="w-full text-center">Loading more...</h4>
      //  </div>
      //}
    >
      <div
        className={`grid grid-cols-${columns} mx-auto`}
        style={columns === 1 ? null : { width: columns * (375 + 20) }}
      >
        {itemsLikedList.slice(0, itemsShowing).map((item) => (
          <TokenSquareV3
            key={item.tid}
            item={item}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            columns={columns}
            isMobile={isMobile}
          />
        ))}
      </div>
    </InfiniteScroll>
  );

  return columns ? (
    isDetail ? (
      itemsLikedList && itemsLikedList.length > 0 ? (
        <TokenHeroV2
          item={itemsLikedList[0]}
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          isDetail={isDetail}
        />
      ) : null
    ) : (
      <div
        className={`grid grid-cols-${columns} mx-auto`}
        style={columns === 1 ? null : { width: columns * (375 + 20) }}
      >
        {itemsLikedList.map((item) => {
          return (
            <TokenSquareV3
              key={item.tid}
              item={item}
              handleLike={handleLike}
              handleUnlike={handleUnlike}
              columns={columns}
            />
          );
        })}
      </div>
    )
  ) : null;
};

export default TokenGridV4;
