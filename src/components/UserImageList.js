import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import mixpanel from 'mixpanel-browser'

export default function UserImageList({ users }) {
	return (
		<>
			{users.map(user => (
				<Link href="/[profile]" as={`/${user?.username || user?.wallet_address}`} key={user.wallet_address}>
					<a
						className="mr-2 hover:opacity-90 transition-all"
						onClick={() => {
							mixpanel.track('Activity - Click on followed user')
						}}
					>
						<img src={user.img_url || DEFAULT_PROFILE_PIC} className="h-12 w-12 rounded-full" />
					</a>
				</Link>
			))}
		</>
	)
}
