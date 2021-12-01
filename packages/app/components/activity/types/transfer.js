import Link from 'next/link'

import { ACTIVITY_TYPES, CHAIN_IDENTIFIERS } from 'app/lib/constants'
import { View, Text, Pressable } from 'design-system'
import { mixpanel } from 'app/lib/mixpanel'

export default function Transfer({ act }) {
	const { nfts, type } = act
	const count = nfts?.length
	const verb = type === ACTIVITY_TYPES.SEND ? 'Sent' : 'Received'
	const preposition = type === ACTIVITY_TYPES.SEND ? 'to' : 'from'

	return (
		<View tw="flex-col">
			<View>
				{count === 1 && (
					<View tw="flex-row">
						<Text tw="text-gray-500 dark:text-gray-400">{verb} </Text>
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
						<Text tw="text-gray-500 dark:text-gray-400"> {preposition} </Text>
						<Link href={`/${act.counterparty?.username || act.counterparty?.wallet_address}`}>
							<Pressable
								tw="hover:text-stpink dark:hover:text-stpink"
								onPress={() => mixpanel.track("Activity - Click on person transferred to's name")}
							>
								<Text tw="text-black dark:text-gray-300">{act.counterparty?.name}</Text>
							</Pressable>
						</Link>
						<Text tw="text-gray-500 dark:text-gray-400">.</Text>
					</View>
				)}
			</View>
		</View>
	)
}
