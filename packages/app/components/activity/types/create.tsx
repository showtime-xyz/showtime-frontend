import { TextLink } from "app/navigation/link";

function Create({ act }) {
  const { nfts } = act;
  const count = nfts?.length;

  return (
    <>
      {count === 1 && (
        <>
          created{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].token_name}
          </TextLink>
          .
        </>
      )}
      {count === 2 && (
        <>
          created{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].token_name}
          </TextLink>{" "}
          and{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[1].nft_id}`}
          >
            {nfts[1].token_name}
          </TextLink>
          .
        </>
      )}
      {count === 3 && (
        <>
          created{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].token_name}
          </TextLink>
          ,{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[1].nft_id}`}
          >
            {nfts[1].token_name}
          </TextLink>{" "}
          and{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[2].nft_id}`}
          >
            {nfts[2].token_name}
          </TextLink>
          .
        </>
      )}
      {count > 3 && (
        <>
          created{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[0].nft_id}`}
          >
            {nfts[0].token_name}
          </TextLink>
          ,{" "}
          <TextLink
            variant="text-sm"
            tw="font-bold text-black dark:text-white"
            href={`/nft/${nfts[1].nft_id}`}
          >
            {nfts[1].token_name}
          </TextLink>{" "}
          and {count - 2} others.
        </>
      )}
    </>
  );
}

export { Create };
