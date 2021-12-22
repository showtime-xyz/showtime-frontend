// import reactStringReplace from 'react-string-replace'

import { TextLink } from "app/navigation/link";
import { CHAIN_IDENTIFIERS } from "app/lib/constants";

function Comment({ act }) {
  const { nfts, comments } = act;
  const count = nfts?.length;
  // const commentWithMentions = reactStringReplace(comments[0].text, /(@\[.+?\]\(\w+\))/g, (match, i) => {
  // 	const [, name, urlParam] = match.match(/@\[(.+?)\]\((\w+)\)/)
  // 	return (
  // 		<TextLink href="/[profile]" as={`/${urlParam}`} key={match + i}>
  // 			<Pressable tw="text-indigo-500 hover:text-indigo-400">{name}</Pressable>
  // 		</TextLink>
  // 	)
  // })

  return (
    <>
      <>
        {count === 1 && (
          <>
            commented on{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
              )}/${nfts[0].contract_address}/${nfts[0].token_id}`}
            >
              {nfts[0].token_name}
            </TextLink>
            .
          </>
        )}
        {count === 2 && (
          <>
            commented on{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
              )}/${nfts[0].contract_address}/${nfts[0].token_id}`}
            >
              {nfts[0].token_name}
            </TextLink>{" "}
            and{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
              )}/${nfts[1].contract_address}/${nfts[1].token_id}`}
            >
              {nfts[1].token_name}
            </TextLink>
            .
          </>
        )}
        {count === 3 && (
          <>
            commented on{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
              )}/${nfts[0].contract_address}/${nfts[0].token_id}`}
            >
              {nfts[0].token_name}
            </TextLink>
            ,{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
              )}/${nfts[1].contract_address}/${nfts[1].token_id}`}
            >
              {nfts[1].token_name}
            </TextLink>{" "}
            and{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[2].chain_identifier
              )}/${nfts[2].contract_address}/${nfts[2].token_id}`}
            >
              {nfts[2].token_name}
            </TextLink>
            .
          </>
        )}
        {count > 3 && (
          <>
            commented on{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
              )}/${nfts[0].contract_address}/${nfts[0].token_id}`}
            >
              {nfts[0].token_name}
            </TextLink>
            ,{" "}
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
                (key) => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
              )}/${nfts[1].contract_address}/${nfts[1].token_id}`}
            >
              {nfts[1].token_name}
            </TextLink>{" "}
            and {count - 2} others.
          </>
        )}
      </>
      {/* {count === 1 && (
				<>
					<View tw="bg-gray-200 dark:bg-gray-800 dark:text-gray-300 my-2 p-2 px-4 rounded-2xl inline-block">
						{commentWithMentions}
					</View>
				</>
			)} */}
    </>
  );
}

export { Comment };
