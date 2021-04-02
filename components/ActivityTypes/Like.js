import React from "react";
import ActivityImages from "../ActivityImages";

export default function Like({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-gray-500">
        Liked{" "}
        <span className="text-black">
          {count === 1 ? nfts[0].title : `${count} items`}
        </span>
        .
      </div>
      <ActivityImages nfts={nfts} />
    </div>
  );
}
