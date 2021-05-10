import { useContext, useEffect, useState } from 'react'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import axios from '@/lib/axios'

const MiniFollowButton = ({ profileId }) => {
	const context = useContext(AppContext)
	const myFollows = context?.myFollows || []
	const [isFollowed, setIsFollowed] = useState(null)

	useEffect(() => {
		setIsFollowed(myFollows.map(p => p.profile_id).includes(profileId))
	}, [myFollows])

	const handleFollow = async () => {
		setIsFollowed(true)
		// Change myFollows via setMyFollows
		context.setMyFollows([{ profile_id: profileId }, ...context.myFollows])
		// Post changes to the API
		try {
			await axios
				.post(`/api/follow_v2/${profileId}`)
				.then(res => {
					mixpanel.track('Followed profile - Card button')
				})
				.catch(err => {
					if (err.response.data.message.includes('429')) {
						return context.setThrottleMessage(err.response.data.message)
					}
					console.error(err)
				})
		} catch (err) {
			console.error(err)
		}
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
		<div onClick={context.user ? (isFollowed ? handleUnfollow : handleFollow) : handleLoggedOutFollow} className="text-xs text-stlink opacity-80 hover:opacity-100 cursor-pointer">
			Follow
		</div>
	) : null
}

export default MiniFollowButton
