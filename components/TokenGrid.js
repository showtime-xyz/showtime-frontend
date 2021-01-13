import React from "react";

const TokenGrid = ({ items }) => {
  return (
    <div>
      {items
        ? items.map((item) => <div key={item.token_id}>{item.token_id}</div>)
        : null}
    </div>
  );
};

export default TokenGrid;
