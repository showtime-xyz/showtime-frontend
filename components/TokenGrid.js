import { useState, useEffect, useContext } from "react";
import Masonry from "react-masonry-css";
import TokenHero from "../components/TokenHero";
import TokenSquare from "../components/TokenSquare";
import _ from "lodash";
import AppContext from "../context/app-context";

const TokenGrid = ({
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
      items.filter((item) => item.showtime.hide !== true && item.image_url)
    );
  }, [items]);

  useEffect(() => {
    setMyItemLikes(context.myLikes ? context.myLikes : []);
  }, [context.myLikes]);

  const handleLike = async ({ contract, token_id }) => {
    // Change myLikes via setMyLikes

    context.setMyLikes([
      ...context.myLikes,
      {
        contract: contract,
        token_id: token_id,
      },
    ]);

    // Update the like counts for each item
    var newItemsList = [...itemsList];
    _.forEach(newItemsList, function (item) {
      if (
        item.asset_contract.address === contract &&
        item.token_id === token_id
      ) {
        item.showtime.like_count = item.showtime.like_count + 1;
      }
    });
    setItemsList(newItemsList);

    // Post changes to the API
    await fetch(`/api/like/${contract}_${token_id}`, {
      method: "post",
    });
  };

  const handleUnlike = async ({ contract, token_id }) => {
    // Change myLikes via setMyLikes
    context.setMyLikes(
      context.myLikes.filter(
        (item) => !(item.contract === contract && item.token_id === token_id)
      )
    );

    // Update the like counts for each item
    var newItemsList = [...itemsList];
    _.forEach(newItemsList, function (item) {
      if (
        item.asset_contract.address === contract &&
        item.token_id === token_id
      ) {
        item.showtime.like_count = item.showtime.like_count - 1;
      }
    });
    setItemsList(newItemsList);

    // Post changes to the API
    await fetch(`/api/unlike/${contract}_${token_id}`, {
      method: "post",
    });
  };

  // Augment content with my like status
  useEffect(() => {
    const newItemsLikedList = [];
    _.forEach([...itemsList], function (item) {
      item.liked = false;
      _.forEach([...myItemLikes], function (like) {
        if (
          item.asset_contract.address === like.contract &&
          item.token_id === like.token_id
        ) {
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
        <div
          key={heroItem.asset_contract.address + "_" + heroItem.token_id}
          style={{ paddingBottom: 75 }}
        >
          <TokenHero
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
            <div
              style={{ paddingBottom: 75 }}
              key={item.asset_contract.address + "_" + item.token_id}
            >
              <TokenHero
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
              <div
                style={{ paddingBottom: 75 }}
                key={item.asset_contract.address + "_" + item.token_id}
              >
                <TokenSquare
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

export default TokenGrid;
