import { useState, useEffect, useContext, useRef, Fragment } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import mixpanel from 'mixpanel-browser'
import Layout from '@/components/layout'
import CappedWidth from '@/components/CappedWidth'
import TokenGridV5 from '@/components/TokenGridV5'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import ModalEditProfile from '@/components/ModalEditProfile'
import ModalEditPhoto from '@/components/ModalEditPhoto'
import ModalEditCover from '@/components/ModalEditCover'
import ModalUserList from '@/components/ModalUserList'
import ModalAddWallet from '@/components/ModalAddWallet'
import ModalAddEmail from '@/components/ModalAddEmail.js'
import { formatAddressShort, truncateWithEllipses, classNames } from '@/lib/utilities'
import AddressButton from '@/components/AddressButton'
import { PROFILE_TABS, SORT_FIELDS, DEFAULT_PROFILE_PIC } from '@/lib/constants'
import SpotlightItem from '@/components/SpotlightItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faImage } from '@fortawesome/free-regular-svg-icons'
import ProfileFollowersPill from '@/components/ProfileFollowersPill'
import { Listbox, Transition, Menu } from '@headlessui/react'
import { CheckIcon, SelectorIcon, ChevronDownIcon, PencilAltIcon } from '@heroicons/react/solid'
import { faHeart as fasHeart, faFingerprint, faImage as fasImage, faEdit } from '@fortawesome/free-solid-svg-icons'
import axios from '@/lib/axios'

export async function getServerSideProps(context) {
	const { res, query } = context

	const slug_address = query.profile

	if (slug_address.includes('apple-touch-icon')) {
		res.writeHead(404)
		res.end()
		return { props: {} }
	}

	// Get profile metadata
	let response_profile
	try {
		response_profile = await backend.get(`/v2/profile_server/${slug_address}`)
		const { profile, followers: followers_list, followers_count, following: following_list, following_count, featured_nft, lists } = response_profile.data.data

		return {
			props: {
				profile,
				slug_address,
				followers_list,
				followers_count,
				following_list,
				following_count,
				featured_nft,
				lists,
			},
		}
	} catch (err) {
		if (err.response.status == 400) {
			// Redirect to homepage
			res.writeHead(302, { location: '/' })
			res.end()
			return { props: {} }
		} else {
			res.writeHead(404)
			res.end()
			return { props: {} }
		}
	}
}

