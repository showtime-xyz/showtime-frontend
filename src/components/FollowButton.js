import { useContext, useEffect, useState } from 'react'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import axios from '@/lib/axios'
import UserAddIcon from './Icons/UserAddIcon'
import Button from './UI/Buttons/Button'
import useAuth from '@/hooks/useAuth'

const FollowButton = ({ item, followerCount, setFollowerCount, hideIfFollowing, compact, className }) => {
	const { isAuthenticated } = useAuth()
	const context = useContext(AppContext)
	const myFollows = context?.myFollows || []
	const [isFollowed, setIsFollowed] = useState(false)

	useEffect(() => {
		setFollowerCount(parseInt(item?.follower_count || 0))
	})

	useEffect(() => {
		var it_is_followed = false
		myFollows.forEach(follow => {
			if (follow?.profile_id === item?.profile_id) it_is_followed = true
		})

		setIsFollowed(it_is_followed)
	}, [myFollows, item?.profile_id])

	const handleFollow = async () => {
		setIsFollowed(true)
		// Change myFollows via setMyFollows
		context.setMyFollows([{ profile_id: item?.profile_id }, ...context.myFollows])
		// Post changes to the API
		await axios
			.post(`/api/follow_v2/${item?.profile_id}`)
			.then(() => mixpanel.track('Followed profile'))
			.catch(err => {
				if (err.response.data.code !== 429) throw err

				context.setMyFollows(context.myFollows.filter(i => i?.profile_id !== item?.profile_id))
				return context.setThrottleMessage(err.response.data.message)
			})
	}

	const handleUnfollow = async () => {
		setIsFollowed(false)
		setFollowerCount(followerCount - 1)
		// Change myLikes via setMyLikes
		context.setMyFollows(context.myFollows.filter(i => i?.profile_id !== item?.profile_id))
		// Post changes to the API
		await axios.post(`/api/unfollow_v2/${item?.profile_id}`)
		mixpanel.track('Unfollowed profile')
	}

	const handleLoggedOutFollow = () => {
		mixpanel.track('Follow but logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Button style={isFollowed ? 'tertiary' : 'primary'} onClick={isAuthenticated ? (isFollowed ? handleUnfollow : context.disableFollows ? null : handleFollow) : handleLoggedOutFollow} className={`space-x-2 ${isFollowed ? '' : 'text-white'} ${hideIfFollowing ? 'hidden' : ''} ${compact ? 'py-1 px-2 text-sm' : ''} ${className}`}>
			{isFollowed ? (
				<span className="font-semibold">Following</span>
			) : (
				<>
					<UserAddIcon className="w-5 h-5" />
					<span className="font-semibold">Follow</span>
				</>
			)}
		</Button>
	)
}

export default FollowButton
