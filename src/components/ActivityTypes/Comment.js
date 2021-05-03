import Link from 'next/link'
import mixpanel from 'mixpanel-browser'
import reactStringReplace from 'react-string-replace'

export default function Comment({ act }) {
	const { nfts, comments } = act
	const count = nfts?.length
	const commentWithMentions = reactStringReplace(comments[0].text, /(@\[.+?\]\(\w+\))/g, (match, i) => {
		const [, name, urlParam] = match.match(/@\[(.+?)\]\((\w+)\)/)
		return (
			<Link href="/[profile]" as={`/${urlParam}`} key={match + i}>
				<a className="text-indigo-500 hover:text-indigo-400">{name}</a>
			</Link>
		)
	})
	return (
		<div className="flex flex-col max-w-full">
			<div className="text-gray-500">
				{count === 1 && (
					<>
						Commented on{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[0].token_name}
							</a>
						</Link>
						.
					</>
				)}
				{count === 2 && (
					<>
						Commented on{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[0].token_name}
							</a>
						</Link>{' '}
						and{' '}
						<Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[1].token_name}
							</a>
						</Link>
						.
					</>
				)}
				{count === 3 && (
					<>
						Commented on{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[0].token_name}
							</a>
						</Link>
						,{' '}
						<Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[1].token_name}
							</a>
						</Link>{' '}
						and{' '}
						<Link href={`/t/${nfts[2].contract_address}/${nfts[2].token_id}`}>
							<a className="text-black hover:text-stpink">
								{' '}
								onClick=
								{() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
								{nfts[2].token_name}
							</a>
						</Link>
						.
					</>
				)}
				{count > 3 && (
					<>
						Commented on{' '}
						<Link href={`/t/${nfts[0].contract_address}/${nfts[0].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[0].token_name}
							</a>
						</Link>
						,{' '}
						<Link href={`/t/${nfts[1].contract_address}/${nfts[1].token_id}`}>
							<a
								className="text-black hover:text-stpink"
								onClick={() => {
									mixpanel.track('Activity - Click on NFT title')
								}}
							>
								{nfts[1].token_name}
							</a>
						</Link>{' '}
						and {count - 2} others.
					</>
				)}
			</div>
			{count === 1 && (
				<div className="">
					<div className="bg-gray-200 my-2 p-2 px-4 rounded-2xl inline-block">{commentWithMentions}</div>
				</div>
			)}
		</div>
	)
}