const Profile = ({ profile, slug_address, followers_list, followers_count, following_list, following_count, featured_nft, lists }) => {
	const { name, img_url, cover_url, wallet_addresses, wallet_addresses_excluding_email, bio, website_url, profile_id, username, featured_nft_img_url, links } = profile

	const context = useContext(AppContext)

	const router = useRouter()

	// Profile details
	const [isMyProfile, setIsMyProfile] = useState()
	const [hasEmailAddress, setHasEmailAddress] = useState(false)
	const initialBioLength = context.isMobile ? 130 : 150
	const [moreBioShown, setMoreBioShown] = useState(false)
	const [followersCount, setFollowersCount] = useState(followers_count)
	const profileToDisplay = isMyProfile
		? context.myProfile
		: {
				name,
				website_url,
				bio,
				img_url,
				cover_url,
				username,
				links: links.map(link => ({
					name: link.type__name,
					prefix: link.type__prefix,
					icon_url: link.type__icon_url,
					type_id: link.type_id,
					user_input: link.user_input,
				})),
				wallet_addresses_excluding_email,
		  }
	useEffect(() => {
		// Wait for identity to resolve before recording the view
		if (typeof context.user !== 'undefined') {
			if (context.user) {
				// Logged in?
				if (context.myProfile?.wallet_addresses.map(a => a.toLowerCase()).includes(slug_address.toLowerCase()) || slug_address.toLowerCase() === context.myProfile?.username?.toLowerCase()) {
					setIsMyProfile(true)
					if (wallet_addresses.length === wallet_addresses_excluding_email.length) {
						setHasEmailAddress(false)
					} else {
						setHasEmailAddress(true)
					}
					mixpanel.track('Self profile view', { slug: slug_address })
				} else {
					setIsMyProfile(false)
					mixpanel.track('Profile view', { slug: slug_address })
				}
			} else {
				// Logged out
				setIsMyProfile(false)
				mixpanel.track('Profile view', { slug: slug_address })
			}
		}
	}, [profile_id, typeof context.user, context.myProfile, context.user ? context.user.publicAddress : null, slug_address])

	// Followers
	const [followers, setFollowers] = useState([])
	useEffect(() => {
		setFollowers(followers_list)
	}, [followers_list])

	const [following, setFollowing] = useState([])
	useEffect(() => {
		setFollowing(following_list)
	}, [following_list])

	// Followed?
	const [isFollowed, setIsFollowed] = useState(false)
	useEffect(() => {
		if (context.myFollows) {
			setIsFollowed(context.myFollows.map(p => p.profile_id).includes(profile_id))
		}
	}, [context.myFollows, profile_id])

	// Follow back?
	const [followingMe, setFollowingMe] = useState(false)
	useEffect(() => {
		if (following_list.map(item => item.profile_id).includes(context.myProfile?.profile_id)) {
			setFollowingMe(true)
		} else {
			setFollowingMe(false)
		}
	}, [following_list, context.myProfile?.profile_id])

	// Spotlight
	const [spotlightItem, setSpotlightItem] = useState()
	const handleChangeSpotlightItem = async nft => {
		const nftId = nft ? nft.nft_id : null
		setSpotlightItem(nft)

		// Post changes to the API
		await axios.post('/api/updatespotlight', { nft_id: nftId })
	}

	// NFT grid
	// Left menu
	const [menuLists, setMenuLists] = useState(lists.lists)

	// Grid
	const gridRef = useRef()
	const [selectedGrid, setSelectedGrid] = useState(1)
	const sortingOptionsList = [
		//{ label: "Select...", key: "" },
		...Object.keys(SORT_FIELDS).map(key => SORT_FIELDS[key]),
	]
	const perPage = context.isMobile ? 4 : 12 // switch to 12 after testing;

	const [items, setItems] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [page, setPage] = useState(1)
	const [switchInProgress, setSwitchInProgress] = useState(false)
	const [showUserHiddenItems, setShowUserHiddenItems] = useState(false)
	const [showDuplicates, setShowDuplicates] = useState(false)
	const [hasUserHiddenItems, setHasUserHiddenItems] = useState(false)

	//const [collections, setCollections] = useState([]);
	const [collectionId, setCollectionId] = useState(0)
	const [isLoadingCards, setIsLoadingCards] = useState(false)
	const [isRefreshingCards, setIsRefreshingCards] = useState(false)
	const [selectedCreatedSortField, setSelectedCreatedSortField] = useState(lists.lists[0].sort_id || 1)
	const [selectedOwnedSortField, setSelectedOwnedSortField] = useState(lists.lists[1].sort_id || 1)
	const [selectedLikedSortField, setSelectedLikedSortField] = useState(2)

	const updateItems = async (listId, sortId, collectionId, showCardRefresh, page, showHidden, showDuplicates) => {
		if (showCardRefresh) {
			setIsRefreshingCards(true)
		}

		// Created
		const { data } = await axios
			.post('/api/getprofilenfts', {
				profileId: profile_id,
				page: page,
				limit: perPage,
				listId: listId,
				sortId: sortId,
				showHidden: showHidden ? 1 : 0,
				showDuplicates: showDuplicates ? 1 : 0,
				collectionId: collectionId,
			})
			.then(res => res.data)
		setItems(data.items)
		setHasMore(data.has_more)

		if (showCardRefresh) {
			setIsRefreshingCards(false)
		}
	}

	const addPage = async nextPage => {
		setIsLoadingMore(true)
		const sortId = selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField

		const { data } = await axios
			.post('/api/getprofilenfts', {
				profileId: profile_id,
				page: nextPage,
				limit: perPage,
				listId: selectedGrid,
				sortId: sortId,
				showHidden: showUserHiddenItems ? 1 : 0,
				showDuplicates: showDuplicates ? 1 : 0,
				collectionId: collectionId,
			})
			.then(res => res.data)

		if (!switchInProgress) {
			setItems([...items, ...data.items])
			setHasMore(data.has_more)
			setPage(nextPage)
		}

		setIsLoadingMore(false)
	}

	const handleSortChange = async sortId => {
		setSwitchInProgress(true)
		const setSelectedSortField = selectedGrid === 1 ? setSelectedCreatedSortField : selectedGrid === 2 ? setSelectedOwnedSortField : setSelectedLikedSortField
		setPage(1)
		setSelectedSortField(sortId)
		await updateItems(selectedGrid, sortId, collectionId, true, 1, showUserHiddenItems, showDuplicates)
		setSwitchInProgress(false)
	}

	const handleListChange = async listId => {
		setSwitchInProgress(true)
		setSelectedGrid(listId)
		setCollectionId(0)
		setPage(1)
		setShowDuplicates(false)

		const sortId = listId === 1 ? selectedCreatedSortField : listId === 2 ? selectedOwnedSortField : selectedLikedSortField
		router.replace(
			{
				pathname: '/[profile]',
				query: { ...router.query, list: PROFILE_TABS[listId] },
			},
			undefined,
			{ shallow: true }
		)
		await updateItems(listId, sortId, 0, true, 1, showUserHiddenItems, 0)
		setSwitchInProgress(false)
	}

	const handleCollectionChange = async collectionId => {
		setSwitchInProgress(true)
		setCollectionId(collectionId)
		setPage(1)

		const sortId = selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField
		await updateItems(selectedGrid, sortId, collectionId, true, 1, showUserHiddenItems, showDuplicates)
		setSwitchInProgress(false)
	}

	const handleShowHiddenChange = async showUserHiddenItems => {
		setShowUserHiddenItems(showUserHiddenItems)
		setSwitchInProgress(true)
		if (gridRef?.current?.getBoundingClientRect().top < 0) {
			window.scroll({
				top: gridRef?.current?.offsetTop + 30,
				behavior: 'smooth',
			})
		}
		setPage(1)

		const sortId = selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField
		await updateItems(selectedGrid, sortId, collectionId, true, 1, showUserHiddenItems, showDuplicates)
		setSwitchInProgress(false)
	}

	const handleShowDuplicates = async showDuplicates => {
		setShowDuplicates(showDuplicates)
		setSwitchInProgress(true)
		if (gridRef?.current?.getBoundingClientRect().top < 0) {
			window.scroll({
				top: gridRef?.current?.offsetTop + 30,
				behavior: 'smooth',
			})
		}
		setPage(1)

		const sortId = selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField
		await updateItems(selectedGrid, sortId, collectionId, true, 1, showUserHiddenItems, showDuplicates)
		setSwitchInProgress(false)
	}

	// Fetch the created/owned/liked items
	const fetchItems = async (initial_load, lists) => {
		// clear out existing from page (if switching profiles)
		if (initial_load) {
			//setSwitchInProgress(true);
			setMoreBioShown(false)
			setIsLoadingCards(true)
			setShowUserHiddenItems(false)

			setSpotlightItem(featured_nft)

			setSelectedCreatedSortField(lists.lists[0].sort_id || 1)
			setSelectedOwnedSortField(lists.lists[1].sort_id || 1)
			setSelectedLikedSortField(2)

			setHasUserHiddenItems(lists.lists[0].count_all_withhidden > lists.lists[0].count_all_nonhidden || lists.lists[1].count_all_withhidden > lists.lists[1].count_all_nonhidden)

			setShowDuplicates(false)
			setCollectionId(0)
			setPage(1)
			setMenuLists([])
			setHasMore(true)
			setItems([])
			//setCollections([]);
			//setSwitchInProgress(false);
			setFollowersCount(followers_count)
		}

		// Populate initial state

		const initial_list_id = router?.query?.list ? PROFILE_TABS.indexOf(router.query.list) : lists.default_list_id

		if (initial_list_id == 1) {
			setSwitchInProgress(true)
			// Created
			const { data } = await axios
				.post('/api/getprofilenfts', {
					profileId: profile_id,
					page: 1,
					limit: perPage,
					listId: 1,
					sortId: lists.lists[0].sort_id,
					showHidden: 0,
					showDuplicates: 0,
					collectionId: 0,
				})
				.then(res => res.data)
			setItems(data.items)
			setHasMore(data.has_more)
			setSwitchInProgress(false)
		} else if (initial_list_id == 2) {
			setSwitchInProgress(true)
			// Owned
			const { data } = await axios
				.post('/api/getprofilenfts', {
					profileId: profile_id,
					page: 1,
					limit: perPage,
					listId: 2,
					sortId: lists.lists[1].sort_id,
					showHidden: 0,
					showDuplicates: 0,
					collectionId: 0,
				})
				.then(res => res.data)
			setItems(data.items)
			setHasMore(data.has_more)
			setSwitchInProgress(false)
		} else if (initial_list_id == 3) {
			setSwitchInProgress(true)
			// Liked
			const { data } = await axios
				.post('/api/getprofilenfts', {
					profileId: profile_id,
					page: 1,
					limit: perPage,
					listId: 3,
					sortId: lists.lists[2].sort_id,
					showHidden: 0,
					showDuplicates: 0,
					collectionId: 0,
				})
				.then(res => res.data)
			setItems(data.items)
			setHasMore(data.has_more)
			setSwitchInProgress(false)
		}

		if (initial_load) {
			setIsLoadingCards(false)
		}
	}

	useEffect(() => {
		fetchItems(true, lists)
	}, [profile_id, lists])

	const handleLoggedOutFollow = () => {
		mixpanel.track('Follow but logged out')
		context.setLoginModalOpen(true)
	}

	const handleFollow = async () => {
		setIsFollowed(true)
		setFollowersCount(followersCount + 1)
		// Change myFollows via setMyFollows
		context.setMyFollows([
			{
				profile_id: profile_id,
				wallet_address: wallet_addresses[0],
				name: name,
				img_url: img_url ? img_url : DEFAULT_PROFILE_PIC,
				timestamp: null,
				username: username,
			},
			...context.myFollows,
		])

		setFollowers([
			{
				profile_id: context.myProfile.profile_id,
				wallet_address: context.user.publicAddress,
				name: context.myProfile.name,
				img_url: context.myProfile.img_url ? context.myProfile.img_url : DEFAULT_PROFILE_PIC,
				timestamp: null,
				username: context.myProfile.username,
			},
			...followers,
		])

		// Post changes to the API
		await axios.post(`/api/follow_v2/${profile_id}`)

		mixpanel.track('Followed profile')
	}

	const handleUnfollow = async () => {
		setIsFollowed(false)
		setFollowersCount(followersCount - 1)
		// Change myLikes via setMyLikes
		context.setMyFollows(context.myFollows.filter(item => item.profile_id != profile_id))

		setFollowers(
			followers.filter(follower => {
				return context.myProfile.profile_id != follower.profile_id
			})
		)

		// Post changes to the API
		await axios.post(`/api/unfollow_v2/${profile_id}`)

		mixpanel.track('Unfollowed profile')
	}

	// Modal states
	const [editModalOpen, setEditModalOpen] = useState(false)
	const [walletModalOpen, setWalletModalOpen] = useState(false)
	const [emailModalOpen, setEmailModalOpen] = useState(false)
	const [pictureModalOpen, setPictureModalOpen] = useState(false)
	const [coverModalOpen, setCoverModalOpen] = useState(false)
	const [showFollowers, setShowFollowers] = useState(false)
	const [showFollowing, setShowFollowing] = useState(false)
	const [openCardMenu, setOpenCardMenu] = useState(null)

	useEffect(() => {
		// console.log("setting default list Id to:", lists.default_list_id);
		// console.log("current value in url:", router.query);

		setSelectedGrid(router?.query?.list ? PROFILE_TABS.indexOf(router.query.list) : lists.default_list_id)

		setMenuLists(lists.lists)

		setShowFollowers(false)
		setShowFollowing(false)
	}, [profile_id, lists.default_list_id, isLoadingCards])

	// profilePill Edit profile actions
	const editAccount = () => {
		setEditModalOpen(true)
		mixpanel.track('Open edit name')
	}

	const editPhoto = () => {
		setPictureModalOpen(true)
		mixpanel.track('Open edit photo')
	}

	const addWallet = () => {
		setWalletModalOpen(true)
		mixpanel.track('Open add wallet')
	}

	const addEmail = () => {
		setEmailModalOpen(true)
		mixpanel.track('Open add email')
	}

	const logout = async () => {
		await context.logOut()
		setIsMyProfile(false)
	}

	const [isChangingOrder, setIsChangingOrder] = useState(false)
	const [revertItems, setRevertItems] = useState(null)
	const [revertSort, setRevertSort] = useState(null)
	const [newOrder, setNewOrder] = useState(null)

	const handleClickChangeOrder = async () => {
		if (menuLists[selectedGrid - 1].has_custom_sort) {
			await handleSortChange(5)
		} else {
			const setSelectedSortField = selectedGrid === 1 ? setSelectedCreatedSortField : selectedGrid === 2 ? setSelectedOwnedSortField : setSelectedLikedSortField
			await setSelectedSortField(5)
		}
		setRevertItems(items)
		setRevertSort(selectedGrid === 1 ? selectedCreatedSortField : selectedOwnedSortField)
		setNewOrder(items)
		setIsChangingOrder(true)
	}

	const handleClickDeleteCustomOrder = async () => {
		const listIdToClearOrder = selectedGrid
		await handleSortChange(1)
		setIsChangingOrder(false)
		setRevertItems(null)
		setNewOrder(null)
		const newMenuLists = menuLists.map((list, index) => (index === listIdToClearOrder - 1 ? { ...list, has_custom_sort: false } : list))
		setMenuLists(newMenuLists)
		context.setMyProfile({
			...context.myProfile,
			...(listIdToClearOrder === 1 && { default_created_sort_id: null }),
			...(listIdToClearOrder === 2 && { default_owned_sort_id: null }),
		})
		await fetch('/api/updatelistorder', {
			method: 'post',
			body: JSON.stringify({
				new_order: null,
				list_id: listIdToClearOrder,
			}),
		})
	}

	const handleSaveOrder = async () => {
		const saveOrderPayload = newOrder.map((o, i) => ({ index: i, nft_id: o.nft_id }))
		setItems(newOrder)
		setIsChangingOrder(false)
		setRevertItems(null)
		setNewOrder(null)
		const newMenuLists = menuLists.map((list, index) => (index === selectedGrid - 1 ? { ...list, has_custom_sort: true } : list))
		setMenuLists(newMenuLists)
		context.setMyProfile({
			...context.myProfile,
			...(selectedGrid === 1 && { default_created_sort_id: 5 }),
			...(selectedGrid === 2 && { default_owned_sort_id: 5 }),
		})
		await fetch('/api/updatelistorder', {
			method: 'post',
			body: JSON.stringify({
				new_order: saveOrderPayload,
				list_id: selectedGrid,
			}),
		})
	}

	const handleCancelOrder = () => {
		const oldItems = revertItems
		const oldSort = revertSort
		if (selectedGrid === 1) {
			setSelectedCreatedSortField(oldSort)
		} else {
			setSelectedOwnedSortField(oldSort)
		}
		setItems(oldItems)
		setRevertItems(null)
		setIsChangingOrder(false)
	}

	const handleReorder = items => {
		setNewOrder(items)
	}

	// reset reordering if page changes
	useEffect(() => {
		setIsChangingOrder(false)
		setNewOrder(null)
		setRevertItems(null)
		setRevertSort(null)
	}, [selectedGrid, collectionId, profile_id, selectedCreatedSortField, selectedOwnedSortField, showUserHiddenItems])

	return (
		<div
			onClick={() => {
				setOpenCardMenu(null)
			}}
		>
			{typeof document !== 'undefined' ? (
				<>
					<ModalAddWallet isOpen={walletModalOpen} setWalletModalOpen={setWalletModalOpen} walletAddresses={wallet_addresses} />
					<ModalAddEmail isOpen={emailModalOpen} setEmailModalOpen={setEmailModalOpen} walletAddresses={wallet_addresses} setHasEmailAddress={setHasEmailAddress} />
					{editModalOpen && <ModalEditProfile isOpen={editModalOpen} setEditModalOpen={setEditModalOpen} />}
					<ModalEditPhoto isOpen={pictureModalOpen} setEditModalOpen={setPictureModalOpen} />
					<ModalEditCover isOpen={coverModalOpen} setEditModalOpen={setCoverModalOpen} />
					{/* Followers modal */}
					<ModalUserList
						title="Followers"
						isOpen={showFollowers}
						users={followers ? followers : []}
						closeModal={() => {
							setShowFollowers(false)
						}}
						emptyMessage="No followers yet."
					/>
					{/* Following modal */}
					<ModalUserList
						title="Following"
						isOpen={showFollowing}
						users={following ? following : []}
						closeModal={() => {
							setShowFollowing(false)
						}}
						emptyMessage="Not following anyone yet."
					/>
				</>
			) : null}
			<Layout>
				<Head>
					<title>{profileToDisplay?.name ? profileToDisplay.name : 'Unnamed'}</title>

					<meta name="description" content="Explore crypto art I've created, owned, and liked" />
					<meta property="og:type" content="website" />
					<meta name="og:description" content="Explore crypto art I've created, owned, and liked" />
					<meta property="og:image" content={featured_nft_img_url ? featured_nft_img_url : img_url ? img_url : DEFAULT_PROFILE_PIC} />
					<meta name="og:title" content={name ? name : wallet_addresses[0]} />

					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:title" content={name ? name : wallet_addresses[0]} />
					<meta name="twitter:description" content="Explore crypto art I've created, owned, and liked" />
					<meta name="twitter:image" content={featured_nft_img_url ? featured_nft_img_url : img_url ? img_url : DEFAULT_PROFILE_PIC} />
				</Head>

				<div
					className="h-32 md:h-64 relative text-left bg-gradient-to-b from-black to-gray-800"
					style={
						profileToDisplay?.cover_url
							? {
									backgroundImage: `url(${profileToDisplay.cover_url})`,
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center center',
									backgroundSize: 'cover',
							  }
							: {}
					}
				>
					{isMyProfile && (
						<CappedWidth>
							<div className="relative">
								<div
									className="absolute top-6 right-5  2xl:right-5 text-gray-200 text-sm cursor-pointer bg-gray-800 bg-opacity-70 py-1 px-3 rounded-full hover:bg-opacity-90"
									onClick={() => {
										if (isMyProfile) {
											setCoverModalOpen(true)
											mixpanel.track('Open edit cover photo')
										}
									}}
								>
									<FontAwesomeIcon icon={faEdit} /> Cover
								</div>
							</div>
						</CappedWidth>
					)}
				</div>

				<CappedWidth>
					<div className="flex flex-col md:flex-row mx-5">
						<div className="flex flex-col text-left">
							<div className="z-10 pb-2 flex flex-row">
								<img
									onClick={() => {
										if (isMyProfile) {
											setPictureModalOpen(true)
											mixpanel.track('Open edit photo')
										}
									}}
									src={profileToDisplay?.img_url ? profileToDisplay.img_url : DEFAULT_PROFILE_PIC}
									className={`h-24 w-24 md:h-32 md:w-32 rounded-full border-2 shadow-md border-white z-10 -mt-14 md:-mt-20 overflow-hidden ${isMyProfile ? 'cursor-pointer ' : ''}`}
								/>
								<div className="flex-grow"></div>
								<div className="md:hidden z-10 -mt-5">
									<ProfileFollowersPill following={following} followers={followers} isFollowed={isFollowed} isMyProfile={isMyProfile} followingMe={followingMe} handleUnfollow={handleUnfollow} handleFollow={handleFollow} handleLoggedOutFollow={handleLoggedOutFollow} hasEmailAddress={hasEmailAddress} setShowFollowers={setShowFollowers} setShowFollowing={setShowFollowing} editAccount={editAccount} editPhoto={editPhoto} addWallet={addWallet} addEmail={addEmail} logout={logout} />
								</div>
							</div>
							<div className="text-3xl md:text-4xl md:mb-1"> {profileToDisplay?.name ? profileToDisplay.name : wallet_addresses_excluding_email && wallet_addresses_excluding_email.length > 0 ? formatAddressShort(wallet_addresses_excluding_email[0]) : 'Unnamed'}</div>
							<div>
								{(username || wallet_addresses_excluding_email.length > 0) && (
									<div className="flex flex-row items-center justify-start">
										{username && <div className="md:mr-2 text-sm md:text-base text-gray-500">@{username}</div>}

										<div className="flex ml-1">
											{wallet_addresses_excluding_email.map(address => {
												return <AddressButton key={address} address={address} />
											})}
										</div>
									</div>
								)}
							</div>
							<div>
								{profileToDisplay?.bio ? (
									<div className="text-black text-sm max-w-prose text-left md:text-base mt-6 block break-words">
										{moreBioShown ? profileToDisplay.bio : truncateWithEllipses(profileToDisplay.bio, initialBioLength)}
										{!moreBioShown && profileToDisplay?.bio && profileToDisplay.bio.length > initialBioLength && (
											<a onClick={() => setMoreBioShown(true)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
												{' '}
												more
											</a>
										)}
									</div>
								) : null}
							</div>
						</div>
						<div className="flex-grow"></div>
						<div className="flex  flex-col">
							<div className="flex items-center mt-6 md:-mt-7 md:z-10  md:justify-end justify-start md:mx-0 ">
								<div className="flex flex-row  md:bg-white md:shadow-md md:rounded-full md:px-2 md:py-2 items-center">
									<div className="flex-grow ">
										<div className="flex flex-row ">
											<div
												className="flex-1 flex flex-row items-center cursor-pointer hover:opacity-80 md:ml-4"
												onClick={() => {
													setShowFollowing(true)
												}}
											>
												<div className="text-sm mr-2">{following && following.length !== null ? Number(isMyProfile ? context.myFollows.length : following_count).toLocaleString() : null}</div>
												<div className="text-sm text-gray-500 mr-5">Following</div>
											</div>
											<div
												className="flex-1 flex flex-row items-center cursor-pointer hover:opacity-80 "
												onClick={() => {
													setShowFollowers(true)
												}}
											>
												<div className="text-sm  mr-2">{followers && followers.length !== null ? Number(followersCount).toLocaleString() : null}</div>
												<div className="text-sm text-gray-500 mr-5">Followers</div>
											</div>
										</div>
									</div>
									<div className="hidden md:flex">
										<ProfileFollowersPill following={following} followers={followers} isFollowed={isFollowed} isMyProfile={isMyProfile} followingMe={followingMe} handleUnfollow={handleUnfollow} handleFollow={handleFollow} handleLoggedOutFollow={handleLoggedOutFollow} hasEmailAddress={hasEmailAddress} setShowFollowers={setShowFollowers} setShowFollowing={setShowFollowing} editAccount={editAccount} editPhoto={editPhoto} addWallet={addWallet} addEmail={addEmail} logout={logout} />
									</div>
								</div>
							</div>

							<div className=" md:text-right text-sm md:mr-2 pt-5 md:pt-7">
								{profileToDisplay?.website_url ? (
									<a
										href={profileToDisplay.website_url.slice(0, 4) === 'http' ? profileToDisplay.website_url : 'https://' + profileToDisplay.website_url}
										target="_blank"
										onClick={() => {
											mixpanel.track('Clicked profile website link', {
												slug: slug_address,
											})
										}}
										className="inline-block "
										rel="noreferrer"
									>
										<div className="flex text-gray-500 flex-row  items-center hover:opacity-80 mr-3 md:mr-0">
											<img src="/icons/link-solid-01.png" alt="" className="flex-shrink-0 h-5 w-5 mr-1 opacity-70" />
											<div>
												<div className="break-all">{profileToDisplay.website_url}</div>
											</div>
										</div>
									</a>
								) : null}
								{/* map out social links */}
								{profileToDisplay?.links &&
									profileToDisplay.links.map(socialLink => (
										<a
											href={`https://${socialLink.prefix}` + socialLink.user_input}
											target="_blank"
											onClick={() => {
												mixpanel.track(`Clicked ${socialLink.name} profile link`, {
													slug: slug_address,
												})
											}}
											className="mr-4 md:mr-0 md:ml-5 inline-block "
											key={socialLink.type_id}
											rel="noreferrer"
										>
											<div className="text-gray-500 flex flex-row items-center hover:opacity-80">
												{socialLink.icon_url && <img src={socialLink.icon_url} alt="" className="flex-shrink-0 h-5 w-5 mr-1 opacity-70" />}
												<div>
													<div className="break-all">{socialLink.name}</div>
												</div>
											</div>
										</a>
									))}
							</div>
							<div className="flex-grow "></div>
						</div>
					</div>
				</CappedWidth>

				{spotlightItem ? (
					<div className="mt-12 sm:mt-8 md:mt-12">
						<div className="relative bg-white border-t border-b border-gray-200 sm:py-16 sm:pb-8 md:pb-16 mb-4">
							<SpotlightItem
								item={spotlightItem}
								removeSpotlightItem={() => {
									handleChangeSpotlightItem(null)
									mixpanel.track('Removed Spotlight Item')
								}}
								isMyProfile={isMyProfile}
								openCardMenu={openCardMenu}
								setOpenCardMenu={setOpenCardMenu}
								listId={0}
								// refreshItems={() => {
								// 	updateCreated(selectedCreatedSortField, false)
								// 	updateOwned(selectedOwnedSortField, false)
								// }}
								key={spotlightItem.nft_id}
								pageProfile={{
									profile_id,
									slug_address,
									name,
									img_url,
									wallet_addresses_excluding_email,
									website_url,
									username,
								}}
							/>
						</div>
					</div>
				) : null}
				<CappedWidth>
					<div className="m-auto">
						<div ref={gridRef} className="grid lg:grid-cols-3 xl:grid-cols-4 pt-0 ">
							<div className="sm:px-3">
								<div className="h-max sticky top-24  ">
									<div className="px-2 sm:px-4 py-2 sm:py-4 sm:rounded-lg bg-white border-t border-b sm:border-none border-gray-200  sm:shadow-md mt-14">
										<div className="border-b border-gray-200 sm:mx-2 mb-2 pb-4  ">
											<div className="flex flex-row items-center mt-2 ml-2 sm:mt-0 sm:ml-0">
												<div className="mr-2">
													<img src={profileToDisplay && profileToDisplay.img_url ? profileToDisplay.img_url : DEFAULT_PROFILE_PIC} className="w-5 h-5 rounded-full" />
												</div>
												<div>{profileToDisplay?.name ? profileToDisplay.name : wallet_addresses_excluding_email && wallet_addresses_excluding_email.length > 0 ? formatAddressShort(wallet_addresses_excluding_email[0]) : 'Unnamed'}</div>
												<div className="flex-grow"></div>
												{isMyProfile && hasUserHiddenItems ? (
													<div className="flex sm:hidden">
														<div className="flex-grow flex"></div>
														<div
															className=" text-xs mr-2 text-gray-400 cursor-pointer hover:text-gray-700"
															onClick={() => {
																//setShowUserHiddenItems(!showUserHiddenItems);
																handleShowHiddenChange(!showUserHiddenItems)
															}}
														>
															{
																//createdHiddenItems.length === 0 &&
																//ownedHiddenItems.length === 0 &&
																//likedHiddenItems.length === 0
																//? null
																//:

																showUserHiddenItems ? 'Hide hidden' : 'Show hidden'
															}
														</div>
													</div>
												) : null}
											</div>
										</div>
										<div className="flex flex-row sm:flex-col">
											<div
												onClick={() => {
													//setSelectedGrid(1);
													handleListChange(1)
													if (gridRef?.current?.getBoundingClientRect().top < 0) {
														window.scroll({
															top: gridRef?.current?.offsetTop + 30,
															behavior: 'smooth',
														})
													}
												}}
												className={`flex-1 hover:bg-stpurple100 p-2 sm:mb-1 ml-1 sm:ml-0 rounded-lg px-3  ${selectedGrid === 1 ? 'text-stpurple700 bg-stpurple100' : 'text-gray-500'} hover:text-stpurple700 cursor-pointer flex flex-row transition-all items-center`}
											>
												<div className="w-6 hidden sm:block">
													<FontAwesomeIcon icon={faFingerprint} className="mr-2" />
												</div>
												<div className="flex-grow sm:hidden"></div>
												<div className="sm:hidden mr-1">{menuLists && menuLists.length > 0 ? Number(menuLists[0].count_deduplicated_nonhidden).toLocaleString() : null}</div>
												<div>Created</div>
												<div className="flex-grow"></div>
												<div className="rounded-full text-center text-sm hidden sm:block">
													{menuLists && menuLists.length > 0 ? Number(menuLists[0].count_deduplicated_nonhidden).toLocaleString() : null}
													<span className="invisible">+</span>
												</div>
											</div>
											<div
												onClick={() => {
													//setSelectedGrid(2);
													handleListChange(2)
													if (gridRef?.current?.getBoundingClientRect().top < 0) {
														window.scroll({
															top: gridRef?.current?.offsetTop + 30,
															behavior: 'smooth',
														})
													}
												}}
												className={`flex-1 hover:bg-stteal100 sm:mb-1 p-2  rounded-lg px-3 ${selectedGrid === 2 ? 'text-stteal700 bg-stteal100' : 'text-gray-500'} hover:text-stteal700 cursor-pointer flex flex-row transition-all items-center`}
											>
												<div className="w-6 hidden sm:block">
													<FontAwesomeIcon icon={selectedGrid === 2 ? fasImage : faImage} className="mr-2" />
												</div>
												<div className="flex-grow sm:hidden"></div>
												<div className="sm:hidden mr-1">{menuLists && menuLists.length > 0 ? Number(menuLists[1].count_deduplicated_nonhidden).toLocaleString() : null}</div>
												<div>Owned</div>
												<div className="flex-grow"></div>
												<div className="rounded-full text-center text-sm hidden sm:block">
													{menuLists && menuLists.length > 0 ? Number(menuLists[1].count_deduplicated_nonhidden).toLocaleString() : null}
													<span className="invisible">+</span>
												</div>
											</div>
											<div
												onClick={() => {
													handleListChange(3)
													if (gridRef?.current?.getBoundingClientRect().top < 0) {
														window.scroll({
															top: gridRef?.current?.offsetTop + 30,
															behavior: 'smooth',
														})
													}
												}}
												className={`flex-1 hover:bg-stred100 p-2 sm:mt-0 mr-1 sm:mr-0 rounded-lg px-3 ${selectedGrid === 3 ? 'text-stred bg-stred100' : 'text-gray-500'} hover:text-stred cursor-pointer flex flex-row transition-all items-center`}
											>
												<div className="w-6 hidden sm:block">
													<FontAwesomeIcon icon={selectedGrid === 3 ? fasHeart : faHeart} className="mr-2" />
												</div>
												<div className="flex-grow sm:hidden"></div>
												<div className="sm:hidden mr-1">
													{menuLists && menuLists.length > 0 ? (menuLists[2].count_deduplicated_nonhidden > 300 ? 300 : menuLists[2].count_deduplicated_nonhidden) : null}
													{menuLists && menuLists.length > 0 && menuLists[2].count_deduplicated_nonhidden > 300 ? '+' : ''}
												</div>
												<div>Liked</div>
												<div className="flex-grow"></div>
												<div className="rounded-full text-center text-sm hidden sm:block">
													{menuLists && menuLists.length > 0 ? (menuLists[2].count_deduplicated_nonhidden > 300 ? 300 : menuLists[2].count_deduplicated_nonhidden) : null}
													<span className={menuLists && menuLists.length > 0 && menuLists[2].count_deduplicated_nonhidden > 300 ? 'visible' : 'invisible'}>+</span>
												</div>
											</div>
										</div>
									</div>
									<div>
										{isMyProfile && hasUserHiddenItems ? (
											<div className="flex hidden sm:flex">
												<div className="flex-grow flex"></div>
												<div
													className=" text-xs mt-3 ml-6 mr-1 text-gray-400 cursor-pointer hover:text-gray-700"
													onClick={() => {
														//setShowUserHiddenItems(!showUserHiddenItems);
														handleShowHiddenChange(!showUserHiddenItems)
													}}
												>
													{
														//createdHiddenItems.length === 0 &&
														//ownedHiddenItems.length === 0 &&
														//likedHiddenItems.length === 0
														//  ? null
														//  :

														showUserHiddenItems ? 'Hide hidden' : 'Show hidden'
													}
												</div>
											</div>
										) : null}
									</div>
								</div>
							</div>
							<div className="lg:col-span-2 xl:col-span-3 min-h-screen ">
								{!isLoadingCards && (
									<div
										className={`sm:mt-0 flex h-12 items-center px-3 my-2  md:text-base ${
											null

											/*selectedGrid === 3
                        ? "invisible"
                        : selectedGrid === 1 &&
                          createdItems.filter(
                            //(item) => !createdHiddenItems.includes(item.nft_id)
                            true
                          ).length === 0
                        ? "invisible"
                        : selectedGrid === 2 &&
                          ownedItems.filter(
                            //(item) => !ownedHiddenItems.includes(item.nft_id)
                            true
                          ).length === 0
                        ? "invisible"
                        : null
                            */
										}`}
									>
										{(selectedGrid === 1 || selectedGrid === 2) && isMyProfile && !context.isMobile && !isLoadingCards && !isRefreshingCards && collectionId == 0 && (
											<>
												{isChangingOrder && ((selectedGrid === 1 && selectedCreatedSortField === 5) || (selectedGrid === 2 && selectedOwnedSortField === 5)) && (
													<>
														<div className="cursor-pointer mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none" onClick={handleCancelOrder}>
															Cancel
														</div>
														<div className="cursor-pointer mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none" onClick={handleSaveOrder}>
															Save Order
														</div>
													</>
												)}
											</>
										)}
										<div className="flex-1 hidden sm:flex"></div>
										<Listbox
											value={collectionId}
											onChange={value => {
												handleCollectionChange(value)
											}}
										>
											{({ open }) => (
												<>
													<div
														className="relative mr-2"
														style={
															context.isMobile
																? {
																		width: '100%',
																  }
																: {
																		width: 218,
																  }
														}
													>
														<Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
															<span className="flex items-center">
																<>
																	{collectionId && collectionId > 0 ? <img src={menuLists && menuLists[selectedGrid - 1].collections.filter(t => t.collection_id === collectionId).length > 0 && menuLists[selectedGrid - 1].collections.filter(t => t.collection_id === collectionId)[0].collection_img_url ? menuLists[selectedGrid - 1].collections.filter(t => t.collection_id === collectionId)[0].collection_img_url : DEFAULT_PROFILE_PIC} alt="" className="flex-shrink-0 h-6 w-6 rounded-full mr-3" /> : null}
																	<span className=" block truncate">{menuLists && menuLists[selectedGrid - 1].collections.filter(t => t.collection_id === collectionId).length > 0 && menuLists[selectedGrid - 1].collections.filter(t => t.collection_id === collectionId)[0].collection_name.replace(' (FND)', '')}</span>
																</>
															</span>
															<span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
															</span>
														</Listbox.Button>

														<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
															<Listbox.Options static className="z-10 absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
																{menuLists &&
																	menuLists[selectedGrid - 1].collections.map(item => (
																		<Listbox.Option key={item.collection_id} className={({ active }) => classNames(active ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={item.collection_id}>
																			{({ active }) => (
																				<>
																					<div className="flex items-center">
																						<img src={item.collection_img_url ? item.collection_img_url : DEFAULT_PROFILE_PIC} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
																						<span
																							className={classNames(
																								item.collection_id === collectionId
																									? 'font-normal' // "font-semibold"
																									: 'font-normal',
																								'ml-3 block truncate'
																							)}
																						>
																							{item.collection_name.replace(' (FND)', '')}
																						</span>
																					</div>

																					{item.collection_id === collectionId ? (
																						<span className={classNames(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
																							<CheckIcon className="h-5 w-5" aria-hidden="true" />
																						</span>
																					) : null}
																				</>
																			)}
																		</Listbox.Option>
																	))}
															</Listbox.Options>
														</Transition>
													</div>
												</>
											)}
										</Listbox>
										<div className="flex-1 flex sm:hidden"></div>
										<Listbox
											value={selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField}
											onChange={value => {
												handleSortChange(value)
											}}
										>
											{({ open }) => (
												<>
													{/*<Listbox.Label className="block text-sm text-gray-500 mr-2 hidden">
                            Sort By
                      </Listbox.Label>*/}
													<div className="relative" style={context.isMobile ? { minWidth: 140 } : { width: 130 }}>
														<Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
															<span className="block truncate">{sortingOptionsList.filter(t => t.value === (selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField))[0].label}</span>
															<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
																<SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
															</span>
														</Listbox.Button>
														<Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
															<Listbox.Options static className="z-10 absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
																{sortingOptionsList
																	.filter(opts => (menuLists[selectedGrid - 1].has_custom_sort ? true : opts.value !== 5))
																	.map(item => (
																		<Listbox.Option key={item.value} className={({ active }) => classNames(active ? 'text-white bg-indigo-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9')} value={item.value}>
																			{({ active }) => (
																				<>
																					<span
																						className={classNames(
																							item.value === (selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField)
																								? 'font-normal' // "font-semibold"
																								: 'font-normal',
																							'block truncate'
																						)}
																					>
																						{item.label}
																					</span>

																					{item.value === (selectedGrid === 1 ? selectedCreatedSortField : selectedGrid === 2 ? selectedOwnedSortField : selectedLikedSortField) ? (
																						<span className={classNames(active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4')}>
																							<CheckIcon className="h-5 w-5" aria-hidden="true" />
																						</span>
																					) : null}
																				</>
																			)}
																		</Listbox.Option>
																	))}
															</Listbox.Options>
														</Transition>
													</div>
												</>
											)}
										</Listbox>
										{(selectedGrid === 1 || selectedGrid === 2) && isMyProfile && !context.isMobile && !isLoadingCards && !isRefreshingCards && collectionId == 0 && (
											<Menu as="div" className="relative inline-block text-left ml-2">
												{({ open }) => (
													<>
														<div>
															<Menu.Button disabled={isChangingOrder} className="inline-flex justify-center items-center w-full px-2 py-2 text-sm font-medium text-white bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus-visible:ring-opacity-75">
																<PencilAltIcon className="w-4 h-4 ml-1 text-black" aria-hidden="true" />
																<ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
															</Menu.Button>
														</div>
														<Transition show={open} as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
															<Menu.Items static className="z-1 absolute right-0 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" style={{ width: 200 }}>
																<div className="px-1 py-1 ">
																	<Menu.Item>
																		{({ active }) => (
																			<button className={`${active ? 'text-white bg-indigo-600' : 'bg-white text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`} onClick={handleClickChangeOrder}>
																				Customize Order
																			</button>
																		)}
																	</Menu.Item>
																	{((selectedGrid === 1 && context.myProfile.default_created_sort_id === 5) || (selectedGrid === 2 && context.myProfile.default_owned_sort_id === 5) || menuLists[selectedGrid - 1].has_custom_sort) && (
																		<Menu.Item>
																			{({ active }) => (
																				<button className={`${active ? 'text-white bg-indigo-600' : 'bg-white text-gray-900'} group flex rounded-md items-center w-full px-2 py-2 text-sm`} onClick={handleClickDeleteCustomOrder}>
																					Remove Custom Order
																				</button>
																			)}
																		</Menu.Item>
																	)}
																</div>
															</Menu.Items>
														</Transition>
													</>
												)}
											</Menu>
										)}
									</div>
								)}

								<div className="md:mx-3">
									{menuLists && menuLists.length > 0 && (
										<TokenGridV5
											dataLength={items.length}
											next={() => {
												addPage(page + 1)
											}}
											hasMore={hasMore}
											endMessage={
												!isLoadingCards && !isRefreshingCards && !isLoadingMore && collectionId == 0 ? (
													menuLists[selectedGrid - 1].count_all_nonhidden > menuLists[selectedGrid - 1].count_deduplicated_nonhidden ? (
														!showDuplicates ? (
															<div className="text-center text-gray-400 text-xs">
																Some duplicate items were hidden.{' '}
																<span className="cursor-pointer hover:text-gray-700" onClick={() => handleShowDuplicates(true)}>
																	Show all
																</span>
															</div>
														) : (
															<div className="text-center text-gray-400 text-xs">
																<span className="cursor-pointer hover:text-gray-700" onClick={() => handleShowDuplicates(false)}>
																	Hide duplicates
																</span>
															</div>
														)
													) : null
												) : null
											}
											scrollThreshold={page === 1 ? 0.3 : page < 4 ? 0.5 : page < 6 ? 0.7 : 0.8}
											showUserHiddenItems={showUserHiddenItems}
											showDuplicates={showDuplicates}
											setHasUserHiddenItems={setHasUserHiddenItems}
											key={`grid___${isLoadingCards || isRefreshingCards}`}
											items={items}
											isLoading={isLoadingCards || isRefreshingCards}
											isLoadingMore={isLoadingMore}
											listId={selectedGrid}
											isMyProfile={isMyProfile}
											openCardMenu={openCardMenu}
											setOpenCardMenu={setOpenCardMenu}
											detailsModalCloseOnKeyChange={slug_address}
											changeSpotlightItem={handleChangeSpotlightItem}
											pageProfile={{
												profile_id,
												slug_address,
												name,
												img_url,
												wallet_addresses_excluding_email,
												website_url,
												username,
											}} // to customize owned by list on bottom of card
											isChangingOrder={isChangingOrder}
											handleReorder={handleReorder}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
					{/* End Page Body */}
				</CappedWidth>
			</Layout>
		</div>
	)
}

export default Profile
