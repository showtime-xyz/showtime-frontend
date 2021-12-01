import { Link } from 'app/navigation/link'
import { CHAIN_IDENTIFIERS } from 'app/lib/constants'
import { View, Text, Pressable } from 'design-system'
import { mixpanel } from 'app/lib/mixpanel'

export default function Buy({ act }) {
	const { nfts } = act
	const count = nfts?.length

	return (
		<View tw="flex-col">
			<View>
				{count === 1 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Bought </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].title}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> from </Text>
						<Link href={`/${act.seller?.username || act.seller?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on seller name')}
							>
								<Text tw="text-black dark:text-gray-300">{act.seller?.name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count === 2 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Bought </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].title}</Text>
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
								<Text tw="text-black dark:text-gray-300">{nfts[1].title}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count === 3 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Bought </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].title}</Text>
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
								<Text tw="text-black dark:text-gray-300">{nfts[1].title}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[2].chain_identifier
							)}/${nfts[2].contract_address}/${nfts[2].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[2].title}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
				{count > 3 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">Bought </Text>
						<Link
							href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
								key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
							)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
						>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track('Activity - Click on NFT title')}
							>
								<Text tw="text-black dark:text-gray-300">{nfts[0].title}</Text>
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
								<Text tw="text-black dark:text-gray-300">{nfts[1].title}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400"> and {count - 2} others.</Text>
					</View>
				)}
			</View>
		</View>
	)
}
