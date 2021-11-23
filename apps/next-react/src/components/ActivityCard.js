import { useContext, useRef, useEffect, useState } from 'react'
import { ACTIVITY_TYPES, DEFAULT_PROFILE_PIC, activityIconObjects } from '@/lib/constants'
import { Like, Comment, Sell, Buy, Create, Follow, Transfer } from './ActivityTypes'
import { formatDistanceToNowStrict } from 'date-fns'
import Link from 'next/link'
import AppContext from '@/context/app-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import ActivityImages from './ActivityImages'
import mixpanel from 'mixpanel-browser'
import useDetectOutsideClick from '@/hooks/useDetectOutsideClick'
import { truncateWithEllipses } from '@/lib/utilities'
import axios from '@/lib/axios'
import { DotsHorizontalIcon } from '@heroicons/react/solid'

const getProfileImageUrl = img_url => {
	if (img_url && img_url.includes('https://lh3.googleusercontent.com')) {
		img_url = img_url.split('=')[0] + '=s112'
	}
	return img_url
}

export default function ActivityCard({ act, setItemOpenInModal, setReportModalIsOpen, removeActorFromFeed }) {
	const context = useContext(AppContext)
	const { id, nfts, actor } = act

	const single = act.nfts?.length === 1
	let content = null

	const [cardWidth, setCardWidth] = useState(null)
	const dropdownRef = useRef(null)
	const cardRef = useRef(null)

	const handleOpenModal = index => {
		setItemOpenInModal({ nftGroup: nfts, index })
	}

	const handleUnfollow = async () => {
		// Change myLikes via setMyLikes
		context.setMyFollows(context.myFollows.filter(f => f?.profile_id !== actor.profile_id))
		removeActorFromFeed(actor.profile_id)
		// Post changes to the API
		await axios.post(`/api/unfollow_v2/${actor.profile_id}`)
		mixpanel.track('Unfollowed profile from Newsfeed dropdown')
	}

	const { type } = act
	switch (type) {
		case ACTIVITY_TYPES.LIKE:
			content = <Like act={act} />
			break
		case ACTIVITY_TYPES.COMMENT:
			content = <Comment act={act} />
			break
		case ACTIVITY_TYPES.SELL:
			content = <Sell act={act} />
			break
		case ACTIVITY_TYPES.BUY:
			content = <Buy act={act} />
			break
		case ACTIVITY_TYPES.CREATE:
			content = <Create act={act} />
			break
		case ACTIVITY_TYPES.FOLLOW:
			content = <Follow act={act} />
			break
		case ACTIVITY_TYPES.SEND:
		case ACTIVITY_TYPES.RECEIVE:
			content = <Transfer act={act} />
	}

	useEffect(() => {
		setCardWidth(cardRef?.current?.clientWidth)
	}, [cardRef?.current?.clientWidth, context.windowSize])

	const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)

	const onCornerMenuClick = () => setIsActive(!isActive)
	return (
		<div
			ref={cardRef}
			className="flex flex-col flex-1 mb-6 pt-4 sm:rounded-lg bg-white dark:bg-gray-900 shadow-md border-transparent dark:border-gray-800 border-t-2 md:dark:border md:border-t-2"
			style={{
				borderTopColor: activityIconObjects[type].color,
			}}
		>
			{/* actor data */}
			<div className="border-b border-gray-200 dark:border-gray-800 pb-4 px-4">
				<div className="flex flex-row">
					<div className="flex items-center">
						<Link href="/[profile]" as={`/${actor?.username || actor?.wallet_address}`}>
							<a className="relative w-max flex-shrink-0" onClick={() => mixpanel.track('Activity - Click on user profile')}>
								<img src={getProfileImageUrl(actor.img_url || DEFAULT_PROFILE_PIC)} className="rounded-full mr-2 w-14 h-14  hover:opacity-90 transition-all" />
								<div className="absolute bottom-0 right-2 rounded-full h-5 w-5 flex items-center justify-center shadow" style={{ backgroundColor: activityIconObjects[type].color }}>
									<FontAwesomeIcon className="w-3 h-3 text-white" icon={activityIconObjects[type].icon} />
								</div>
							</a>
						</Link>
						<div className="flex flex-col flex-1 max-w-full">
							<Link href="/[profile]" as={`/${actor?.username || actor?.wallet_address}`}>
								<a onClick={() => mixpanel.track('Activity - Click on user profile')}>
									<div className="mr-2 dark:text-gray-300 hover:text-stpink dark:hover:text-stpink text-base -mb-1">{truncateWithEllipses(actor.name, 24)}</div>
								</a>
							</Link>

							{actor.username && (
								<Link href="/[profile]" as={`/${actor?.username || actor?.wallet_address}`}>
									<a onClick={() => mixpanel.track('Activity - Click on user profile')}>
										<div className="text-gray-400 text-xs mx-px">@{actor.username}</div>
									</a>
								</Link>
							)}
							<div className="text-gray-400 text-xs">
								{formatDistanceToNowStrict(new Date(`${act.timestamp}Z`), {
									addSuffix: true,
								})}
							</div>
						</div>
					</div>
					<div className="flex-grow"></div>
					{context.user && (
						<div>
							<div onClick={onCornerMenuClick} className="text-right text-gray-300 relative">
								<DotsHorizontalIcon className="dark:text-gray-500 hover:text-stpink dark:hover:text-stpink cursor-pointer w-6 h-6" />
								<div ref={dropdownRef} className={`absolute text-black dark:text-gray-400 text-left top-4 right-1 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-2 shadow-lg rounded-xl transition-all text-md transform z-1 ${isActive ? 'visible opacity-1 translate-y-1' : 'invisible opacity-0'}`}>
									<div className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-stpink dark:hover:text-gray-300 rounded-lg cursor-pointer whitespace-nowrap" onClick={handleUnfollow}>
										Unfollow
									</div>
									<div className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-stpink dark:hover:text-gray-300 rounded-lg cursor-pointer whitespace-nowrap" onClick={() => setReportModalIsOpen(id)}>
										Report
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			{/* content */}
			<>
				<div className="max-w-full mt-4 px-4 flex flex-row">
					<div>{content}</div>
				</div>

				{nfts ? (
					<>
						<div className="flex mt-4 max-w-full">
							<ActivityImages nfts={nfts} openModal={handleOpenModal} cardWidth={cardWidth} />
						</div>
						{single ? (
							<div className="flex items-center pt-2 ml-4 mb-4">
								<div className="mr-4 text-base mt-2">
									<LikeButton item={nfts[0]} />
								</div>

								<div className="mr-4 text-base mt-2">
									<CommentButton item={nfts[0]} handleComment={() => setItemOpenInModal({ nftGroup: nfts, index: 0 })} />
								</div>
							</div>
						) : null}
					</>
				) : null}
			</>
		</div>
	)
}
