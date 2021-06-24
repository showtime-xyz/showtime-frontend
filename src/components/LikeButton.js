import { useContext } from 'react'
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import _ from 'lodash'
import Tippy from '@tippyjs/react'
import axios from '@/lib/axios'
import HeartIcon from './Icons/HeartIcon'
import useAuth from '@/hooks/useAuth'

const LikeButton = ({ item }) => {
	const { isAuthenticated } = useAuth()
	const context = useContext(AppContext)

	const handleLike = async nft_id => {
		// Change myLikes via setMyLikes
		context.setMyLikes([...context.myLikes, nft_id])

		context.setMyLikeCounts({
			...context.myLikeCounts,
			[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) + 1,
		})

		// Post changes to the API
		try {
			await axios
				.post(`/api/like_v3/${nft_id}`)
				.then(() => mixpanel.track('Liked item'))
				.catch(err => {
					if (err.response.data.code === 429) {
						// Change myLikes via setMyLikes
						context.setMyLikes(context.myLikes.filter(item => !(item === nft_id)))

						context.setMyLikeCounts({
							...context.myLikeCounts,
							[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) - 0,
						})
						return context.setThrottleMessage(err.response.data.message)
					}
					console.error(err)
				})
		} catch (err) {
			console.error(err)
		}
	}

	const handleUnlike = async nft_id => {
		// Change myLikes via setMyLikes
		context.setMyLikes(context.myLikes.filter(item => !(item === nft_id)))

		context.setMyLikeCounts({
			...context.myLikeCounts,
			[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) - 1,
		})

		// Post changes to the API
		await axios.post(`/api/unlike_v3/${nft_id}`)
		mixpanel.track('Unliked item')
	}

	const like_count = context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count
	const liked = context.myLikes?.includes(item.nft_id)

	const handleLoggedOutLike = () => {
		mixpanel.track('Liked but logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Tippy content="Sign in to like" disabled={isAuthenticated || context.isMobile}>
			<button className="focus:outline-none hover:bg-red-50 dark:hover:bg-red-900 focus:bg-red-50 dark:focus:bg-red-900 px-2 -mx-2 rounded-xl" disabled={context.disableLikes} onClick={() => (isAuthenticated ? (liked ? handleUnlike(item.nft_id) : handleLike(item.nft_id)) : handleLoggedOutLike())}>
				<div className={`flex flex-row items-center rounded-md py-1 dark:text-gray-300 ${liked ? 'text-red-500 dark:text-red-600' : 'hover:text-red-400 dark:hover:text-red-400'} ${context.disableLikes ? 'hover:text-gray-500 text-gray-500' : ''}`}>
					<div className={'flex'}>
						<HeartIcon className="w-5 h-5" />
					</div>
					<div className="ml-1 whitespace-nowrap">{Number(like_count < 0 ? 0 : like_count).toLocaleString()}</div>
				</div>
			</button>
		</Tippy>
	)
}

export default LikeButton
