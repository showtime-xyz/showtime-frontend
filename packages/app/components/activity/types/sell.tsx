import { TextLink } from "app/navigation/link";

function Sell({ act }) {
  const { nfts } = act;
  const count = nfts?.length;

  return (
    <>
      <>
        {count === 1 && (
          <>
            sold{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[0].nft_id}`}
            >
              {nfts[0].title}
            </TextLink>{" "}
            to{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/@${act.buyer?.username ?? act.buyer?.wallet_address}`}
            >
              {act.buyer?.name}
            </TextLink>
            .
          </>
        )}
        {count === 2 && (
          <>
            sold{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[0].nft_id}`}
            >
              {nfts[0].title}
            </TextLink>{" "}
            and{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[1].nft_id}`}
            >
              {nfts[1].title}
            </TextLink>
            .
          </>
        )}
        {count === 3 && (
          <>
            sold{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[0].nft_id}`}
            >
              {nfts[0].title}
            </TextLink>
            ,{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[1].nft_id}`}
            >
              {nfts[1].title}
            </TextLink>{" "}
            and{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[2].nft_id}`}
            >
              {nfts[2].title}
            </TextLink>
            .
          </>
        )}
        {count > 3 && (
          <>
            sold{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[0].nft_id}`}
            >
              {nfts[0].title}
            </TextLink>
            ,{" "}
            <TextLink
              variant="text-sm"
              tw="font-bold text-black dark:text-white"
              href={`/nft/${nfts[1].nft_id}`}
            >
              {nfts[1].title}
            </TextLink>{" "}
            and {count - 2} others.
          </>
        )}
      </>
    </>
  );
}

export { Sell };
