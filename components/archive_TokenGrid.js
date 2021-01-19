import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import TokenHero from "../components/TokenHero";
import TokenSquare from "../components/TokenSquare";
import _ from "lodash";

const TokenGrid = ({
  items,
  hasHero,
  columnCount,
  myLikes,
  setMyLikes,
  allHeros,
  isDetail,
}) => {
  const [itemsList, setItemsList] = useState([]);
  const [itemsLikedList, setItemsLikedList] = useState([]);
  const [heroItem, setHeroItem] = useState(null);
  const [squareItems, setSquareItems] = useState([]);

  useEffect(() => {
    setItemsList(items.filter((item) => item.showtime.hide !== true));
  }, [items]);

  const handleLike = async ({ contract, token_id }) => {
    // Change myLikes via setMyLikes

    setMyLikes([
      ...myLikes,
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
    setMyLikes(
      myLikes.filter(
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
    var newItemsLikedList = [];

    if (itemsList.length > 0 && myLikes) {
      _.forEach(itemsList, function (item) {
        item.liked = false;

        _.forEach(myLikes, function (like) {
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
    }
  }, [itemsList, myLikes]);

  useEffect(() => {
    setHeroItem(
      hasHero && itemsLikedList.length > 0 ? itemsLikedList[0] : null
    );
    setSquareItems(
      hasHero && itemsLikedList.length > 0
        ? itemsLikedList.slice(1)
        : itemsLikedList
    );
  }, [itemsLikedList, hasHero]);

  return (
    <>
      {heroItem ? (
        <div key={heroItem.token_id} style={{ paddingBottom: 75 }}>
          <TokenHero
            item={heroItem}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            isDetail={isDetail}
          />
        </div>
      ) : null}

      {allHeros ? (
        squareItems.map((item) => {
          return (
            <div style={{ paddingBottom: 75 }} key={item.token_id}>
              <TokenHero
                item={item}
                handleLike={handleLike}
                handleUnlike={handleUnlike}
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
              <div style={{ paddingBottom: 75 }} key={item.token_id}>
                <TokenSquare
                  item={item}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
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
