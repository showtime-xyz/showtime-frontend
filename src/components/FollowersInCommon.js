import axios from '@/lib/axios'
import Link from 'next/link'
import useSWR from 'swr'
import UserImageList from './UserImageList'

const FollowersInCommon = ({ profileId }) => {
	let { data: followersInCommon } = useSWR(
		() => `/api/profile/commonfollows?profileId=${profileId}`,
		url => axios.get(url).then(res => res.data),
		{ revalidateOnFocus: false }
	)

	if (!followersInCommon) return null

	followersInCommon = followersInCommon.data

	return (
		<div className="flex items-center space-x-1">
			<p className="text-sm dark:text-gray-400">
				Followed by{' '}
				{followersInCommon.followers.map(follower => (
					<>
						<Link href={`/${follower.username}`} key={follower.username}>
							<a className="font-semibold dark:text-gray-300">@{follower.username}</a>
						</Link>
						{', '}
					</>
				))}
				{/* TODO: Allow seeing the complete list of followers in common (we need to fetch the complete list & pass it to the modal) */}
				&amp; {followersInCommon.count - 2} others you follow
			</p>
			<UserImageList users={followersInCommon.followers} sizeClass="w-6 h-6" />
		</div>
	)
}

export default FollowersInCommon
