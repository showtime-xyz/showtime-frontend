import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Buy({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Bought{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>{" "}
            from{" "}
            <Link
              href="/[profile]"
              as={`/${act.seller?.username || act.seller?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{act.seller?.name}</a>
            </Link>
            .
          </>
        )}
        {count > 1 && (
          <>
            Bought <span className="text-black">{count} items</span>.
          </>
        )}
      </div>
      <div className="flex mt-2">
        <ActivityImages nfts={nfts} />
      </div>
    </div>
  );
}
