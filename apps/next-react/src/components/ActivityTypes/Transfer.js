import Link from "next/link";
import { ACTIVITY_TYPES, CHAIN_IDENTIFIERS } from "@/lib/constants";
import mixpanel from "mixpanel-browser";

export default function Transfer({ act }) {
  const { nfts, type } = act;
  const count = nfts?.length;
  const verb = type === ACTIVITY_TYPES.SEND ? "Sent" : "Received";
  const preposition = type === ACTIVITY_TYPES.SEND ? "to" : "from";

  return (
    <div className="flex flex-col">
      <div className="text-gray-500 dark:text-gray-400">
        {count === 1 && (
          <>
            {verb}{" "}
            <Link
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
              )}/${nfts[0].contract_address}/${nfts[0].token_id}`}
            >
              <a
                className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink"
                onClick={() => mixpanel.track("Activity - Click on NFT title")}
              >
                {nfts[0].title}
              </a>
            </Link>{" "}
            {preposition}{" "}
            <Link
              href="/[profile]"
              as={`/${
                act.counterparty?.username || act.counterparty?.wallet_address
              }`}
            >
              <a
                className="text-black dark:text-gray-300 hover:text-stpink dark:hover:text-stpink"
                onClick={() =>
                  mixpanel.track(
                    "Activity - Click on person transferred to's name"
                  )
                }
              >
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
