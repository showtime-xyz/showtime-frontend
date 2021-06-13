import { useRef, useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { faComment, faHeart, faUser, faAt } from '@fortawesome/free-solid-svg-icons'
import useDetectOutsideClick from '@/hooks/useDetectOutsideClick'
import { formatDistanceToNowStrict } from 'date-fns'
import useInterval from '@/hooks/useInterval'
import AppContext from '@/context/app-context'
import { getNotificationInfo, DEFAULT_PROFILE_PIC } from '@/lib/constants'
import ModalUserList from '@/components/ModalUserList'
import axios from '@/lib/axios'
import ZapIcon from './Icons/ZapIcon'

const NOTIFICATIONS_PER_PAGE = 7

const iconObjects = {
	comment: faComment,
	heart: faHeart,
	user: faUser,
	at: faAt,
}

export default function NotificationsBtn() {
	const context = useContext(AppContext)
	// const myNotificationsLastOpened =
	//   context.myProfile && context.myProfile.notifications_last_opened;
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
	const [loadingNotifications, setLoadingNotifications] = useState(true)
	const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false)
	const [notifications, setNotifications] = useState([])
	const dropdownRef = useRef(null)
	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
	const [previouslyLastOpened, setPreviouslyLastOpened] = useState()
	const [openUserList, setOpenUserList] = useState(null)
	const [queryPage, setQueryPage] = useState(1)
	const [hasMoreNotifications, setHasMoreNotifications] = useState(true)

	const toggleOpen = async () => {
		if (!isActive) {
			setPreviouslyLastOpened(context.myProfile.notifications_last_opened)
			updateNotificationsLastOpened()
			setHasUnreadNotifications(false)
		}
		setIsActive(!isActive)
	}

	const updateNotificationsLastOpened = async () => {
		try {
			await axios.post('/api/notifications')

			await context.setMyProfile({
				...context.myProfile,
				notifications_last_opened: new Date(),
			})
		} catch (err) {
			console.log(err)
		}
	}

	const handleMoreNotifications = async () => {
		if (!loadingMoreNotifications) {
			try {
				setLoadingMoreNotifications(true)
				const nextQueryPage = queryPage + 1
				setQueryPage(nextQueryPage)
				const moreNotifs = await axios.get(`/api/notifications?page=${nextQueryPage}&limit=${NOTIFICATIONS_PER_PAGE}`).then(res => res.data)

				if (moreNotifs.length < NOTIFICATIONS_PER_PAGE) setHasMoreNotifications(false)
				insertNewNotifications(moreNotifs)
				setLoadingMoreNotifications(false)
			} catch (e) {
				console.error(e)
			}
		}
	}

	const insertNewNotifications = (newNotifications, order) => {
		// remove repeats
		const existingNotificationIds = notifications.map(n => n.id)
		const filteredNewNotifications = newNotifications.filter(n => !existingNotificationIds.includes(n.id))
		// assign order
		if (order === 'front') {
			setNotifications([...filteredNewNotifications, ...notifications])
		} else {
			setNotifications([...notifications, ...filteredNewNotifications])
		}
	}

	const getNotifications = async () => {
		try {
			const notifs = await axios.get(`/api/notifications?page=1&limit=${NOTIFICATIONS_PER_PAGE}`).then(res => res.data)

			insertNewNotifications(notifs, 'front')
			if (notifs.length < NOTIFICATIONS_PER_PAGE) setHasMoreNotifications(false)
			setLoadingNotifications(false)
			setHasUnreadNotifications((notifs && notifs[0] && context.myProfile.notifications_last_opened === null) || (notifs && notifs[0] && new Date(notifs[0].to_timestamp) > new Date(context.myProfile.notifications_last_opened)))
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getNotifications()
	}, [])

	useInterval(getNotifications, 3 * 60 * 1000)

	return (
		<div className="relative">
			<div onClick={toggleOpen} className="dark:text-gray-200 hover:text-stpink transition-all rounded-full h-6 w-6 flex items-center justify-center cursor-pointer relative">
				<ZapIcon className="w-5 h-5" />
				{hasUnreadNotifications && <div className="bg-gradient-to-r from-[#4D54FF] to-[#E14DFF] absolute h-2 w-2 top-0 right-0 rounded-full" />}
			</div>
			<div
				ref={dropdownRef}
				className={`overflow-y-scroll text-black dark:text-gray-200 absolute text-center top-10 right-0 bg-white dark:bg-gray-900 py-2 px-2 shadow-lg rounded-xl transition-all transform border border-gray-200 dark:border-gray-800 z-1 ${isActive ? 'visible opacity-1 translate-y-2' : 'invisible opacity-0'}`}
				style={{
					maxWidth: context.windowSize.width < 768 ? '92vw' : 500,
					maxHeight: context.isMobile ? 500 : 650,
					width: loadingNotifications || !notifications || notifications.length === 0 ? 'unset' : context.windowSize.width < 768 ? '92vw' : 500,
				}}
			>
				{loadingNotifications && (
					<div className="flex items-center justify-center">
						<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
					</div>
				)}
				{!loadingNotifications &&
					notifications &&
					notifications.length > 0 &&
					notifications.map(notif =>
						// either link to your profile or to the nft

						notif.actors && notif.actors.length > 0 ? (
							// HAS CLICKABLE ACTORS
							<div className={`py-3 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-lg whitespace-nowrap flex items-start w-full max-w-full ${new Date(notif.to_timestamp) > new Date(previouslyLastOpened) ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700' : ''}`} key={notif.id}>
								<div className="w-max mr-2 relative min-w-[2.25rem]">
									<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
										<a onClick={() => setIsActive(!isActive)}>
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
								</div>
								<div className="flex-1 flex-col items-start text-left">
									<div className="text-sm whitespace-pre-line">
										<>
											{notif.actors.length == 1 ? (
												<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
													<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
														{notif.actors[0].name}{' '}
													</a>
												</Link>
											) : null}
											{notif.actors.length == 2 ? (
												<>
													<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[0].name}
														</a>
													</Link>
													<span className="text-gray-500"> and </span>
													<Link href="/[profile]" as={`/${notif.actors[1]?.username || notif.actors[1].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[1].name}{' '}
														</a>
													</Link>
												</>
											) : null}
											{notif.actors.length == 3 ? (
												<>
													<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[0].name}
														</a>
													</Link>
													<span className="text-gray-500">, </span>
													<Link href="/[profile]" as={`/${notif.actors[1]?.username || notif.actors[1].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[1].name}{' '}
														</a>
													</Link>
													<span className="text-gray-500">, and </span>
													<Link href="/[profile]" as={`/${notif.actors[2]?.username || notif.actors[2].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[2].name}{' '}
														</a>
													</Link>
												</>
											) : null}
											{notif.actors.length > 3 ? (
												<>
													<ModalUserList
														title="Followed You"
														isOpen={openUserList == notif.id}
														users={notif.actors ? notif.actors : []}
														closeModal={() => setOpenUserList(null)}
														onRedirect={() => {
															setOpenUserList(null)
															setIsActive(!isActive)
														}}
														emptyMessage="No followers yet."
													/>
													<Link href="/[profile]" as={`/${notif.actors[0]?.username || notif.actors[0].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[0].name}
														</a>
													</Link>
													<span className="text-gray-500">, </span>
													<Link href="/[profile]" as={`/${notif.actors[1]?.username || notif.actors[1].wallet_address}`}>
														<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
															{notif.actors[1].name}
														</a>
													</Link>
													<span className="text-gray-500">, and </span>

													<a className="text-black dark:text-gray-300 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setOpenUserList(notif.id)}>
														{notif.actors.length - 2} other {notif.actors.length - 2 == 1 ? 'person' : 'people'}{' '}
													</a>
												</>
											) : null}

											<span className="text-gray-500">
												{[2, 3].includes(notif.type_id) ? 'liked ' : null}
												{[1].includes(notif.type_id) ? 'followed you' : null}
												{[4, 5].includes(notif.type_id) ? 'commented on ' : null}
												{[6].includes(notif.type_id) ? 'mentioned you in ' : null}
												{[7].includes(notif.type_id) ? 'liked your comment on ' : null}
											</span>

											{notif.nft__nftdisplay__name ? (
												<Link href="/t/[...token]" as={`/t/${notif.nft__contract__address}/${notif.nft__token_identifier}`}>
													<a className="text-black dark:text-gray-200 cursor-pointer hover:text-stpink dark:hover:text-stpink" onClick={() => setIsActive(!isActive)}>
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
							<Link href={getNotificationInfo(notif.type_id).goTo === 'profile' ? '/[profile]' : '/t/[...token]'} as={getNotificationInfo(notif.type_id).goTo === 'profile' ? (notif.link_to_profile__address ? `/${notif.link_to_profile__username || notif.link_to_profile__address}` : `/${context.myProfile.username || context.user.publicAddress}`) : `/t/${notif.nft__contract__address}/${notif.nft__token_identifier}`} key={notif.id}>
								<div className={`py-3 px-3 hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap flex items-start w-full max-w-full ${new Date(notif.to_timestamp) > new Date(previouslyLastOpened) ? 'bg-gray-100 hover:bg-gray-200' : ''}`} onClick={() => setIsActive(!isActive)} key={notif.id}>
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
				{!loadingNotifications && notifications && notifications.length === 0 && <div className="py-2 px-4 whitespace-nowrap">No notifications yet.</div>}
				{!loadingNotifications && notifications && notifications.length !== 0 && hasMoreNotifications && (
					<div className="flex justify-center items-center mb-1 mt-1">
						<div onClick={handleMoreNotifications} className={`flex w-36 h-8 items-center justify-center  text-xs border-gray-600 text-gray-600 border rounded-full px-2 py-1 hover:text-stpink ${loadingMoreNotifications ? '' : 'hover:border-stpink'} transition cursor-pointer`}>
							{loadingMoreNotifications ? <div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin"></div> : 'Show More'}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
