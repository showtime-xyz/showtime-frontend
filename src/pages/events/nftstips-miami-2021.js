import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import Layout from '@/components/layout'
import backend from '@/lib/backend'
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
//import { GridTab, GridTabs } from '@/components/GridTabs'
import CappedWidth from '@/components/CappedWidth'
//import TokenGridV4 from '@/components/TokenGridV4'
//import TrendingCreators from '@/components/TrendingCreators'
import { CalendarIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { DEFAULT_PROFILE_PIC } from '@/lib/constants'
import { formatAddressShort } from '@/lib/utilities'
import MiniFollowButton from '@/components/MiniFollowButton'

import FollowButton from '@/components/FollowButton'

import { PlusIcon } from '@heroicons/react/solid'
import axios from '@/lib/axios'

// how many leaders to show on first load
const LEADERBOARD_LIMIT = 100

export async function getServerSideProps() {
	return {
		props: {},
	}
}

const Leaderboard = () => {
	const context = useContext(AppContext)
	useEffect(() => {
		// Wait for identity to resolve before recording the view
		if (typeof context.user !== 'undefined') mixpanel.track('Leaderboard page view')
	}, [typeof context.user])

	const [leaderboardItems, setLeaderboardItems] = useState([])
	const [leaderboardDays, setLeaderboardDays] = useState(30)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingCards, setIsLoadingCards] = useState(false)
	const [featuredItems, setFeaturedItems] = useState([])
	const [showAllLeaderboardItems, setShowAllLeaderboardItems] = useState(false)

	useEffect(() => {
		const getFeatured = async () => {
			setIsLoading(true)
			setShowAllLeaderboardItems(false)
			const result = await backend.get(`v1/miami2021`)
			const data = result?.data?.data
			setLeaderboardItems(data)
			setIsLoading(false)
		}
		getFeatured()
	}, [leaderboardDays])

	const [followAllClicked, setFollowAllClicked] = useState(false)

	// reset follow all button when leaderboard changes
	useEffect(() => {
		if (context.myFollows) {
			const newProfiles = leaderboardItems.filter(item => !context.myFollows.map(f => f.profile_id).includes(item.profile_id))
			setFollowAllClicked(newProfiles.length === 0)
		}
	}, [leaderboardItems, context.myFollows])

	const handleFollowAll = async () => {
		setFollowAllClicked(true)
		const newProfiles = leaderboardItems.filter(item => !context.myFollows.map(f => f.profile_id).includes(item.profile_id))
		// UPDATE CONTEXT
		context.setMyFollows([...newProfiles, ...context.myFollows])
		// Post changes to the API
		await axios.post(
			'/api/bulkfollow',
			newProfiles.map(item => item.profile_id)
		)
	}

	const handleLoggedOutFollowAll = () => {
		mixpanel.track('Clicked `Follow all` on trending page, but is logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Layout>
			<Head>
				<title>NFTs.tips Event | Miami 2021</title>
				<meta name="description" content="Artist and exhibition details" />
				<meta property="og:type" content="website" />
				<meta name="og:description" content="Artist and exhibition details" />
				<meta property="og:image" content="https://storage.googleapis.com/showtime-nft-thumbnails/nftstips_miami_logo.png" />
				<meta name="og:title" content="NFTs.tips Event | Miami 2021" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="NFTs.tips Event | Miami 2021" />
				<meta name="twitter:description" content="Artist and exhibition details" />
				<meta name="twitter:image" content="https://storage.googleapis.com/showtime-nft-thumbnails/nftstips_miami_logo.png" />
			</Head>

			<div className="py-12 sm:py-14 px-8 sm:px-10 text-left h-32 md:h-64 relative text-left bg-gradient-to-b from-black dark:from-gray-400 to-gray-800 dark:to-gray-100 bg-no-repeat bg-center bg-cover opacity-80" style={{ backgroundImage: 'url(https://storage.googleapis.com/showtime-test/51_cover_1622397198.jpg)' }}>
				{/* <CappedWidth>
					<div className="flex flex-row mx-3 text-white filter drop-shadow-xl">
						<div className="flex-1">
							<div className="text-xl sm:text-2xl dark:text-black">June 1-5, 2021</div>
							<div className="text-3xl sm:text-6xl capitalize font-afro dark:text-black ">NFTs.Tips</div>
							<div className="text-3xl sm:text-6xl dark:text-black">Miami</div>
						</div>
					</div>
				</CappedWidth> */}
			</div>
			<CappedWidth>
				<div className="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
					<div className="flex flex-col md:flex-row mx-5 mb-12">
						<div className="flex flex-col text-center md:text-left">
							<div className="z-10 pb-2 flex flex-row mx-auto">
								<div className="relative -mt-36 md:-mt-64 md:-ml-10">
									<img src="https://storage.googleapis.com/showtime-nft-thumbnails/nftstips_miami_logo.png" className="h-48 md:h-72 z-10" />
								</div>
							</div>
						</div>
						<div className="flex-grow"></div>
						<div className="text-base mt-12 flex flex-row mt-0  text-center md:text-left mx-auto">
							<CalendarIcon className="w-5 h-5 mr-1" /> June 1-5, 2021
						</div>
					</div>

					<div className="space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
						<div className="space-y-5 sm:space-y-4">
							<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Featured Artists</h2>
							<p className="text-xl text-gray-500 dark:text-gray-400">Selected for the "Out of the Dark, Into the Light" exhibition</p>
						</div>
						<div className="lg:col-span-2">
							<ul className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:gap-x-8">
								<li>
									<div className="space-y-4">
										<div className="aspect-w-3 aspect-h-2">
											<Link href="/[profile]" as="/GlitchOfMind">
												<a>
													<img className="object-cover shadow-lg rounded-lg hover:opacity-90" src="https://storage.googleapis.com/showtime-nft-thumbnails/piccardo.jpg" alt="" />
												</a>
											</Link>
										</div>
										<div className="text-lg leading-6 font-medium space-y-1">
											<h3 className="text-indigo-600 dark:text-indigo-200 flex flex-row items-center">
												<Link href="/[profile]" as="/GlitchOfMind">
													Lionel Piccardo
												</Link>
												<div className="flex-grow"></div>

												{context?.myProfile?.profile_id !== 731042 && <FollowButton item={{ profile_id: 731042, follower_count: 0 }} followerCount={0} setFollowerCount={() => {}} notExpandWhenMobile compact />}
											</h3>
										</div>
										<div className="text-lg">
											<p className="text-gray-500 dark:text-gray-400">Afro-Surrealist Artist | Photographer. Based in Amsterdam. I create photo-realistic artworks inspired by my afro-identity experiences.</p>
										</div>
									</div>
								</li>
								<li>
									<div className="space-y-4">
										<div className="aspect-w-3 aspect-h-2">
											<Link href="/[profile]?list=created" as="/HazelG?list=created">
												<a>
													<img className="object-cover shadow-lg rounded-lg hover:opacity-90" src="https://storage.googleapis.com/showtime-nft-thumbnails/griffiths.jpg" alt="" />
												</a>
											</Link>
										</div>
										<div className="text-lg leading-6 font-medium space-y-1">
											<h3 className="text-indigo-600 dark:text-indigo-200 flex flex-row items-center">
												<Link href="/[profile]?list=created" as="/HazelG?list=created">
													Hazel Griffiths
												</Link>
												<div className="flex-grow"></div>

												{context?.myProfile?.profile_id !== 155429 && <FollowButton item={{ profile_id: 155429, follower_count: 0 }} followerCount={0} setFollowerCount={() => {}} notExpandWhenMobile compact />}
											</h3>
										</div>
										<div className="text-lg">
											<p className="text-gray-500 dark:text-gray-400"></p>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>

					<div className="pt-12 text-center  lg:pt-24">
						<div className="space-y-8 sm:space-y-12">
							<div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 ">
								<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Exhibitions</h2>
							</div>
							<ul className="mx-auto grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-16">
								<li>
									<div className="space-y-4">
										<div className="text-xl sm:text-2xl font-extrabold tracking-tight mb-4">Out of the Dark / Into the Light</div>
										<div className="max-w-prose text-left text-gray-500 dark:text-gray-400">
											<p className="mb-4">The main theme of this inaugural NFTs.tips exhibition is Out of the Dark / into the Light, a visual representation of society’s journey out of the global coronavirus pandemic.</p>
											<p className="mb-4">The dark tunnel into which the world plunged by the Pandemic could not have been more catastrophic. Yet here we are, one year later, bathed in the luminous light of recovery and hope, the gloom lifted as our lives stabilize, as the world begins to normalize and as we begin to look eagerly forward to the future.</p>
											<p className="mb-4">Out of the Dark / Into the Light reflects both sides of this tunnel with art that portray the year’s struggle metaphorically and symbolically, as well as literally with images that are in their essence constructed entirely from light. Intangible, digital images created in the ether as if by magic, that one cannot reach out and touch, yet one can feel.</p>
										</div>
									</div>
								</li>
								<li>
									<div className="space-y-4">
										<div className="text-xl sm:text-2xl font-extrabold tracking-tight mb-4">Life is a Garden</div>
										<div className="max-w-prose text-left text-gray-500 dark:text-gray-400">
											<p className="mb-4">Technology brings change that, like seeds in a garden, takes time to germinate, unseen, until ideas take root, send shoots above ground, and then blossom into things that were once only dreamed about.</p>
											<p className="mb-4">The world of NFTs has only recently emerged, a seedling that has taken root globally, seemingly overnight, and yet has already changed the landscape of the art world in radical ways. From animations to augmented reality and holograms all the way into the Metaverse, the artists in this exhibition have applied unique digital technologies to their interpretations of the theme, Life is a Garden. There is no end to how far and wide this technological garden of innovations will grow.</p>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>

					<div className="pt-12 lg:pt-24 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0 ">
						<div className="space-y-5 sm:space-y-4">
							<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Curatorial Team</h2>
						</div>
						<div className="lg:col-span-2">
							<div className="space-y-4 text-lg leading-6 font-medium text-gray-500 dark:text-gray-400">Joyce Korotkin, Ramón Govea, Rebecca Rose, Eric Pivak, Holly Wood, Kilsy Curiel, Major Dream Williams, Paiman, JenJoy Roybal, Glassy Music</div>
						</div>
					</div>

					<div className="py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
						<div className="space-y-8 sm:space-y-12">
							<div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 ">
								<h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">All Artists</h2>
								<p className="text-xl text-gray-500 dark:text-gray-400">Represented in the 2021 conference</p>

								<div className="flex flex-row">
									<div className="flex-grow"></div>
									<div className={`border rounded-full py-2 px-4 text-xs flex flex-row ${followAllClicked ? 'bg-transparent border-gray-700 dark:border-gray-500 text-gray-700 dark:text-gray-500' : context.disableFollows ? 'bg-black text-white border-black opacity-70' : 'bg-black text-white dark:text-gray-900 border-stpurple cursor-pointer hover:opacity-70'} transition-all`} onClick={context.user ? (followAllClicked ? null : context.disableFollows ? null : handleFollowAll) : handleLoggedOutFollowAll}>
										{!followAllClicked && (
											<div className="mr-1">
												<PlusIcon className="w-4 h-4" />
											</div>
										)}
										<div>{followAllClicked ? 'Following All' : 'Follow All'}</div>
									</div>
									<div className="flex-grow"></div>
								</div>
							</div>
							<ul className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6  lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6">
								{leaderboardItems.map(item => (
									<li key={item.profile_id}>
										<div className="space-y-4">
											<Link href="/[profile]" as={`/${item?.username || item.address}`}>
												<a className="cursor-pointer">
													<img className="mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24 hover:opacity-90" src={item?.img_url ? item?.img_url : DEFAULT_PROFILE_PIC} alt="" />
												</a>
											</Link>

											<div className="space-y-2">
												<div className="text-sm font-medium lg:text-base">
													<Link href="/[profile]" as={`/${item?.username || item.address}`}>
														<a>
															<h3 className="text-indigo-600 dark:text-indigo-200 hover:opacity-90">{item?.name || formatAddressShort(item.address) || 'Unnamed'}</h3>
														</a>
													</Link>
													{item?.username && <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">@{item?.username}</div>}
													{context.myProfile?.profile_id !== item?.profile_id && (
														<div>
															<MiniFollowButton profileId={item?.profile_id} />
														</div>
													)}
												</div>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/*<div className="mt-12 overflow-hidden">
					<GridTabs>
						<GridTab
							label="Out of the Dark / Into the Light"
							isActive={leaderboardDays === 1}
							onClickTab={() => {
								setLeaderboardDays(1)
							}}
						/>
						<GridTab
							label="Life is a Garden"
							isActive={leaderboardDays === 7}
							onClickTab={() => {
								setLeaderboardDays(7)
							}}
						/>
					</GridTabs>
				</div>
				<div className="md:grid md:grid-cols-3 xl:grid-cols-4 ">
					
					<div className="block sm:hidden">{leaderboardItems && <TrendingCreators shownLeaderboardItems={shownLeaderboardItems} allLeaderboardItems={leaderboardItems} isLoading={isLoading} showAllLeaderboardItems={showAllLeaderboardItems} setShowAllLeaderboardItems={setShowAllLeaderboardItems} trendingTab={leaderboardDays} key={`creators_${leaderboardDays}`} />}</div>

					<div className="col-span-2 md:col-span-2 xl:col-span-3 md:mx-3">
						<TokenGridV4 items={featuredItems} isLoading={isLoadingCards} key={`grid_${leaderboardDays}_${isLoadingCards}`} />
					</div>
					
					<div className="hidden sm:block sm:px-3">{leaderboardItems && <TrendingCreators shownLeaderboardItems={shownLeaderboardItems} allLeaderboardItems={leaderboardItems} isLoading={isLoading} showAllLeaderboardItems={showAllLeaderboardItems} setShowAllLeaderboardItems={setShowAllLeaderboardItems} trendingTab={leaderboardDays} key={`creators_r_${leaderboardDays}`} />}</div>
						</div>*/}
			</CappedWidth>
		</Layout>
	)
}

export default Leaderboard
