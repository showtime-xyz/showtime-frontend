import { useState, useContext, useEffect } from 'react'
import LeaderboardItemV2 from '@/components/LeaderboardItemV2'
import LoadingSpinner from '@/components/LoadingSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faPlus } from '@fortawesome/free-solid-svg-icons'
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'

const TrendingCreators = ({ shownLeaderboardItems, allLeaderboardItems, isLoading, showAllLeaderboardItems, setShowAllLeaderboardItems, trendingTab }) => {
	const context = useContext(AppContext)
	const [followAllClicked, setFollowAllClicked] = useState(false)

	// reset follow all button when leaderboard changes
	useEffect(() => {
		if (context.myFollows) {
			const newProfiles = allLeaderboardItems.filter(item => !context.myFollows.map(f => f.profile_id).includes(item.profile_id))
			setFollowAllClicked(newProfiles.length === 0)
		}
	}, [allLeaderboardItems, showAllLeaderboardItems, trendingTab, context.myFollows])

	const handleFollowAll = async () => {
		setFollowAllClicked(true)
		const newProfiles = allLeaderboardItems.filter(item => !context.myFollows.map(f => f.profile_id).includes(item.profile_id))
		// UPDATE CONTEXT
		context.setMyFollows([...newProfiles, ...context.myFollows])
		// Post changes to the API
		await fetch('/api/bulkfollow', {
			method: 'post',
			body: JSON.stringify(newProfiles.map(item => item.profile_id)),
		})
	}

	const handleLoggedOutFollowAll = () => {
		mixpanel.track('Clicked `Follow all` on trending page, but is logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<>
			<div className="bg-white sm:rounded-lg shadow-md pt-3 ">
				<div className="border-b border-gray-200 flex items-center pb-2 pl-4 pr-2 flex-row">
					<div className="my-2 flex-grow">
						<span className="sm:hidden">Trending </span>Creators
					</div>
					{!isLoading && (
						<div>
							<div className={`text-black border rounded-full py-2 px-4 text-xs flex flex-row   ${followAllClicked ? 'bg-white border-gray-400' : 'bg-stpurple text-white border-stpurple cursor-pointer hover:opacity-70 transition-all'}`} onClick={context.user ? (followAllClicked ? null : handleFollowAll) : handleLoggedOutFollowAll}>
								{!followAllClicked && (
									<div className="mr-1">
										<FontAwesomeIcon icon={faPlus} />
									</div>
								)}
								<div>{followAllClicked ? 'Following All' : 'Follow All'}</div>
							</div>
						</div>
					)}
				</div>

				{isLoading ? (
					<div className="p-6 mx-auto flex flex-row">
						<div className="flex-grow"></div>
						<LoadingSpinner />
						<div className="flex-grow"></div>
					</div>
				) : (
					shownLeaderboardItems.map((item, index) => <LeaderboardItemV2 key={item?.profile_id} item={item} index={index} />)
				)}
			</div>

			{!isLoading && (
				<div className="flex flex-row items-center my-2 justify-center pb-10 sm:pb-0">
					{!showAllLeaderboardItems ? (
						<div
							className="bg-white text-center px-6 py-2 mt-2 flex items-center w-max shadow-md rounded-full hover:text-stpink  cursor-pointer"
							onClick={() => {
								setShowAllLeaderboardItems(true)
							}}
						>
							<div className="mr-2 text-sm">Show More</div>
							<div>
								<FontAwesomeIcon className="h-3" icon={faArrowDown} />
							</div>
						</div>
					) : null}
				</div>
			)}
			<div className="sm:hidden mx-4 my-6">Trending Art</div>
		</>
	)
}

export default TrendingCreators
