import React from "react";
import ActivityImages from "../ActivityImages";

export default function Sale({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Sold <span className="text-black">{nfts[0].title}</span> to{" "}
            <span className="text-black">{act.buyer?.name}</span>.
          </>
        )}
        {count > 1 && (
          <>
            Sold <span className="text-black">{count} items.</span>
          </>
        )}
      </div>
      <div className="flex mt-2">
        <ActivityImages nfts={nfts} />
      </div>
    </div>
  );
}
