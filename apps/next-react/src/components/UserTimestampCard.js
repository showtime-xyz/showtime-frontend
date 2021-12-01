import { useContext } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import { truncateWithEllipses } from '@/lib/utilities'
import { format } from 'date-fns'
import FollowButton from './FollowButton'
import Link from 'next/link'
import AppContext from '@/context/app-context'

export default function UserTimestampCard({ timestamp, item, closeModalCallback }) {
	const context = useContext(AppContext)
	const name = item.owner_name
	const imageUrl = item.owner_img_url
	const profileId = item.owner_id
	return (
		<div className="flex items-center md:w-max max-w-full border-2 border-gray-300 dark:border-gray-800 rounded-xl p-4 mt-4">
			<div className="flex flex-row items-center">
				<div className="mr-3 sm:mr-4 flex-none">
					<Link
						href="/[profile]"
						as={item.owner_username ? `/${item.owner_username}` : `/${item.owner_address}`}
					>
						<a onClick={closeModalCallback}>
							<img
								alt={name}
								src={imageUrl ? imageUrl : DEFAULT_PROFILE_PIC}
								className="rounded-full sm:h-12 sm:w-12 h-10 w-10"
							/>
						</a>
					</Link>
				</div>

				<div>
					<div className="flex-grow">
						<div>
							<div className="text-base sm:text-lg mr-3">
								<Link
									href="/[profile]"
									as={item.owner_username ? `/${item.owner_username}` : `/${item.owner_address}`}
								>
									<a
										onClick={closeModalCallback}
										className="dark:text-gray-300 hover:text-stpink dark:hover:text-stpink"
									>
										{truncateWithEllipses(name, 20)}
									</a>
								</Link>
							</div>
						</div>
						{timestamp && <div className="text-gray-500 text-xs">{format(new Date(timestamp), 'PPp')}</div>}
					</div>
				</div>
				<div>
					{profileId && context.myProfile?.profile_id !== profileId && (
						<div className="flex items-center ml-2 sm:ml-4 text-black">
							<FollowButton
								item={{ profile_id: profileId, follower_count: 0 }}
								followerCount={0}
								setFollowerCount={() => {}}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
