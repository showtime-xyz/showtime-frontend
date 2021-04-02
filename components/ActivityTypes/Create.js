import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Create({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Created{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>
            .
          </>
        )}
        {count > 1 && (
          <>
            Created <span className="text-black">{count} items</span>.
          </>
        )}
      </div>
      <div className="flex mt-2">
        <ActivityImages nfts={nfts} />
      </div>
    </div>
  );
}
