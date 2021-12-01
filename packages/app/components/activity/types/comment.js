import reactStringReplace from 'react-string-replace'

import { Link } from 'app/navigation/link'
import { CHAIN_IDENTIFIERS } from 'app/lib/constants'
import { View, Text, Pressable } from 'design-system'
import { mixpanel } from 'app/lib/mixpanel'

export default function Comment({ act }) {
	const { nfts, comments } = act
	const count = nfts?.length
	const commentWithMentions = reactStringReplace(comments[0].text, /(@\[.+?\]\(\w+\))/g, (match, i) => {
		const [, name, urlParam] = match.match(/@\[(.+?)\]\((\w+)\)/)
		return (
			<Link href="/[profile]" as={`/${urlParam}`} key={match + i}>
				<Pressable tw="text-indigo-500 hover:text-indigo-400">{name}</Pressable>
			</Link>
		)
	})

	return (
		<View tw="flex flex-col max-w-full">
			<View>
				{count === 1 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Commented on </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count === 2 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Commented on </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
							)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[1].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count === 3 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Commented on </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">, </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
							)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[1].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[2].chain_identifier
							)}/${nfts[2].contract_address}/${nfts[2].token_id}`}
						>
							<Pressable
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
								tw="hover:text-stpink dark:hover:text-stpink"
							>
								<Text tw="text-black dark:text-gray-300">{nfts[2].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count > 3 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Commented on </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">, </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
							)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[1].token_name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and {count - 2} others.</Text>
					</View>
				)}
			</View>
			{count === 1 && (
				<View tw="">
					<View tw="bg-gray-200 dark:bg-gray-800 dark:text-gray-300 my-2 p-2 px-4 rounded-2xl inline-block">
						{commentWithMentions}
					</View>
				</View>
			)}
		</View>
	)
}
