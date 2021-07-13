import { useRef, useContext, useState, Fragment } from 'react'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import Link from 'next/link'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import ShareButton from './ShareButton'
import ReactPlayer from 'react-player'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import { getBidLink, getContractName, removeTags, formatAddressShort, classNames } from '@/lib/utilities'
import ModalTokenDetail from './ModalTokenDetail'
import CappedWidth from './CappedWidth'
import { truncateWithEllipses } from '../lib/utilities'
import Button from './UI/Buttons/Button'
import axios from '@/lib/axios'
import { Menu, Transition } from '@headlessui/react'
import EllipsisIcon from './Icons/EllipsisIcon'
import BadgeIcon from './Icons/BadgeIcon'

const SpotlightItem = ({ isMyProfile, pageProfile, item, removeSpotlightItem }) => {
	const [moreShown, setMoreShown] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const [muted, setMuted] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [currentlyOpenModal, setCurrentlyOpenModal] = useState(false)
	const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState(true)
	const [videoReady, setVideoReady] = useState(false)
	const [thisItem, setThisItem] = useState(item)

	const divRef = useRef()
	const imgContainerRef = useRef()

	const max_description_length = 170
	const aspect_ratio_cutoff = 1.6

	const { isMobile } = useContext(AppContext)

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

	const pageProfileName = pageProfile?.name && pageProfile?.name != 'Unnamed' ? (pageProfile?.wallet_addresses_excluding_email_v2?.map(addr => addr.address)?.includes(pageProfile.name) ? formatAddressShort(pageProfile?.slug_address) : pageProfile?.name) : pageProfile?.username || pageProfile?.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || formatAddressShort(pageProfile?.wallet_addresses_excluding_email_v2?.[0]?.address) || 'Unknown'

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
								{thisItem.token_has_video || (!thisItem.token_img_url && thisItem.token_animation_url) ? (
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
												playsinline
												onReady={() => setVideoReady(true)}
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
												<div className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-white dark:bg-black bg-opacity-50 dark:bg-opacity-50">
													<div className="inline-block w-6 h-6 border-2 border-gray-100 dark:border-gray-300 border-t-gray-800 dark:border-t-gray-800 rounded-full animate-spin mb-2" />
													<p className="dark:text-gray-300">Refreshing...</p>
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
											ref={imgContainerRef}
										>
											{!imageLoaded ? (
												<div className="w-full text-center flex items-center justify-center" style={{ height: divRef?.current?.clientWidth ? divRef?.current?.clientWidth : 375 }}>
													<div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
												</div>
											) : null}

											<img
												className="hover:opacity-90 transition-all shadow-lg"
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
														: !(item.token_aspect_ratio && imgContainerRef?.current?.clientWidth) // use defaults if aspect ratio unknown
														? {
																backgroundColor: getBackgroundColor(item),
																maxHeight: 500,
														  }
														: imgContainerRef?.current?.clientWidth / item.token_aspect_ratio > 500 // going to be too tall, need to rescale
														? {
																backgroundColor: getBackgroundColor(item),
																maxHeight: 500,
																width: 500 / (1 / item.token_aspect_ratio),
																height: 500,
														  }
														: {
																backgroundColor: getBackgroundColor(item),
																maxHeight: 500,
																width: imgContainerRef?.current?.clientWidth,
																height: item.token_aspect_ratio && imgContainerRef?.current?.clientWidth ? imgContainerRef?.current?.clientWidth / item.token_aspect_ratio : null,
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
							<div>
								<div className="flex flex-row">
									<div
										onClick={() => {
											mixpanel.track('Open NFT modal')
											setCurrentlyOpenModal(true)
											setMuted(true)
											setCurrentlyPlayingVideo(false)
										}}
										className="dark:text-gray-200 mb-2 sm:mb-4 text-2xl sm:text-3xl font-medium hover:text-stpink cursor-pointer break-words"
									>
										{item.token_name}
									</div>
									<div className="flex-grow"></div>
								</div>

								{item.token_description ? (
									<div className="pb-8 text-sm sm:text-base text-gray-500 break-words">
										<div>
											{item.token_description?.length > max_description_length && !moreShown ? (
												<>
													{truncateWithEllipses(removeTags(item.token_description), max_description_length)}{' '}
													<a onClick={() => setMoreShown(true)} className="text-gray-900 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 cursor-pointer">
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

								<div className="border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-xl py-4 px-2 md:max-w-max">
									<div className="flex flex-wrap w-full px-2 gap-y-1 gap-x-5 md:gap-0">
										{item.contract_is_creator ? (
											<Link href="/c/[collection]" as={`/c/${item.collection_slug}`}>
												<a className="flex flex-row items-center space-x-2">
													<img alt={item.collection_name} src={item.collection_img_url ? item.collection_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
													<div>
														<span className="text-xs font-medium text-gray-600 dark:text-gray-500">Creator</span>
														<div className="text-sm font-semibold truncate -mt-0.5 dark:text-gray-200">{truncateWithEllipses(item.collection_name + ' Collection', 30)}</div>
													</div>
												</a>
											</Link>
										) : item.creator_address ? (
											<Link href="/[profile]" as={`/${item?.creator_username || item.creator_address}`}>
												<a className="flex flex-row items-center space-x-2">
													<img alt={item.creator_name} src={item.creator_img_url ? item.creator_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
													<div>
														<span className="text-xs font-medium text-gray-600 dark:text-gray-500">Creator {item.owner_id == item.creator_id && '& Owner'}</span>
														<div className="flex items-center space-x-1 -mt-0.5">
															<div className="text-sm font-semibold truncate dark:text-gray-200">{item.creator_name === item.creator_address ? formatAddressShort(item.creator_address) : truncateWithEllipses(item.creator_name, 22)}</div>
															{item.creator_verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" bgClass="text-white dark:text-black" />}
														</div>
													</div>
												</a>
											</Link>
										) : null}
										{item.owner_id != item.creator_id && (
											<>
												<div className="w-[2px] bg-gray-100 dark:bg-gray-800 my-2.5 mx-4 hidden md:block" />
												{item.owner_count && item.owner_count > 1 ? (
													<div>
														<span className="text-xs font-medium text-gray-600 dark:text-gray-500">Owner</span>
														<div className="flex items-center">
															<Link href="/[profile]" as={`/${pageProfile.slug_address}`}>
																<a className="flex flex-row items-center pr-2 ">
																	<img alt={pageProfileName} src={pageProfile.img_url || DEFAULT_PROFILE_PIC} className="rounded-full mr-2 h-6 w-6" />
																	<div>
																		<div className="text-sm font-semibold truncate dark:text-gray-200">{pageProfileName}</div>
																	</div>
																</a>
															</Link>
															<div className="text-gray-500 text-sm mr-2 -ml-1 mt-px">
																&amp; {item.owner_count - 1} other
																{item.owner_count - 1 > 1 ? 's' : null}
															</div>
														</div>
													</div>
												) : item.owner_id ? (
													<div className="flex flex-row items-center pt-1">
														<Link href="/[profile]" as={`/${item?.owner_username || item.owner_address}`}>
															<a className="flex flex-row items-center space-x-2">
																<img alt={item.owner_name} src={item.owner_img_url ? item.owner_img_url : DEFAULT_PROFILE_PIC} className="rounded-full mr-1 w-8 h-8" />
																<div>
																	<span className="text-xs font-medium text-gray-600 dark:text-gray-500">Owner</span>
																	<div className="flex items-center space-x-1 -mt-0.5">
																		<div className="text-sm font-semibold truncate dark:text-gray-200">{item.owner_name === item.owner_address ? formatAddressShort(item.owner_address) : truncateWithEllipses(item.owner_name, 22)}</div>
																		{item.owner_verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" bgClass="text-white dark:text-black" />}
																	</div>
																</div>
															</a>
														</Link>
														<div className="flex-grow">&nbsp;</div>
													</div>
												) : null}
											</>
										)}
									</div>
									<div className="h-px bg-gray-100 dark:bg-gray-800 mx-1 my-4" />
									<div className="flex items-center justify-between px-4 space-x-4">
										<div className="flex items-center space-x-4">
											<LikeButton item={item} />
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
										<div className="flex items-center space-x-4">
											<ShareButton url={window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + `/t/${item.contract_address}/${item.token_id}`} type={'item'} />
											{isMyProfile ? (
												<Menu as="div" className="relative -mb-2">
													<>
														<Menu.Button className="text-right text-gray-600 hover:text-stpink focus:outline-none focus-visible:ring-1 relative">
															<EllipsisIcon className="w-5 h-5" />
														</Menu.Button>
														<Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
															<Menu.Items className="z-1 absolute right-0 mt-2 origin-top-right border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
																<Menu.Item>
																	{({ active }) => (
																		<button onClick={removeSpotlightItem} className={classNames(active ? 'text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-400', 'cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left')}>
																			<span className="block truncate font-medium">Remove Spotlight</span>
																		</button>
																	)}
																</Menu.Item>
																<Menu.Item>
																	{({ active }) => (
																		<button onClick={handleRefreshNFTMetadata} className={classNames(active ? 'text-gray-900 dark:text-gray-300 bg-gray-100 dark:bg-gray-800' : 'text-gray-900 dark:text-gray-400', 'cursor-pointer select-none rounded-xl py-3 px-3 w-full text-left')}>
																			<span className="block truncate font-medium">Refresh Metadata</span>
																		</button>
																	)}
																</Menu.Item>
															</Menu.Items>
														</Transition>
													</>
												</Menu>
											) : null}
										</div>
									</div>
								</div>
								<div className="mt-8 inline-block">
									<Button style="primary" as="a" href={getBidLink(item)} title={`View on ${getContractName(item)}`} target="_blank" onClick={() => mixpanel.track('OpenSea link click')} rel="noreferrer">
										View on {getContractName(item)}
									</Button>
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
