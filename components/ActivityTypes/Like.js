import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Like({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="mb-2 text-gray-500">
        {count === 1 && (
          <>
            Liked{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>
            .
          </>
        )}
        {count === 2 && (
          <>
            Liked{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>{" "}
            and{" "}
            <Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[1].title}</a>
            </Link>
            .
          </>
        )}
        {count === 3 && (
          <>
            Liked{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>
            ,{" "}
            <Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[1].title}</a>
            </Link>{" "}
            and{" "}
            <Link href={`/t/${nfts[2].contract_address}/${nfts[2].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[2].title}</a>
            </Link>
            .
          </>
        )}
        {count > 3 && (
          <>
            Liked{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>
            ,{" "}
            <Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[1].title}</a>
            </Link>{" "}
            and {count - 2} others.
          </>
        )}
      </div>
      <ActivityImages nfts={nfts} />
    </div>
  );
}
