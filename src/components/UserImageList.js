import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import mixpanel from 'mixpanel-browser'

export default function UserImageList({ users, sizeClass = 'h-12 w-12' }) {
	if (!users) return null

	return (
		<div className="flex -space-x-2 relative z-0 overflow-hidden p-0.5 -m-0.5">
			{users.map(user => (
				<Link href="/[profile]" as={`/${user?.username || user?.wallet_address}`} key={user.wallet_address}>
					<a className={`relative z-10 inline-block ${sizeClass} rounded-full ring-2 ring-white dark:ring-gray-800 hover:opacity-90 transition overflow-hidden`} onClick={() => mixpanel.track('Activity - Click on followed user')}>
						<img className="w-full h-full" src={user.img_url || DEFAULT_PROFILE_PIC} alt={user?.username || user?.wallet_address} />
					</a>
				</Link>
			))}
		</div>
	)
}
