import { useState, useContext, useRef } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faEllipsisH, faStar } from '@fortawesome/free-solid-svg-icons'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import ShareButton from './ShareButton'
import ReactPlayer from 'react-player'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import MiniFollowButton from './MiniFollowButton'
import TokenCardImage from '@/components/TokenCardImage'
import { removeTags, formatAddressShort, truncateWithEllipses } from '@/lib/utilities'
import axios from '@/lib/axios'
import { MenuIcon } from '@heroicons/react/solid'

const TokenCard = ({
	originalItem,
	//showDuplicateNFTs,
	//setShowDuplicateNFTs,
	isMyProfile,
	listId,
	setOpenCardMenu,
	openCardMenu,
	changeSpotlightItem,
	currentlyPlayingVideo,
	setCurrentlyPlayingVideo,
	setCurrentlyOpenModal,
	pageProfile,
	handleRemoveItem,
	showUserHiddenItems,
	showDuplicates,
	setHasUserHiddenItems,
	isChangingOrder,
}) => {
	const [item, setItem] = useState(originalItem)
	const [moreShown, setMoreShown] = useState(false)
	const [showVideo, setShowVideo] = useState(false)
	const [muted, setMuted] = useState(true)
	const [refreshing, setRefreshing] = useState(false)

	const context = useContext(AppContext)

	const divRef = useRef()

	const handleHide = async () => {
		setItem({ ...item, user_hidden: true })
		setHasUserHiddenItems(true)

		// Post changes to the API
		await axios.post(`/api/hidenft/${item.nft_id}/${listId}`, {
			showDuplicates: showDuplicates ? 1 : 0,
		})

		if (!showUserHiddenItems) handleRemoveItem(item.nft_id)

		mixpanel.track('Hid item')
	}

	const handleUnhide = async () => {
		setItem({ ...item, user_hidden: false })

		// Post changes to the API
		await axios.post(`/api/unhidenft/${item.nft_id}/${listId}`, {
			showDuplicates: showDuplicates ? 1 : 0,
		})

		mixpanel.track('Unhid item')
	}

	const handleRefreshNFTMetadata = async () => {
		// Keep these from the original item
		const user_hidden = item.user_hidden
		const owner_id = item.owner_id

		setRefreshing(true)
		const { data } = await axios.post(`/api/refreshmetadata/${item.nft_id}`).then(res => res.data)

		if (data) setItem({ ...data, user_hidden: user_hidden, owner_id: owner_id })
		else handleRemoveItem(item.nft_id)

		setRefreshing(false)
	}

	const max_description_length = 65

	const getBackgroundColor = item => {
		if (item.token_background_color && item.token_background_color.length === 6) {
			return `#${item.token_background_color}`
		} else {
			return null
		}
	}

	return (
		<div className={`w-full h-full ${isChangingOrder ? 'cursor-move' : ''}`}>
			<div ref={divRef} className={`w-full h-full sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all bg-white flex flex-col ${item.user_hidden ? 'opacity-70 bg-gray-200' : ''} ${isChangingOrder ? 'border-2 border-stpink' : ''}`}>
				<div ref={item.imageRef} className="p-4 flex flex-row items-center relative">
					<div className="pr-2 ">
						{item.contract_is_creator ? (
							<Link href="/c/[collection]" as={`/c/${item.collection_slug}`}>
								<a className="flex flex-row items-center ">
									<div>
										<img alt={item.collection_name} src={item.collection_img_url ? item.collection_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-6 h-6" />
									</div>
									<div className="text-gray-800 hover:text-stpink ml-2">{truncateWithEllipses(item.collection_name + ' Collection', 30)}</div>
								</a>
							</Link>
						) : item.creator_address ? (
							<Link href="/[profile]" as={`/${item?.creator_username || item.creator_address}`}>
								<a className="flex flex-row items-center ">
									<div>
										<img alt={item.creator_name} src={item.creator_img_url ? item.creator_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-6 h-6" />
									</div>
									<div className="ml-2 hover:text-stpink truncate">{truncateWithEllipses(item.creator_name, 22)}</div>
								</a>
							</Link>
						) : null}
					</div>

					{context.myProfile?.profile_id !== item.creator_id && !(isMyProfile && listId !== 3) && !item.contract_is_creator && <MiniFollowButton profileId={item.creator_id} />}
					<div className="flex-grow">&nbsp;</div>

					<div>
						{isMyProfile && listId !== 3 ? (
							<button
								onClick={e => {
									e.stopPropagation()

									setOpenCardMenu(openCardMenu == item.nft_id + '_' + listId ? null : item.nft_id + '_' + listId)
								}}
								className="text-right text-gray-600 hover:text-stpink"
							>
								<FontAwesomeIcon className="!w-4 !h-4" icon={faEllipsisH} />
							</button>
						) : null}

						{openCardMenu == item.nft_id + '_' + listId ? (
							<div className="">
								<div className="flex justify-end relative z-10">
									<div className={`absolute text-center top-2 bg-white shadow-lg py-2 px-2 rounded-xl transition-all text-md transform border border-gray-100 ${openCardMenu == item.nft_id + '_' + listId ? 'visible opacity-1 ' : 'invisible opacity-0'}`}>
										<div
											className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap flex flew-row"
											onClick={() => {
												mixpanel.track('Clicked Spotlight Item')
												changeSpotlightItem(item)
											}}
										>
											<div>
												<FontAwesomeIcon className="h-4 w-4 mr-1.5" icon={faStar} />
											</div>
											<div>Spotlight Item</div>
										</div>

										<div className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap" onClick={item.user_hidden ? handleUnhide : handleHide}>
											{item.user_hidden ? `Unhide From ${listId === 1 ? 'Created' : listId === 2 ? 'Owned' : listId === 3 ? 'Liked' : 'List'}` : `Hide From ${listId === 1 ? 'Created' : listId === 2 ? 'Owned' : listId === 3 ? 'Liked' : 'List'}`}
										</div>
										<div className="py-2 px-3 hover:text-stpink hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap" onClick={handleRefreshNFTMetadata}>
											Refresh Metadata
										</div>
									</div>
								</div>
							</div>
						) : null}
					</div>
				</div>
				{item.token_has_video && showVideo && currentlyPlayingVideo === item.nft_id ? (
					<div className="bg-black">
						<ReactPlayer
							url={item.token_animation_url}
							playing={currentlyPlayingVideo === item.nft_id || (item.token_has_video && !item.token_img_url)}
							loop
							controls
							muted={muted}
							width={item.imageRef?.current?.clientWidth}
							height={item.imageRef?.current?.clientWidth}
							playsinline
							//onReady={this.setSpans}
							// Disable downloading & right click
							config={{
								file: {
									attributes: {
										onContextMenu: e => e.preventDefault(),
										controlsList: 'nodownload',
									},
								},
							}}
						/>
					</div>
				) : (
					<div className="relative">
						<div
							className="cursor-pointer"
							onClick={() => {
								mixpanel.track('Open NFT modal')
								setCurrentlyOpenModal(item)
								setShowVideo(false)
								setMuted(true)
								setCurrentlyPlayingVideo(null)
							}}
						>
							<div
								style={{
									backgroundColor: getBackgroundColor(item),
								}}
							>
								<TokenCardImage nft={item} />
							</div>
						</div>
						{item.token_has_video ? (
							<div
								className="p-4 opacity-80 hover:opacity-100 absolute bottom-0 right-0 cursor-pointer"
								onClick={() => {
									mixpanel.track('Play card video')
									setShowVideo(true)
									setMuted(false)
									setCurrentlyPlayingVideo(item.nft_id)
								}}
							>
								<FontAwesomeIcon className="h-5 w-5 text-white filter drop-shadow" icon={faPlay} />
							</div>
						) : null}
						{refreshing && (
							<div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white bg-opacity-50">
								<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin mb-2" />
								<div>Refreshing...</div>
							</div>
						)}
						{isChangingOrder && (
							<div className="absolute cursor-move inset-0 cursor-pointer flex flex-col items-center justify-center bg-white bg-opacity-70">
								<div className="p-2 bg-white rounded-lg shadow flex justify-center items-center">
									<MenuIcon className="w-5 h-5 text-black mr-1" aria-hidden="true" />
									<div>Drag to Reorder</div>
								</div>
							</div>
						)}
					</div>
				)}

				<div className="p-4">
					<div>
						<div className="">
							<div
								onClick={() => {
									mixpanel.track('Open NFT modal')
									setCurrentlyOpenModal(item)

									setShowVideo(false)
									setMuted(true)
									setCurrentlyPlayingVideo(null)
								}}
								className="break-words cursor-pointer truncate"
								style={context.isMobile ? { width: context?.windowSize?.width - 16 * 2 } : {}}
							>
								{item.token_name}
							</div>

							<div style={context.isMobile ? { width: context?.windowSize?.width - 16 * 2 } : {}} className="cursor-pointer py-4 text-gray-500 text-sm">
								{moreShown ? (
									<div className="whitespace-pre-line">{removeTags(item.token_description)}</div>
								) : (
									<div>
										{item.token_description?.length > max_description_length ? (
											<>
												{truncateWithEllipses(removeTags(item.token_description), max_description_length)}{' '}
												<a onClick={() => setMoreShown(true)} className="text-gray-900 hover:text-gray-500 cursor-pointer">
													{' '}
													more
												</a>
											</>
										) : (
											<div>{removeTags(item.token_description)}</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center">
							<div className="mr-4">
								<LikeButton item={item} />
							</div>
							<div className="mr-4">
								<CommentButton
									item={item}
									handleComment={() => {
										mixpanel.track('Open NFT modal via comment button')
										setCurrentlyOpenModal(item)
										setShowVideo(false)
										setMuted(true)
										setCurrentlyPlayingVideo(null)
									}}
								/>
							</div>
							<div className="flex items-center justify-center">
								<ShareButton url={window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + `/t/${item.contract_address}/${item.token_id}`} type={'item'} />
							</div>
						</div>
					</div>
				</div>
				<div className="flex-1 flex items-end w-full">
					<div className="border-t border-gray-300 p-4 flex flex-col w-full">
						<div className="flex-shrink pr-2 text-xs text-gray-500 mb-1">Owned by</div>
						<div>
							{item.owner_count && item.owner_count > 1 ? (
								pageProfile && listId === 2 ? (
									<div className="flex flex-row items-center pt-1">
										<Link href="/[profile]" as={`/${pageProfile.slug_address}`}>
											<a className="flex flex-row items-center pr-2 ">
												<div>
													<img alt={pageProfile.name && pageProfile.name != 'Unnamed' ? pageProfile.name : pageProfile.username ? pageProfile.username : pageProfile.wallet_addresses_excluding_email.length > 0 ? formatAddressShort(pageProfile.wallet_addresses_excluding_email[0]) : 'Unknown'} src={pageProfile.img_url ? pageProfile.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-2 h-6 w-6" />
												</div>
												<div className="text-gray-800 hover:text-stpink">{truncateWithEllipses(pageProfile.name && pageProfile.name != 'Unnamed' ? pageProfile.name : pageProfile.username ? pageProfile.username : pageProfile.wallet_addresses_excluding_email.length > 0 ? formatAddressShort(pageProfile.wallet_addresses_excluding_email[0]) : 'Unknown', 14)}</div>
											</a>
										</Link>

										<div className="text-gray-400 text-sm mr-2 -ml-1 mt-px">
											&amp; {item.owner_count - 1} other
											{item.owner_count - 1 > 1 ? 's' : null}
										</div>
										{context.myProfile?.profile_id !== item.owner_id && <MiniFollowButton profileId={item.owner_id} />}
										<div className="flex-grow">&nbsp;</div>
									</div>
								) : (
									<span className="text-gray-500">Multiple owners</span>
								)
							) : item.owner_id ? (
								<div className="flex flex-row items-center pt-1">
									<Link href="/[profile]" as={`/${item?.owner_username || item.owner_address}`}>
										<a className="flex flex-row items-center pr-2 ">
											<div>
												<img alt={item.owner_name} src={item.owner_img_url ? item.owner_img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-2 w-6 h-6" />
											</div>
											<div className="text-gray-800 hover:text-stpink">{truncateWithEllipses(item.owner_name, 24)}</div>
										</a>
									</Link>
									{context.myProfile?.profile_id !== item.owner_id && !(isMyProfile && listId !== 3) && <MiniFollowButton profileId={item.owner_id} />}
									<div className="flex-grow">&nbsp;</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TokenCard
