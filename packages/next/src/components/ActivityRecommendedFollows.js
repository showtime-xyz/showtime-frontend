import { useContext } from 'react'
import AppContext from '@/context/app-context'
import RecommendedFollowItem from './RecommendedFollowItem'
import mixpanel from 'mixpanel-browser'
import axios from '@/lib/axios'

export default function ActivityRecommendedFollows() {
	const context = useContext(AppContext)

	const removeRecommendation = async recommendation => {
		const newRecommendedFollows = context.recommendedFollows.filter(recFollow => recFollow.profile_id !== recommendation.profile_id)
		context.setRecommendedFollows(newRecommendedFollows)
		await axios.post('/api/declinefollowsuggestion', { profileId: recommendation.profile_id })
		mixpanel.track('Remove follow recommendation')
	}

	return (
		<div>
			<div className="flex items-center pb-2 px-4">
				<div className="m-2 flex-grow dark:text-gray-200">Suggested for You</div>
			</div>
			{context.recommendedFollows &&
				context.recommendedFollows.slice(0, 3).map(recFollow => (
					<div className="ml-0" key={recFollow.profile_id}>
						<RecommendedFollowItem item={recFollow} liteVersion removeRecommendation={removeRecommendation} closeModal={() => {}} leftPadding={24} />
					</div>
				))}
			{!context.loadingRecommendedFollows && context.recommendedFollows && context.recommendedFollows.length === 0 && (
				<div className="flex flex-col items-center justify-center my-8">
					<div className="text-gray-400">No more recommendations.</div>
					<div className="text-gray-400">(Refresh for more!)</div>
				</div>
			)}
			{context.loadingRecommendedFollows && context.recommendedFollows.length < 3 && (
				<div className="flex justify-center items-center w-full py-4 border-t border-gray-200 dark:border-gray-800">
					<div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
				</div>
			)}
		</div>
	)
}
