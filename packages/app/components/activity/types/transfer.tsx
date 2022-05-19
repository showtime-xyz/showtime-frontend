import { ACTIVITY_TYPES } from "app/lib/constants";
import { TextLink } from "app/navigation/link";

function Transfer({ act }) {
  const { nfts, type } = act;
  const count = nfts?.length;
  const verb = type === ACTIVITY_TYPES.SEND ? "sent" : "received";
  const preposition = type === ACTIVITY_TYPES.SEND ? "to" : "from";

  return (
    <>
      {count === 1 && (
        <>
          {verb}{" "}
          <TextLink
            tw="text-sm font-bold text-black dark:text-white"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].title}
          </TextLink>{" "}
          {preposition}{" "}
          <TextLink
            tw="text-sm font-bold text-black dark:text-white"
            href={`/@${
              act.counterparty?.username ?? act.counterparty?.wallet_address
            }`}
          >
            {act.counterparty?.name}
          </TextLink>
          .
        </>
      )}
    </>
  );
}

export { Transfer };
