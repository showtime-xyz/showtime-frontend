import axios from '@/lib/axios'
import { Transition } from '@headlessui/react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { useState } from 'react'
import useSWR from 'swr'
import FollowButton from './FollowButton'
import UserImageList from './UserImageList'
import BadgeIcon from './Icons/BadgeIcon'
import Link from 'next/link'
import { formatAddressShort } from '../lib/utilities'
import useProfile from '@/hooks/useProfile'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import LoadingSpinner from './LoadingSpinner'

const ProfileHovercard = ({ children, user, initialProfile }) => {
	const { profile: myProfile } = useProfile()
	const [isOpen, setOpen] = useState(false)
	const { data: userData } = useSWR(
		() => user && isOpen && `/api/profile/card?userId=${user}`,
		url => axios.get(url).then(res => res.data.data),
		{ dedupingInterval: 60000 /* 1 min */, initialData: initialProfile ? { profile: initialProfile } : undefined, revalidateOnMount: true }
	)

	if (!user && !initialProfile) return children

	return (
		<HoverCardPrimitive.Root openDelay={50} onOpenChange={setOpen}>
			<HoverCardPrimitive.Trigger>{children}</HoverCardPrimitive.Trigger>

			<HoverCardPrimitive.Content side="top" align="center" sideOffset={10} onClick={event => event.stopPropagation()}>
				<Transition show={isOpen} appear={true} enter="transform transition duration-300 origin-bottom ease-out" enterFrom="opacity-0 translate-y-2 scale-0" enterTo="opacity-100 translate-y-0 scale-100" leave="transform transition duration-200 origin-bottom ease-in" leaveFrom="opacity-100 translate-y-0 scale-100" leaveTo="opacity-0 translate-y-2 scale-0" className="shadow-xl rounded-xl">
					<div className="bg-white shadow p-4 space-y-4 rounded-xl">
						{user && !userData?.profile ? (
							<div>
								<LoadingSpinner />
							</div>
						) : (
							<>
								<Link href={`/${userData?.profile?.username || userData?.profile?.address || userData?.profile?.wallet_address}`}>
									<a className="flex items-center space-x-3">
										<img src={userData?.profile?.img_url || DEFAULT_PROFILE_PIC} className="w-16 h-16 rounded-full" />
										<div className="space-y-0.5">
											<div className="flex items-center space-x-1">
												<p className="font-semibold">{userData?.profile?.name || formatAddressShort(userData?.profile?.address || userData?.profile?.wallet_address)}</p>
												{userData?.profile?.verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" bgClass="text-white dark:text-black" />}
											</div>
											{userData?.profile?.username && <p className="text-sm font-medium text-gray-600">@{userData?.profile?.username}</p>}
										</div>
									</a>
								</Link>
								{typeof userData?.profile?.following_count != 'undefined' && typeof userData?.profile?.follower_count != 'undefined' && (
									<div className="flex items-stretch justify-between">
										<p className="text-sm">
											<span className="font-bold">{userData?.profile?.following_count}</span> following
										</p>
										<div className="h-auto w-px bg-gray-100 my-0.5 mx-12" />
										<p className="text-sm">
											<span className="font-bold">{userData?.profile?.follower_count}</span> followers
										</p>
									</div>
								)}
								{myProfile?.profile_id !== user && <FollowButton className="w-full justify-center" item={userData?.profile} setFollowerCount={() => null} />}
								{userData?.followers?.length > 0 && (
									<div className="flex items-center justify-end">
										<div className="inline-flex items-center space-x-1">
											<p className="text-sm font-medium text-gray-600">Followed by</p>
											<UserImageList users={userData.followers} sizeClass="w-6 h-6" />
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</Transition>
			</HoverCardPrimitive.Content>
		</HoverCardPrimitive.Root>
	)
}

export default ProfileHovercard
