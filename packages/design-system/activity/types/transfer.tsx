import { TextLink } from "app/navigation/link";
import { ACTIVITY_TYPES } from "app/lib/constants";

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
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].title}
          </TextLink>{" "}
          {preposition}{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/profile/${act.counterparty?.wallet_address}`}
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
