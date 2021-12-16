import { TextLink } from 'app/navigation/link'
import { CHAIN_IDENTIFIERS } from 'app/lib/constants'

function Create({ act }) {
	const { nfts } = act
	const count = nfts?.length

	return (
		<>
			{count === 1 && (
				<>
					created{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].token_name}
					</TextLink>
					.
				</>
			)}
			{count === 2 && (
				<>
					created{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].token_name}
					</TextLink>{' '}
					and{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
						)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
					>
						{nfts[1].token_name}
					</TextLink>
					.
				</>
			)}
			{count === 3 && (
				<>
					created{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].token_name}
					</TextLink>
					,{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
						)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
					>
						{nfts[1].token_name}
					</TextLink>{' '}
					and{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[2].chain_identifier
						)}/${nfts[2].contract_address}/${nfts[2].token_id}`}
					>
						{nfts[2].token_name}
					</TextLink>
					.
				</>
			)}
			{count > 3 && (
				<>
					created{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[0].chain_identifier
						)}/${nfts[0].contract_address}/${nfts[0].token_id}`}
					>
						{nfts[0].token_name}
					</TextLink>
					,{' '}
					<TextLink
						variant="text-sm"
						tw="text-black dark:text-white font-bold"
						href={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(
							key => CHAIN_IDENTIFIERS[key] == nfts[1].chain_identifier
						)}/${nfts[1].contract_address}/${nfts[1].token_id}`}
					>
						{nfts[1].token_name}
					</TextLink>{' '}
					and {count - 2} others.
				</>
			)}
		</>
	)
}

export { Create }
