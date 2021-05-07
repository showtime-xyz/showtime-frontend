import { useEffect, useState, useContext } from 'react'
import AppContext from '@/context/app-context'
import RecommendedFollowItem from './RecommendedFollowItem'
import mixpanel from 'mixpanel-browser'
import axios from '@/lib/axios'

export default function ActivityRecommendedFollows() {
	const context = useContext(AppContext)
	const [loading, setLoading] = useState(true)
	const [recommendedFollows, setRecommendedFollows] = useState([])
	const removeRecommendation = async recommendation => {
		const newRecommendedFollows = recommendedFollows.filter(recFollow => recFollow.profile_id !== recommendation.profile_id)
		setRecommendedFollows(newRecommendedFollows)
		await axios.post('/api/declinefollowsuggestion', { profileId: recommendation.profile_id })
		mixpanel.track('Remove follow recommendation')
	}
	const filterNewRecs = (newRecs, oldRecs, alreadyFollowed) => {
		let filteredData = []
		newRecs.forEach(newRec => {
			if (!oldRecs.find(oldRec => oldRec.profile_id === newRec.profile_id) && !alreadyFollowed.find(followed => followed.profile_id === newRec.profile_id)) {
				filteredData.push(newRec)
			}
		})
		return filteredData
	}

	const [recQueue, setRecQueue] = useState([])

	// update recommendedFollows when the RecQueue is updated
	useEffect(() => {
		//filter the recQueue before updating our list
		const filteredRecQueue = filterNewRecs(recQueue, recommendedFollows, context.myFollows || [])
		setRecommendedFollows([...recommendedFollows, ...filteredRecQueue])
	}, [recQueue])

	useEffect(() => {
		// when context.myFollows changes, filter out any recommended follows
		if (context.myFollows) {
			const filteredRecs = filterNewRecs(recommendedFollows, [], context.myFollows)
			setRecommendedFollows(filteredRecs)
		}
	}, [context.myFollows])

	const getActivityRecommendedFollows = async () => {
		setLoading(true)
		const { data } = await axios.post('/api/getactivityrecommendedfollows').then(res => res.data)
		setRecommendedFollows(data)

		// get recond result
		const { data: secondData } = await axios.post('/api/getactivityrecommendedfollows', { recache: true }).then(res => res.data)

		setRecQueue(secondData)
		setLoading(false)
	}

	const getActivityRecommendedFollowsRecache = async () => {
		setLoading(true)
		const { data } = await axios.post('/api/getactivityrecommendedfollows', { recache: true }).then(res => res.data)

		setRecQueue(data)
		setLoading(false)
	}

	// get recs on init
	useEffect(() => {
		if (typeof context.user !== 'undefined') getActivityRecommendedFollows()
	}, [context.user])

	//get more recs when we're at 3 recs
	useEffect(() => {
		if (typeof context.user !== 'undefined' && !loading && recommendedFollows.length < 4) getActivityRecommendedFollowsRecache()
	}, [recommendedFollows])

	return (
		<div>
			<div className="flex items-center pb-2 px-4">
				<div className="m-2 flex-grow">Suggested for You</div>

				{/*!loading && (
          <div>
            <div
              onClick={followAllClicked ? () => {} : handleFollowAll}
              className={`px-4 py-1 text-sm rounded-full border w-max flex items-center justify-center hover:opacity-80  transition-all cursor-pointer ${
                followAllClicked
                  ? "border-gray-300 text-black"
                  : "border-stpink bg-stpink text-white"
              }`}
            >
              {followAllClicked ? (
                "Followed All"
              ) : (
                <div>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Follow All
                </div>
              )}
            </div>
          </div>
              )*/}
			</div>
			{recommendedFollows &&
				recommendedFollows.slice(0, 3).map(recFollow => (
					<div className="ml-0" key={recFollow.profile_id}>
						<RecommendedFollowItem item={recFollow} liteVersion removeRecommendation={removeRecommendation} closeModal={() => {}} leftPadding={24} />
					</div>
				))}
			{!loading && recommendedFollows && recommendedFollows.length === 0 && (
				<div className="flex flex-col items-center justify-center my-8">
					<div className="text-gray-400">No more recommendations.</div>
					<div className="text-gray-400">(Refresh for more!)</div>
				</div>
			)}
			{loading && recommendedFollows.length < 3 && (
				<div className="flex justify-center items-center w-full py-4 border-t border-gray-200">
					<div className="loading-card-spinner" />
				</div>
			)}
		</div>
	)
}
