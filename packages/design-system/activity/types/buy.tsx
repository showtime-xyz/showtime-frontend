import { TextLink } from 'app/navigation/link'
import { CHAIN_IDENTIFIERS } from 'app/lib/constants'

function Buy({ act }) {
	const { nfts } = act
	const count = nfts?.length

	return (
		<>
			{count === 1 && (
				<>
					bought{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].title}
					</TextLink>{' '}
					from{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/${act.seller?.username || act.seller?.wallet_address}`}
					>
						{act.seller?.name}
					</TextLink>
					.
				</>
			)}
			{count === 2 && (
				<>
					bought{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].title}
					</TextLink>{' '}
					and{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
						)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
					>
						{nfts[1].title}
					</TextLink>
					.
				</>
			)}
			{count === 3 && (
				<>
					bought{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].title}
					</TextLink>
					,{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
						)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
					>
						{nfts[1].title}
					</TextLink>{' '}
					and{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[2].chain_identifier
						)}/${nfts[2].contract_address}/${nfts[2].token_id}`}
					>
						{nfts[2].title}
					</TextLink>
					.
				</>
			)}
			{count > 3 && (
				<>
					bought{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].title}
					</TextLink>
					,{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
						)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
					>
						{nfts[1].title}
					</TextLink>{' '}
					and {count - 2} others.
				</>
			)}
		</>
	)
}

export { Buy }
