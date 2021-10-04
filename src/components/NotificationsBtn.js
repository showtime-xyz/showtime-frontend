import { useState, useEffect, Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faComment, faHeart, faUser, faAt } from '@fortawesome/free-solid-svg-icons'
import { formatDistanceToNowStrict } from 'date-fns'
import { getNotificationInfo, DEFAULT_PROFILE_PIC, CHAIN_IDENTIFIERS } from '@/lib/constants'
import ModalUserList from '@/components/ModalUserList'
import axios from '@/lib/axios'
import { Popover, Transition } from '@headlessui/react'
import { useSWRInfinite } from 'swr'
import useAuth from '../hooks/useAuth'
import useProfile from '@/hooks/useProfile'
import ProfileHovercard from './ProfileHovercard'
import BellIcon from '@/components/Icons/BellIcon'

const NOTIFICATIONS_PER_PAGE = 7

const iconObjects = {
	comment: faComment,
	heart: faHeart,
	user: faUser,
	at: faAt,
}

const NOTIFICATION_TYPES = {
	FOLLOWED: [1],
	LIKED: [2, 3],
	COMMENT: [4, 5],
	COMMENT_MENTION: [6],
	COMMENT_LIKE: [7],
}

export default function NotificationsBtn() {
	const { user } = useAuth()
	const { myProfile, setMyProfile } = useProfile()
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
	const [previouslyLastOpened, setPreviouslyLastOpened] = useState()
	const [openUserList, setOpenUserList] = useState(null)

	const closePanel = () => document.querySelector('[data-close-notifs]').click()

	const handlePanelOpen = async () => {
		setPreviouslyLastOpened(myProfile.notifications_last_opened)
		updateNotificationsLastOpened()
		setHasUnreadNotifications(false)
	}

	const updateNotificationsLastOpened = async () => {
		await axios.post('/api/notifications')

		await setMyProfile({ ...myProfile, notifications_last_opened: new Date() }, true)
	}

	const { data, error, size, setSize } = useSWRInfinite(
		(pageIndex, previousPageData) => {
			if (pageIndex != 0 && previousPageData.length < NOTIFICATIONS_PER_PAGE) return null

			return `/api/notifications?page=${pageIndex + 1}&limit=${NOTIFICATIONS_PER_PAGE}`
		},
		url => axios.get(url).then(res => res.data),
		{ initialSize: 1, refreshInterval: 3 * 60 * 1000, refreshWhenHidden: true, revalidateOnMount: true }
	)

	const notifs = (data ? [].concat(...data) : []).flat()
	const isLoadingInitialData = !data && !error
	const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined')
	const isEmpty = data?.[0]?.length === 0
	const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < NOTIFICATIONS_PER_PAGE)

	useEffect(() => {
		if (!myProfile) return

		setHasUnreadNotifications((notifs && notifs[0] && myProfile?.notifications_last_opened === null) || (notifs && notifs[0] && new Date(notifs[0].to_timestamp) > new Date(myProfile?.notifications_last_opened)))
	}, [myProfile, myProfile?.notifications_last_opened, notifs])

	return (
		<Popover className="md:relative flex items-center justify-center">
			{({ open }) => (
				<>
					<Popover.Button data-close-notifs className="dark:text-white transition-all rounded-full cursor-pointer relative h-6 w-6 focus:outline-none">
						<span onClick={open ? null : handlePanelOpen} className="flex items-center justify-center">
							<BellIcon className="w-6 h-6" />
							{hasUnreadNotifications && <div className="bg-violet-500 absolute h-2 w-2 top-0 right-1 rounded-full" />}
						</span>
					</Popover.Button>
					<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0" enterTo="transform opacity-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100" leaveTo="transform opacity-0">
						<button className="bg-white dark:bg-black bg-opacity-90 dark:bg-opacity-90 w-full h-screen fixed inset-x-0 top-[2.9rem] z-10 focus:outline-none md:hidden" />
					</Transition>
					<Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
						<Popover.Panel className={'text-black dark:text-gray-200 absolute text-center top-[3.1rem] md:top-10 right-0 z-20 w-full md:min-w-[25rem]'}>
							<div className="mx-2 md:mx-0 bg-white dark:bg-gray-900 py-2 px-2 shadow-lg rounded-xl transition border border-gray-200 dark:border-gray-800 overflow-y-scroll max-h-[80vh]">
								{isLoadingInitialData && (
									<div className="flex items-center justify-center">
										<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
									</div>
								)}
								{!isEmpty &&
									notifs.map(notif =>
										// either link to your profile or to the nft
										notif.actors && notif.actors.length > 0 ? (
											// HAS CLICKABLE ACTORS
											<div className={`py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-lg whitespace-nowrap flex items-start w-full max-w-full ${new Date(notif.to_timestamp) > new Date(previouslyLastOpened) ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' : ''}`} key={notif.id}>
												<div className="w-max mr-2 relative min-w-[2.25rem]">
													<ProfileHovercard user={notif.actors[0]?.profile_id}>
														<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
															<a onClick={closePanel}>
																<img alt={notif.name} src={notif.img_url ? notif.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-1 mt-1 w-9 h-9" />
																<div
																	className="absolute bottom-0 right-0 rounded-full h-5 w-5 flex items-center justify-center shadow"
																	style={{
																		backgroundColor: getNotificationInfo(notif.type_id).color,
																	}}
																>
																	<FontAwesomeIcon className="w-3 h-3 text-white" icon={iconObjects[getNotificationInfo(notif.type_id).icon]} />
																</div>
															</a>
														</Link>
													</ProfileHovercard>
												</div>
												<div className="flex-1 flex-col items-start text-left">
													<div className="text-sm whitespace-pre-line">
														<>
															{notif.actors.length == 1 ? (
																<ProfileHovercard user={notif.actors[0]?.profile_id}>
																	<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
																		<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																			{notif.actors[0].name}{' '}
																		</a>
																	</Link>
																</ProfileHovercard>
															) : null}
															{notif.actors.length == 2 ? (
																<>
																	<ProfileHovercard user={notif.actors[0]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[0].name}
																			</a>
																		</Link>
																	</ProfileHovercard>
																	<span className="text-gray-500"> and </span>
																	<ProfileHovercard user={notif.actors[1]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[1]?.username || notif.actors[1].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[1].name}{' '}
																			</a>
																		</Link>
																	</ProfileHovercard>
																</>
															) : null}
															{notif.actors.length == 3 ? (
																<>
																	<ProfileHovercard user={notif.actors[0]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[0].name}
																			</a>
																		</Link>
																	</ProfileHovercard>
																	<span className="text-gray-500">, </span>
																	<ProfileHovercard user={notif.actors[1]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[1]?.username || notif.actors[1].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[1].name}
																			</a>
																		</Link>
																	</ProfileHovercard>
																	<span className="text-gray-500">, and </span>
																	<ProfileHovercard user={notif.actors[2]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[2]?.username || notif.actors[2].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[2].name}{' '}
																			</a>
																		</Link>
																	</ProfileHovercard>
																</>
															) : null}
															{notif.actors.length > 3 ? (
																<>
																	<ModalUserList title="Followed You" isOpen={openUserList == notif.id} users={notif.actors ? notif.actors : []} closeModal={() => setOpenUserList(null)} onRedirect={() => setOpenUserList(null)} emptyMessage="No followers yet." />
																	<ProfileHovercard user={notif.actors[0]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[0].name}
																			</a>
																		</Link>
																	</ProfileHovercard>
																	<span className="text-gray-500">, </span>
																	<ProfileHovercard user={notif.actors[1]?.profile_id}>
																		<Link href="/[profile]" as={`/${notif.actors[1]?.username || notif.actors[1].wallet_address}`}>
																			<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																				{notif.actors[1].name}
																			</a>
																		</Link>
																	</ProfileHovercard>
																	<span className="text-gray-500">, and </span>
																	<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setOpenUserList(notif.id)}>
																		{notif.actors.length - 2} other {notif.actors.length - 2 == 1 ? 'person' : 'people'}{' '}
																	</a>
																</>
															) : null}
															<span className="text-gray-500">
																{NOTIFICATION_TYPES.LIKED.includes(notif.type_id) ? 'liked ' : null}
																{NOTIFICATION_TYPES.FOLLOWED.includes(notif.type_id) ? 'followed you' : null}
																{NOTIFICATION_TYPES.COMMENT.includes(notif.type_id) ? 'commented on ' : null}
																{NOTIFICATION_TYPES.COMMENT_MENTION.includes(notif.type_id) ? 'mentioned you in ' : null}
																{NOTIFICATION_TYPES.COMMENT_LIKE.includes(notif.type_id) ? 'liked your comment on ' : null}
															</span>
															{notif.nft__nftdisplay__name ? (
																<Link href="/t/[...token]" as={`/t/${Object.keys(CHAIN_IDENTIFIERS).find(key => CHAIN_IDENTIFIERS[key] == notif.chain_identifier)}/${notif.nft__contract__address}/${notif.nft__token_identifier}`}>
																	<a onClick={closePanel} className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink">
																		{notif.nft__nftdisplay__name}
																	</a>
																</Link>
															) : null}
														</>
													</div>
													<div className="text-gray-400 dark:text-gray-500 text-xs">
														{formatDistanceToNowStrict(new Date(notif.to_timestamp), {
															addSuffix: true,
														})}
													</div>
												</div>
											</div>
										) : (
											<Link href={getNotificationInfo(notif.type_id).goTo === 'profile' ? '/[profile]' : '/t/[...token]'} as={getNotificationInfo(notif.type_id).goTo === 'profile' ? (notif.link_to_profile__address ? `/${notif.link_to_profile__username || notif.link_to_profile__address}` : `/${myProfile?.username || user?.publicAddress}`) : `/t/${Object.keys(CHAIN_IDENTIFIERS).find(key => CHAIN_IDENTIFIERS[key] == notif.chain_identifier)}/${notif.nft__contract__address}/${notif.nft__token_identifier}`} key={notif.id}>
												<div onClick={closePanel} className={`py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-lg cursor-pointer whitespace-nowrap flex items-start w-full max-w-full ${new Date(notif.to_timestamp) > new Date(previouslyLastOpened) ? 'bg-gray-100 hover:bg-gray-200' : ''}`} key={notif.id}>
													<div className="w-max mr-2 relative min-w-[2.25rem]">
														<img alt={notif.name} src={notif.img_url ? notif.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-1 mt-1 w-9 h-9" />
														<div
															className="absolute bottom-0 right-0 rounded-full h-5 w-5 flex items-center justify-center shadow"
															style={{
																backgroundColor: getNotificationInfo(notif.type_id).color,
															}}
														>
															<FontAwesomeIcon className="w-3 h-3 text-white" icon={iconObjects[getNotificationInfo(notif.type_id).icon]} />
														</div>
													</div>
													<div className="flex-1 flex-col items-start text-left">
														<div className="text-sm whitespace-pre-line">{notif.description}</div>
														<div className="text-gray-400 text-xs">
															{formatDistanceToNowStrict(new Date(notif.to_timestamp), {
																addSuffix: true,
															})}
														</div>
													</div>
												</div>
											</Link>
										)
									)}
								{isLoadingInitialData && <div className="py-2 px-4 whitespace-nowrap">No notifications yet.</div>}
								{!isReachingEnd && (
									<div className="flex justify-center items-center mb-1 mt-1">
										<button disabled={isLoadingMore} onClick={() => setSize(size + 1)} className={`flex w-36 h-8 items-center justify-center  text-xs border-gray-600 text-gray-600 border rounded-full px-2 py-1 hover:text-stpink ${isLoadingMore ? '' : 'hover:border-stpink'} transition cursor-pointer`}>
											{isLoadingMore ? <div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin"></div> : 'Show More'}
										</button>
									</div>
								)}
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}
