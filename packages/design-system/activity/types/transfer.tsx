import { TextLink } from "app/navigation/link";
import { ACTIVITY_TYPES, CHAIN_IDENTIFIERS } from "app/lib/constants";

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
            href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
              (key) => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
            )}/${nfts[0].contract_address}/${nfts[0].token_id}`}
          >
            {nfts[0].title}
          </TextLink>{" "}
          {preposition}{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/${
              act.counterparty?.username || act.counterparty?.wallet_address
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
