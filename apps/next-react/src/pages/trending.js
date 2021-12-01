import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '@/components/layout'
import backend from '@/lib/backend'
import mixpanel from 'mixpanel-browser'
import { GridTab, GridTabs } from '@/components/GridTabs'
import CappedWidth from '@/components/CappedWidth'
import TokenGridV4 from '@/components/TokenGridV4'
import TrendingCreators from '@/components/TrendingCreators'
import useAuth from '@/hooks/useAuth'

// how many leaders to show on first load
const LEADERBOARD_LIMIT = 10

const Leaderboard = () => {
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		// Wait for identity to resolve before recording the view
		if (isAuthenticated) mixpanel.track('Leaderboard page view')
	}, [isAuthenticated])

	const [leaderboardItems, setLeaderboardItems] = useState([])
	const [leaderboardDays, setLeaderboardDays] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingCards, setIsLoadingCards] = useState(false)
	const [featuredItems, setFeaturedItems] = useState([])
	const [showAllLeaderboardItems, setShowAllLeaderboardItems] = useState(false)

	useEffect(() => {
		const getFeatured = async () => {
			setIsLoading(true)
			setShowAllLeaderboardItems(false)
			setLeaderboardItems(await backend.get(`/v1/leaderboard?days=${leaderboardDays}`).then(res => res.data.data))
			setIsLoading(false)
		}

		getFeatured()
	}, [leaderboardDays])

	const shownLeaderboardItems = showAllLeaderboardItems
		? leaderboardItems.slice(0, 20)
		: leaderboardItems.slice(0, LEADERBOARD_LIMIT)

	useEffect(() => {
		const getFeatured = async () => {
			setIsLoadingCards(true)
			setFeaturedItems(
				await backend.get(`/v2/featured?limit=150&days=${leaderboardDays}`).then(res => res.data.data)
			)
			setIsLoadingCards(false)
		}

		getFeatured()
	}, [leaderboardDays])

	return (
		<Layout>
			<Head>
				<title>Trending | Showtime</title>
				<meta name="description" content="Trending creators & items" />
				<meta property="og:type" content="website" />
				<meta name="og:description" content="Trending art & creators" />
				<meta property="og:image" content="https://cdn.tryshowtime.com/twitter_card.jpg" />
				<meta name="og:title" content="Showtime | Trending" />

				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Showtime | Trending Art & Creators" />
				<meta name="twitter:description" content="Trending" />
				<meta name="twitter:image" content="https://cdn.tryshowtime.com/twitter_card.jpg" />
			</Head>

			<div
				className="py-12 sm:py-14 px-8 sm:px-10 text-left "
				style={{
					background:
						'linear-gradient(130deg, rgba(6,216,255,1) 0%, rgba(69,52,245,0.8) 48%, rgba(194,38,173,0.7) 100%)',
				}}
			>
				<CappedWidth>
					<div className="flex flex-row mx-3 text-white">
						<div className="flex-1">
							<div className="text-xl sm:text-2xl dark:text-black">Art &amp; Creators</div>
							<div className="text-3xl sm:text-6xl capitalize font-afro dark:text-black">Trending</div>
							<div className="text-3xl sm:text-6xl dark:text-black">On Showtime</div>
						</div>
					</div>
				</CappedWidth>
			</div>
			<CappedWidth>
				<div className="mt-12 overflow-hidden">
					<GridTabs>
						<GridTab
							label="24 Hours"
							isActive={leaderboardDays === 1}
							onClickTab={() => {
								setLeaderboardDays(1)
							}}
						/>
						<GridTab
							label="7 Days"
							isActive={leaderboardDays === 7}
							onClickTab={() => {
								setLeaderboardDays(7)
							}}
						/>
						<GridTab
							label="30 Days"
							isActive={leaderboardDays === 30}
							onClickTab={() => {
								setLeaderboardDays(30)
							}}
						/>
					</GridTabs>
				</div>
				<div className="md:grid md:grid-cols-3 xl:grid-cols-4 ">
					{/* Mobile on top */}
					<div className="block sm:hidden">
						{leaderboardItems && (
							<TrendingCreators
								shownLeaderboardItems={shownLeaderboardItems}
								allLeaderboardItems={leaderboardItems}
								isLoading={isLoading}
								showAllLeaderboardItems={showAllLeaderboardItems}
								setShowAllLeaderboardItems={setShowAllLeaderboardItems}
								trendingTab={leaderboardDays}
								key={`creators_${leaderboardDays}`}
							/>
						)}
					</div>

					<div className="col-span-2 md:col-span-2 xl:col-span-3 md:mx-3 pb-12">
						<TokenGridV4
							items={featuredItems}
							isLoading={isLoadingCards}
							key={`grid_${leaderboardDays}_${isLoadingCards}`}
						/>
					</div>
					{/* Desktop right column */}
					<div className="hidden sm:block sm:px-3">
						{leaderboardItems && (
							<TrendingCreators
								shownLeaderboardItems={shownLeaderboardItems}
								allLeaderboardItems={leaderboardItems}
								isLoading={isLoading}
								showAllLeaderboardItems={showAllLeaderboardItems}
								setShowAllLeaderboardItems={setShowAllLeaderboardItems}
								trendingTab={leaderboardDays}
								key={`creators_r_${leaderboardDays}`}
							/>
						)}
					</div>
				</div>
			</CappedWidth>
		</Layout>
	)
}

export default Leaderboard
