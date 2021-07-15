import { useContext, useEffect, useState } from 'react'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import axios from '@/lib/axios'
import { useMemo } from 'react'

const MiniFollowButton = ({ profileId }) => {
	const context = useContext(AppContext)
	const myFollows = useMemo(() => context?.myFollows || [], [context?.myFollows])
	const [isFollowed, setIsFollowed] = useState(null)

	useEffect(() => {
		setIsFollowed(myFollows.map(p => p.profile_id).includes(profileId))
	}, [myFollows, profileId])

	const handleFollow = async () => {
		setIsFollowed(true)
		// Change myFollows via setMyFollows
		context.setMyFollows([{ profile_id: profileId }, ...context.myFollows])
		// Post changes to the API
		await axios
			.post(`/api/follow_v2/${profileId}`)
			.then(() => mixpanel.track('Followed profile - Card button'))
			.catch(err => {
				if (err.response.data.code !== 429) throw err

				setIsFollowed(false)
				// Change myLikes via setMyLikes
				context.setMyFollows(context.myFollows.filter(i => i?.profile_id !== profileId))
				return context.setThrottleMessage(err.response.data.message)
			})
	}

	const handleUnfollow = async () => {
		setIsFollowed(false)
		// Change myLikes via setMyLikes
		context.setMyFollows(context.myFollows.filter(i => i?.profile_id !== profileId))
		// Post changes to the API
		await axios.post(`/api/unfollow_v2/${profileId}`)
		mixpanel.track('Unfollowed profile - Card button')
	}

	const handleLoggedOutFollow = () => {
		mixpanel.track('Follow but logged out - Card button')
		context.setLoginModalOpen(true)
	}

	return isFollowed === null ? null : !isFollowed ? (
		<button onClick={context.disableFollows ? null : context.user ? (isFollowed ? handleUnfollow : handleFollow) : handleLoggedOutFollow} className="text-xs font-medium text-gray-800 dark:text-gray-300 rounded-full px-3 py-2 transition bg-gray-100 dark:bg-gray-800 hover:opacity-60 focus:opacity-60 disabled:opacity-40" disabled={context.disableFollows}>
			Follow
		</button>
	) : null
}

export default MiniFollowButton
