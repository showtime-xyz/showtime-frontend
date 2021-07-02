import { useContext } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import ClientOnlyPortal from './ClientOnlyPortal'
import Link from 'next/link'
import CloseButton from './CloseButton'
import { truncateWithEllipses } from '@/lib/utilities'
import FollowButton from './FollowButton'
import BadgeIcon from './Icons/BadgeIcon'
import AppContext from '@/context/app-context'
import useProfile from '@/hooks/useProfile'

export default function ModalUserList({ isOpen, title, users, closeModal, emptyMessage, onRedirect }) {
	const { profile: myProfile } = useProfile()
	const context = useContext(AppContext)

	return (
		<>
			{isOpen && (
				<ClientOnlyPortal selector="#modal">
					<div className="fixed bg-black bg-opacity-70 inset-0 z-2 flex flex-row items-center" onClick={closeModal}>
						<div className="fixed z-2 shadow-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 top-[10%] inset-x-[5%] p-4 mx-auto max-h-[80vh] max-w-[400px] flex flex-col rounded-lg sm:rounded-2xl text-black" onClick={e => e.stopPropagation()}>
							<CloseButton setEditModalOpen={closeModal} />
							<div className="text-2xl dark:text-gray-300 border-b-2 dark:border-gray-800 pb-2 px-2">{title}</div>
							<div className="flex flex-col overflow-y-auto">
								{users.length === 0 && <div className="text-center mx-2 my-8 text-gray-400">{emptyMessage}</div>}
								{users.map(profile => {
									return (
										<div key={profile.wallet_address} className="flex items-center justify-between space-x-3">
											<Link href="/[profile]" as={`/${profile?.username || profile.wallet_address}`}>
												<a className="flex-1 flex items-center space-x-2 py-3 rounded-lg px-1 overflow-hidden dark:text-gray-300 hover:text-stpink dark:hover:text-stpink" onClick={onRedirect}>
													<div className="flex-shrink-0">
														<img alt={profile.name} src={profile.img_url ? profile.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-1 w-9 h-9" />
													</div>
													<div className="flex items-center space-x-1 overflow-hidden">
														<p className="font-semibold truncate min-w-0">{profile.name || `@${profile.username}` || 'Unnamed'}</p>
														{profile.verified == 1 && <BadgeIcon className="flex-shrink-0 w-3 h-auto text-black dark:text-white" bgClass="text-white dark:text-black" />}
													</div>
												</a>
											</Link>
											{myProfile?.profile_id !== profile.profile_id && <FollowButton item={{ profile_id: profile.profile_id, follower_count: 0 }} followerCount={0} setFollowerCount={() => {}} compact />}
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</ClientOnlyPortal>
			)}
		</>
	)
}
