import React from "react";
import ActivityImages from "../ActivityImages";

export default function Comment({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        Commented on{" "}
        <span className="text-black">
          {count === 1 ? nfts[0].title + ":" : `${count} items.`}
        </span>
      </div>
      {count === 1 && (
        <div className="bg-gray-200 my-2 p-2 px-4 rounded-2xl w-max">
          {nfts[0].comment}
        </div>
      )}
      <div className="flex mt-2">
        <ActivityImages nfts={nfts} />
      </div>
    </div>
  );
}
