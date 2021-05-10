import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'

const FollowGrid = ({ people }) => {
	return (
		<div className="mb-8 flex flex-row flex-wrap">
			{people.map(profile => {
				return (
					<div key={profile.wallet_address} className="mr-2 mb-1">
						<Link href="/[profile]" as={`/${profile?.username || profile.wallet_address}`}>
							<a className="flex flex-row items-center showtime-follower-button rounded-full">
								<div>
									<img alt={profile.name} src={profile.img_url ? profile.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-1 h-6 w-6" />
								</div>
								<div className="font-normal">{profile.name ? profile.name : 'Unnamed'}</div>
							</a>
						</Link>
					</div>
				)
			})}
		</div>
	)
}

export default FollowGrid
