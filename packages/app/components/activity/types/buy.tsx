import { TextLink } from "app/navigation/link";

function Buy({ act }) {
  const { nfts } = act;
  const count = nfts?.length;

  return (
    <>
      {count === 1 && (
        <>
          bought{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].title}
          </TextLink>{" "}
          from{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/profile/${act.seller?.wallet_address}`}
          >
            {act.seller?.name}
          </TextLink>
          .
        </>
      )}
      {count === 2 && (
        <>
          bought{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].title}
          </TextLink>{" "}
          and{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[1].nft_id}`}
          >
            {nfts[1].title}
          </TextLink>
          .
        </>
      )}
      {count === 3 && (
        <>
          bought{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].title}
          </TextLink>
          ,{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[1].nft_id}`}
          >
            {nfts[1].title}
          </TextLink>{" "}
          and{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[2].nft_id}`}
          >
            {nfts[2].title}
          </TextLink>
          .
        </>
      )}
      {count > 3 && (
        <>
          bought{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].title}
          </TextLink>
          ,{" "}
          <TextLink
            variant="text-sm"
            tw="text-black dark:text-white font-bold"
            href={`/nft/${nfts[1].nft_id}`}
          >
            {nfts[1].title}
          </TextLink>{" "}
          and {count - 2} others.
        </>
      )}
    </>
  );
}

export { Buy };
