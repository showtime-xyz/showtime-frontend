import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Like({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-gray-500">
        Liked{" "}
        <span className="text-black">
          {count === 1 ? (
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="hover:text-stpink">{nfts[0].title}</a>
            </Link>
          ) : (
            `${count} items`
          )}
        </span>
        .
      </div>
      <ActivityImages nfts={nfts} />
    </div>
  );
}
