import { useState, useEffect } from "react";
import _ from "lodash";

const TokenGrid2 = ({
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
  const [myItemLikes, setMyItemLikes] = useState([]);

  useEffect(() => {
    setItemsList(items.filter((item) => item.showtime.hide !== true));
  }, [items]);

  useEffect(() => {
    setMyItemLikes(myLikes);
  }, [myLikes]);

  useEffect(() => {
    setItemsLikedList(itemsList);
  }, [itemsList]);

  return (
    <>
      <div>Token Grid 2</div>

      {itemsLikedList.map((item) => (
        <div key={item.token_id}>
          {item.token_id}
          <br />
        </div>
      ))}
    </>
  );
};

export default TokenGrid2;
