import { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import mixpanel from 'mixpanel-browser'
import AppContext from '@/context/app-context'
import _ from 'lodash'
import axios from '@/lib/axios'

const FollowButton = ({ item, followerCount, setFollowerCount, hideIfFollowing, notExpandWhenMobile, compact, homepage }) => {
	const context = useContext(AppContext)
	const myFollows = context?.myFollows || []
	const [isFollowed, setIsFollowed] = useState(false)

	useEffect(() => {
		setFollowerCount(parseInt(item.follower_count))
	}, [item])

	useEffect(() => {
		var it_is_followed = false
		_.forEach(myFollows, follow => {
			if (follow?.profile_id === item?.profile_id) {
				it_is_followed = true
			}
		})
		setIsFollowed(it_is_followed)
	}, [myFollows])

	const handleFollow = async () => {
		setIsFollowed(true)
		// Change myFollows via setMyFollows
		context.setMyFollows([{ profile_id: item?.profile_id }, ...context.myFollows])
		// Post changes to the API
		try {
			await axios
				.post(`/api/follow_v2/${item?.profile_id}`)
				.then(() => {
					mixpanel.track('Followed profile')
				})
				.catch(err => {
					if (err.response.data.code === 429) {
						context.setMyFollows(context.myFollows.filter(i => i?.profile_id !== item?.profile_id))
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
		<button className={`flex items-center justify-center hover:opacity-80 disabled:opacity-80 border rounded-full transition py-2 px-4 ${notExpandWhenMobile ? '' : 'w-full md:w-auto'} ${hideIfFollowing && isFollowed ? 'hidden' : null} ${compact ? 'mr-1' : ''} ${compact && context.isMobile ? 'py-2 px-3' : null} ${isFollowed ? 'text-black border-gray-400' : homepage ? 'bg-stpurple text-white border-stpurple' : 'bg-black text-white border-black'}`} disabled={context.disableFollows} onClick={context.user ? (isFollowed ? handleUnfollow : handleFollow) : handleLoggedOutFollow}>
			{!isFollowed && (
				<div className={`mr-2 ${compact ? 'text-xs' : 'text-sm'} `}>
					<FontAwesomeIcon icon={faPlus} />
				</div>
			)}
			<div className={`${compact ? 'text-xs' : 'text-sm'} `}>{isFollowed ? 'Following' : 'Follow'}</div>
		</button>
	)
}

export default FollowButton
