import { createRef, useContext, useState } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
//import { faSun } from "@fortawesome/free-regular-svg-icons";
//import { faEdit } from "@fortawesome/free-regular-svg-icons";
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import ShareButton from './ShareButton'
import ReactPlayer from 'react-player'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import { getBidLink, getContractName, removeTags } from '@/lib/utilities'
import ModalTokenDetail from './ModalTokenDetail'
import CappedWidth from './CappedWidth'
import axios from '@/lib/axios'

const SpotlightItem = ({ isMyProfile, listId, pageProfile, item, setOpenCardMenu, openCardMenu, removeSpotlightItem }) => {
	const [moreShown, setMoreShown] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [muted, setMuted] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [currentlyOpenModal, setCurrentlyOpenModal] = useState(false)
	const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState(true)
	const [videoReady, setVideoReady] = useState(false)
	const [thisItem, setThisItem] = useState(item)

	const divRef = createRef(null)

	const max_description_length = 170
	const aspect_ratio_cutoff = 1.6

	const { isMobile } = useContext(AppContext)

	const truncateWithEllipses = (text, max) => {
		if (text) return text.substr(0, max - 1) + (text.length > max ? '...' : '')
	}

	const handleRefreshNFTMetadata = async () => {
		mixpanel.track('Clicked refresh metadata')
		setRefreshing(true)

		const { data } = await axios.post(`/api/refreshmetadata/${thisItem.nft_id}`).then(res => res.data)

		if (data) setThisItem(data)

		setRefreshing(false)
	}

	const getImageUrl = () => {
		var img_url = thisItem.token_img_url ? thisItem.token_img_url : null

		if (img_url && img_url.includes('https://lh3.googleusercontent.com')) {
			thisItem.token_aspect_ratio && Number(thisItem.token_aspect_ratio) > aspect_ratio_cutoff ? (img_url = img_url.split('=')[0] + '=w2104') : (img_url = img_url.split('=')[0] + '=w1004')
		}
		return img_url
	}

	const getBackgroundColor = item => (item.token_background_color && item.token_background_color.length === 6 ? `#${item.token_background_color}` : null)

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalTokenDetail isOpen={currentlyOpenModal} setEditModalOpen={setCurrentlyOpenModal} item={thisItem} />
				</>
			) : null}

			<CappedWidth>
				<div className="relative">
					<div ref={divRef} className="md:w-3/4 mx-auto flex items-center flex-col md:flex-row md:p-0">
						<div className="flex-1 text-right">
							<div>
								{thisItem.token_has_video ? (
									<>
										<div className={`w-full h-full ${videoReady ? 'hidden' : null}`}>
											<div className="w-full text-center flex items-center mt-24 justify-center">
												<div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
											</div>
										</div>
										<div className={`w-full shadow-lg h-full relative ${videoReady ? '' : 'invisible'}`}>
											<ReactPlayer
												url={thisItem.token_animation_url}
												playing={currentlyPlayingVideo}
												loop
												controls
												muted={muted}
												className={'w-full h-full'}
												width={isMobile ? '100%' : divRef?.current?.clientWidth ? divRef?.current?.clientWidth / 2 : null}
												height={'1'}
												//width={columns === 1 ? window.innerWidth : "100%"}
												// height={
												//   columns === 1
												//     ? item.imageRef
												//       ? item.imageRef.current
												//         ? item.imageRef.current.height
												//         : null
												//       : null
												//     : "100%"
												// }
												playsinline
												onReady={() => setVideoReady(true)}
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
											{refreshing && (
												<div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white bg-opacity-50">
													<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin mb-2" />
													<div>Refreshing...</div>
												</div>
											)}
										</div>
									</>
								) : (
									<div className="relative">
										<div
											onClick={() => {
												mixpanel.track('Open NFT modal')
												setCurrentlyOpenModal(true)
												setMuted(true)
												setCurrentlyPlayingVideo(false)
											}}
											className="cursor-pointer text-right flex flex-row"
										>
											{!imageLoaded ? (
												<div className="w-full text-center flex items-center justify-center" style={{ height: divRef?.current?.clientWidth ? divRef?.current?.clientWidth : 375 }}>
													<div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
												</div>
											) : null}

											<img
												className="hover:opacity-90  transition-all  shadow-lg"
												ref={item.imageRef}
												src={getImageUrl()}
												alt={item.token_name}
												onLoad={() => setImageLoaded(true)}
												style={{
													...(!imageLoaded
														? { display: 'none' }
														: isMobile
														? {
																backgroundColor: getBackgroundColor(item),
																width: divRef?.current?.clientWidth,
																height: item.token_aspect_ratio && divRef?.current?.clientWidth ? divRef?.current?.clientWidth / item.token_aspect_ratio : null,
														  }
														: {
																backgroundColor: getBackgroundColor(item),
																maxHeight: 500,
														  }),
												}}
											/>
										</div>
										{refreshing && (
											<div className="absolute inset-0 cursor-pointer flex items-center justify-center bg-white bg-opacity-50">
												<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin mb-2" />
												<div>Refreshing...</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
						<div className="flex-1 text-left mt-3 md:mt-4 md:pl-12 w-full p-6 pb-0 md:p-0">
							{/*START DROPDOWN MENU */}
							{isMyProfile ? (
								<div className="relative sm:static">
									<div className="absolute top-0 right-0 sm:right-6">
										<button
											onClick={e => {
												e.stopPropagation()

												setOpenCardMenu(openCardMenu == item.nft_id + '_' + listId ? null : item.nft_id + '_' + listId)
											}}
											className="text-right flex items-center justify-center text-gray-600 hover:text-stpink"
										>
											<FontAwesomeIcon className="w-5 h-5" icon={faEllipsisH} />
										</button>
										{openCardMenu == item.nft_id + '_' + listId ? (
											<div className="flex justify-end relative z-10">
												<div className={`absolute text-center top-2 bg-white shadow-lg py-2 px-2 rounded-xl transition-all text-md transform border border-gray-100 ${openCardMenu == item.nft_id + '_' + listId ? 'visible opacity-1 ' : 'invisible opacity-0'}`}>
													<div className="py-2 px-3 hover:text-stpink hover:bg-gray-50  transition-all rounded-lg cursor-pointer whitespace-nowrap" onClick={removeSpotlightItem}>
														Remove Spotlight
													</div>
													<div className="py-2 px-3 hover:text-stpink hover:bg-gray-50  transition-all rounded-lg cursor-pointer whitespace-nowrap" onClick={handleRefreshNFTMetadata}>
														Refresh Metadata
													</div>
												</div>
											</div>
										) : null}
									</div>
								</div>
							) : null}
							{/* END DROPDOWN MENU */}

							<div>
								<div className="flex flex-row">
									<div
										onClick={() => {
											mixpanel.track('Open NFT modal')
											setCurrentlyOpenModal(true)
											setMuted(true)
											setCurrentlyPlayingVideo(false)
										}}
										className="mb-2 sm:mb-4 text-2xl sm:text-3xl hover:text-stpink cursor-pointer break-words"
									>
										{item.token_name}
									</div>
									<div className="flex-grow"></div>
								</div>

								{item.token_description ? (
									<div className="pb-4 text-sm sm:text-base text-gray-500 break-words">
										<div>
											{item.token_description?.length > max_description_length && !moreShown ? (
												<>
													{truncateWithEllipses(removeTags(item.token_description), max_description_length)}{' '}
													<a
														onClick={() => {
															setMoreShown(true)
														}}
														className="text-gray-900 hover:text-gray-500 cursor-pointer"
													>
														{' '}
														more
													</a>
												</>
											) : (
												<div className="whitespace-pre-line">{removeTags(item.token_description)}</div>
											)}
										</div>
									</div>
								) : null}

								<div className="flex items-center">
									<div className="mr-4 text-base ">
										<LikeButton item={item} />
									</div>
									<div className="mr-4 text-base ">
										<CommentButton
											item={item}
											handleComment={() => {
												mixpanel.track('Open NFT modal via comment button')
												setCurrentlyOpenModal(true)
												setMuted(true)
												setCurrentlyPlayingVideo(false)
											}}
										/>
									</div>
									<div className="mr-4 text-base flex items-center justify-center">
										<ShareButton url={window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + `/t/${item.contract_address}/${item.token_id}`} type={'item'} />
									</div>
								</div>
								<div className="flex-grow ">
									<div className="flex flex-row mt-8">
										<a
											href={getBidLink(item)}
											title={`Buy on ${getContractName(item)}`}
											target="_blank"
											onClick={() => {
												mixpanel.track('OpenSea link click')
											}}
											rel="noreferrer"
										>
											<div className="text-base px-5 py-2 shadow-md transition-all rounded-full text-white bg-stpink hover:bg-white hover:text-stpink border-2 border-stpink">{`Bid on ${getContractName(item)}`}</div>
										</a>

										<div className="flex-grow"></div>
									</div>
								</div>
								<div
									className={`flex ${
										//
										item.multiple_owners && pageProfile.profile_id !== item.creator_id ? 'flex-col lg:flex-row  pb-6' : 'flex-row'
									} pt-4 mt-8 w-full`}
								>
									{item.contract_is_creator ? (
										<div className="flex-col flex-1">
											<div className="flex-shrink mb-1 pr-2 text-xs text-gray-500">Created by</div>
											<div className="flex-shrink">
												<Link href="/c/[collection]" as={`/c/${item.collection_slug}`}>
													<a className="flex flex-row items-center">
														<div className="w-8">
															<img alt={item.collection_name} src={item.collection_img_url ? item.collection_img_url : DEFAULT_PROFILE_PIC} className="rounded-full h-8 w-8" />
														</div>
														<div className="mx-2 hover:text-stpink">{truncateWithEllipses(item.collection_name + ' Collection', 25)} </div>
													</a>
												</Link>
											</div>
										</div>
									) : item.creator_id ? (
										<div className="flex-col flex-1 mb-6">
											<div className="flex-shrink pr-2 mb-1 text-xs text-gray-500">{item.owner_id == item.creator_id ? 'Created & Owned By' : 'Created by'}</div>
											<div className="flex-shrink">
												<Link href="/[profile]" as={`/${item?.creator_username || item.creator_address}`}>
													<a className="flex flex-row items-center">
														<div>
															<img alt={item.creator_name} src={item.creator_img_url ? item.creator_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
														</div>
														<div className="ml-2 hover:text-stpink">{truncateWithEllipses(item.creator_name, 25)}</div>
													</a>
												</Link>
											</div>
										</div>
									) : null}
									{(item.owner_id && (item.owner_id != item.creator_id || item.contract_is_creator)) || item.owner_count > 0 ? (
										<div className="flex-1">
											<div className="flex-shrink pr-2 mb-1 text-xs text-gray-500">Owned by</div>
											<div className="">
												{item.multiple_owners ? (
													pageProfile.profile_id !== item.creator_id ? (
														<div className="flex flex-row items-center">
															<Link href="/[profile]" as={`/${pageProfile.slug_address}`}>
																<a className="flex flex-row items-center pr-2 ">
																	<div>
																		<img alt={pageProfile.name ? pageProfile.name : pageProfile.username ? pageProfile.username : pageProfile.wallet_addresses_excluding_email.length > 0 ? pageProfile.wallet_addresses_excluding_email[0] : 'Unknown'} src={pageProfile.img_url ? pageProfile.img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-2 w-8 h-8" />
																	</div>
																	<div className="hover:text-stpink">{pageProfile.name ? pageProfile.name : pageProfile.username ? pageProfile.username : pageProfile.wallet_addresses_excluding_email.length > 0 ? pageProfile.wallet_addresses_excluding_email[0] : 'Unknown'}</div>
																</a>
															</Link>

															<div className="text-gray-400 text-sm mr-2 -ml-1 mt-1">
																&amp; {item.owner_count - 1} other
																{item.owner_count - 1 > 1 ? 's' : null}
															</div>
														</div>
													) : (
														<span className="text-gray-500">Multiple owners</span>
													)
												) : item.owner_id ? (
													<Link href="/[profile]" as={`/${item?.owner_username || item.owner_address}`}>
														<a className="flex flex-row items-center">
															<div>
																<img alt={item.owner_name} src={item.owner_img_url ? item.owner_img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-2 w-8 h-8" />
															</div>
															<div className="hover:text-stpink">{truncateWithEllipses(item.owner_name, 25)}</div>
														</a>
													</Link>
												) : null}
											</div>
										</div>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</CappedWidth>
		</>
	)
}

export default SpotlightItem
