import React from "react";
import Link from "next/link";
import ActivityImages from "../ActivityImages";

export default function Comment({ act }) {
  const { nfts, comments } = act;
  const count = nfts?.length;
  return (
    <div className="flex flex-col max-w-full">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Commented on{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[0].token_name}
              </a>
            </Link>
            .
          </>
        )}
        {count === 2 && (
          <>
            Commented on{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[0].token_name}
              </a>
            </Link>{" "}
            and{" "}
            <Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[1].token_name}
              </a>
            </Link>
            .
          </>
        )}
        {count === 3 && (
          <>
            Commented on{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[0].token_name}
              </a>
            </Link>
            ,{" "}
            <Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[1].token_name}
              </a>
            </Link>{" "}
            and{" "}
            <Link href={`/t/${nfts[2].contract_address}/${nfts[2].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[2].token_name}
              </a>
            </Link>
            .
          </>
        )}
        {count > 3 && (
          <>
            Commented on{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[0].token_name}
              </a>
            </Link>
            ,{" "}
            <Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
              <a className="text-black hover:text-stpink">
                {nfts[1].token_name}
              </a>
            </Link>{" "}
            and {count - 2} others.
          </>
        )}
      </div>
      {count === 1 && (
        <div className="">
          <div className="bg-gray-200 my-2 p-2 px-4 rounded-2xl inline-block">
            {comments[0].text}
          </div>
        </div>
      )}
      <div className="flex mt-2">
        <ActivityImages nfts={nfts} />
      </div>
    </div>
  );
}
