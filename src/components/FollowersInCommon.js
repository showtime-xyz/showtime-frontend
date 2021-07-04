import axios from '@/lib/axios'
import { formatAddressShort } from '@/lib/utilities'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import useSWR from 'swr'
import ModalUserList from './ModalUserList'
import UserImageList from './UserImageList'

const FollowersInCommon = ({ profileId }) => {
	const [showFollowersModal, setShowFollowersModal] = useState(false)

	let { data: followersInCommon } = useSWR(
		() => `/api/profile/commonfollows?profileId=${profileId}`,
		url => axios.get(url).then(res => res.data),
		{ revalidateOnFocus: false }
	)

	let { data: followersInCommonComplete } = useSWR(
		() => showFollowersModal && `/api/profile/commonfollows?profileId=${profileId}&isComplete=1`,
		url => axios.get(url).then(res => res.data),
		{ revalidateOnFocus: false, focusThrottleInterval: Infinity }
	)

	if (!followersInCommon || followersInCommon.data.count == 0) return null

	followersInCommon = followersInCommon.data

	return (
		<>
			{typeof document !== 'undefined' && followersInCommon.count > 2 ? <ModalUserList title="Followed by" isOpen={showFollowersModal} users={followersInCommonComplete?.data?.followers || []} closeModal={() => setShowFollowersModal(false)} onRedirect={() => setShowFollowersModal(false)} emptyMessage="Loading..." /> : null}
			<div className="flex items-center space-x-1">
				<div className="text-sm dark:text-gray-400">
					Followed by{' '}
					<div className="hidden md:inline">
						{followersInCommon.followers.slice(0, 2).map((follower, i) => (
							<Fragment key={follower.profile_id}>
								<Link href={`/${follower.username || follower.address}`}>
									<a className="font-semibold dark:text-gray-300">{`@${follower.username}` || formatAddressShort(follower.address)}</a>
								</Link>
								{i + 1 != followersInCommon.count && ', '}
							</Fragment>
						))}
						{followersInCommon.count > 2 && (
							<>
								&amp;{' '}
								<button className="font-semibold dark:text-gray-300" onClick={() => setShowFollowersModal(true)}>
									{followersInCommon.count - 2} others
								</button>{' '}
								you follow
							</>
						)}
					</div>
				</div>
				<UserImageList users={followersInCommon.followers} sizeClass="w-6 h-6" />
			</div>
		</>
	)
}

export default FollowersInCommon
