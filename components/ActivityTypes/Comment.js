import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Comment({ act }) {
  const { nfts } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Commented on{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>
            .
          </>
        )}
        {count === 2 && (
          <>
            Commented on{" "}
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
            Commented on{" "}
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
            Commented on{" "}
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
