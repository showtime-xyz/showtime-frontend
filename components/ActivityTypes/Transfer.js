import React from "react";
import Link from "next/link";
import { ACTIVITY_TYPES } from "../../lib/constants";

export default function Transfer({ act }) {
  const { nfts, type } = act;
  const count = nfts?.length;
  const verb = type === ACTIVITY_TYPES.SEND ? "Sent" : "Received";
  const preposition = type === ACTIVITY_TYPES.SEND ? "to" : "from";

  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            {verb}{" "}
            <Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
              <a className="text-black hover:text-stpink">{nfts[0].title}</a>
            </Link>{" "}
            {preposition}{" "}
            <Link
              href="/[profile]"
              as={`/${
                act.counterparty?.username || act.counterparty?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {act.counterparty?.name}
              </a>
            </Link>
            .
          </>
        )}
      </div>
    </div>
  );
}
