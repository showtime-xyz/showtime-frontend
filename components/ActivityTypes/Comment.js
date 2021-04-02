import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Comment({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        Commented on{" "}
        <span className="text-black">
          {count === 1 ? (
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="hover:text-stpink">{nfts[0].title}</a>
            </Link>
          ) : (
            `${count} items`
          )}
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
