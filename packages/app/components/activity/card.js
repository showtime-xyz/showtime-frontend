import { useContext, useRef, useEffect, useState } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { DotsHorizontalIcon } from '@heroicons/react/solid'

import LikeButton from 'app/components/buttons/like'
import CommentButton from 'app/components/buttons/comment'
import ActivityImages from 'app/components/activity/images'
import { Like, Comment, Sell, Buy, Create, Follow, Transfer } from 'app/components/activity/types'

import { Link } from 'app/navigation/link'
import { View, Text, Pressable, Image } from 'design-system'
import { ACTIVITY_TYPES, DEFAULT_PROFILE_PIC, activityIconObjects } from 'app/lib/constants'
import { AppContext } from 'app/context/app-context'
import { mixpanel } from 'app/lib/mixpanel'
import { truncateWithEllipses } from 'app/lib/utilities'
import { axios } from 'app/lib/axios'
import { useDetectOutsideClick } from 'app/hooks/use-detect-outside-click'

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
		<View
			ref={cardRef}
			tw="mb-6 pt-4 sm:rounded-lg bg-white dark:bg-gray-900 shadow-md border-transparent dark:border-gray-800 border-t-2 md:dark:border md:border-t-2"
			style={{
				borderTopColor: activityIconObjects[type].color,
			}}
		>
			{/* actor data */}
			<View tw="border-b border-gray-200 dark:border-gray-800 pb-4 px-4">
				<View tw="flex-row">
					<View tw="flex-row items-center">
						<View>
							<Link href={`/${actor?.username || actor?.wallet_address}`}>
								<Pressable
									tw="flex-row relative w-max flex-shrink-0"
									onPress={() => mixpanel.track('Activity - Click on user profile')}
								>
									<Image
										source={{ uri: getProfileImageUrl(actor.img_url || DEFAULT_PROFILE_PIC) }}
										tw="rounded-full mr-2 w-14 h-14  hover:opacity-90 transition-all"
									/>
									<View
										tw="absolute bottom-0 right-2 rounded-full h-5 w-5 items-center justify-center shadow border-1 border-white dark:border-black"
										style={{ backgroundColor: activityIconObjects[type].color }}
									>
										{/* <FontAwesomeIcon tw="w-3 h-3 text-white" icon={activityIconObjects[type].icon} /> */}
									</View>
								</Pressable>
							</Link>
						</View>
						<View tw="flex-col max-w-full h-10 justify-between">
							<Link href={`/${actor?.username || actor?.wallet_address}`}>
								<Pressable onPress={() => mixpanel.track('Activity - Click on user profile')}>
									<Text tw="dark:text-gray-300 hover:text-stpink dark:hover:text-stpink text-base">
										{truncateWithEllipses(actor.name, 24)}
									</Text>
								</Pressable>
							</Link>

							{actor.username && (
								<Link href={`/${actor?.username || actor?.wallet_address}`}>
									<Pressable onPress={() => mixpanel.track('Activity - Click on user profile')}>
										<Text variant="small" tw="text-gray-400 text-xs">
											@{actor.username}
										</Text>
									</Pressable>
								</Link>
							)}

							<Text variant="small" tw="text-gray-400 text-xs">
								{formatDistanceToNowStrict(new Date(`${act.timestamp}Z`), {
									addSuffix: true,
								})}
							</Text>
						</View>
					</View>
					<View tw="flex-grow"></View>
					{context.user && (
						<View>
							<View onPress={onCornerMenuClick} tw="text-right text-gray-300 relative">
								{/* <DotsHorizontalIcon tw="dark:text-gray-500 hover:text-stpink dark:hover:text-stpink cursor-pointer w-6 h-6" /> */}
								<View
									ref={dropdownRef}
									tw={`absolute text-black dark:text-gray-400 text-left top-4 right-1 border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 py-2 px-2 shadow-lg rounded-xl transition-all text-md transform z-1 ${
										isActive ? 'visible opacity-1 translate-y-1' : 'invisible opacity-0'
									}`}
								>
									<Text
										tw="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-stpink dark:hover:text-gray-300 rounded-lg cursor-pointer whitespace-nowrap"
										onPress={handleUnfollow}
									>
										Unfollow
									</Text>
									<Text
										tw="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-stpink dark:hover:text-gray-300 rounded-lg cursor-pointer whitespace-nowrap"
										onPress={() => setReportModalIsOpen(id)}
									>
										Report
									</Text>
								</View>
							</View>
						</View>
					)}
				</View>
			</View>
			{/* content */}
			<>
				<View tw="max-w-full mt-4 px-4 flex-row">
					<View>{content}</View>
				</View>

				{nfts ? (
					<>
						<View tw="mt-4">
							<ActivityImages nfts={nfts} openModal={handleOpenModal} cardWidth={cardWidth} />
						</View>
						{single ? (
							<View tw="flex-row items-center pt-2 ml-4 mb-4">
								<View tw="mr-4 text-base mt-2">
									<LikeButton item={nfts[0]} />
								</View>

								<View tw="mr-4 text-base mt-2">
									<CommentButton
										item={nfts[0]}
										handleComment={() => setItemOpenInModal({ nftGroup: nfts, index: 0 })}
									/>
								</View>
							</View>
						) : null}
					</>
				) : null}
			</>
		</View>
	)
}
