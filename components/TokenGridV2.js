import { useState, useEffect, useContext } from "react";
import Masonry from "react-masonry-css";
import TokenSquareV2 from "../components/TokenSquareV2";
import TokenHeroV2 from "../components/TokenHeroV2";
import _ from "lodash";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";

const TokenGridV2 = ({
  items,
  hasHero,
  columnCount,
  allHeros,
  isDetail,
  isMobile,
}) => {
  const context = useContext(AppContext);

  const [itemsList, setItemsList] = useState([]);
  const [itemsLikedList, setItemsLikedList] = useState([]);
  const [myItemLikes, setMyItemLikes] = useState([]);

  useEffect(() => {
    setItemsList(
      items.filter((item) => item.token_hidden !== true && item.token_img_url)
    );
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

  const heroItem =
    hasHero && itemsLikedList.length > 0 ? itemsLikedList[0] : null;
  const squareItems =
    hasHero && itemsLikedList.length > 0
      ? itemsLikedList.slice(1)
      : itemsLikedList;

  return (
    <>
      {heroItem ? (
        <div key={heroItem.tid} style={{ paddingBottom: 75 }}>
          <TokenHeroV2
            item={heroItem}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            isDetail={isDetail}
            isMobile={isMobile}
          />
        </div>
      ) : null}

      {allHeros ? (
        squareItems.map((item) => {
          return (
            <div style={{ paddingBottom: 75 }} key={item.tid}>
              <TokenHeroV2
                item={item}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
                isMobile={isMobile}
              />
            </div>
          );
        })
      ) : (
        <Masonry
          breakpointCols={columnCount}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {squareItems.map((item) => {
            return (
              <div style={{ paddingBottom: 30 }} key={item.tid}>
                <TokenSquareV2
                  item={item}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  isMobile={isMobile}
                />
              </div>
            );
          })}
        </Masonry>
      )}
    </>
  );
};

export default TokenGridV2;
