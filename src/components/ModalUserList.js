import { useContext } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import ClientOnlyPortal from './ClientOnlyPortal'
import Link from 'next/link'
import CloseButton from './CloseButton'
import { truncateWithEllipses } from '@/lib/utilities'
import FollowButton from './FollowButton'
import AppContext from '@/context/app-context'
export default function ModalUserList({ isOpen, title, users, closeModal, emptyMessage, onRedirect }) {
	const context = useContext(AppContext)
	return (
		<>
			{isOpen && (
				<ClientOnlyPortal selector="#modal">
					<div className="z-2" onClick={closeModal}>
						<div className="bg-white absolute top-[10%] inset-x-[5%] p-4 mx-auto max-h-[80vh] max-w-[400px] flex flex-col rounded-lg sm:rounded-2xl text-black" onClick={e => e.stopPropagation()}>
							<CloseButton setEditModalOpen={closeModal} />
							<div className="text-3xl border-b-2 pb-2 px-2">{title}</div>
							<div className="flex flex-col overflow-y-auto">
								{users.length === 0 && <div className="text-center mx-2 my-8 text-gray-400">{emptyMessage}</div>}
								{users.map(profile => {
									return (
										<div key={profile.wallet_address} className="flex items-center justify-between">
											<Link href="/[profile]" as={`/${profile?.username || profile.wallet_address}`}>
												<a className="flex flex-row items-center py-3 rounded-lg px-1 overflow-hidden hover:text-stpink" onClick={onRedirect}>
													<div>
														<img alt={profile.name} src={profile.img_url ? profile.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-1 w-9 h-9" />
													</div>
													<div className="ml-2">{profile.name ? truncateWithEllipses(profile.name, context.isMobile ? 16 : 22) : 'Unnamed'}</div>
												</a>
											</Link>
											{context?.myProfile?.profile_id !== profile.profile_id && (
												<FollowButton
													item={{
														profile_id: profile.profile_id,
														follower_count: 0,
													}}
													followerCount={0}
													setFollowerCount={() => {}}
													notExpandWhenMobile
													compact
												/>
											)}
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
