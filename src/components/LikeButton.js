import _ from 'lodash'
import Tippy from '@tippyjs/react'
import mixpanel from 'mixpanel-browser'
import { useContext } from 'react'
import { captureException } from '@sentry/nextjs'

import AppContext from '@/context/app-context'
import authAxios from '@/lib/authenticated-client-side-axios'
import HeartIcon, { HeartIconSolid } from './Icons/HeartIcon'
import ClientAccessToken from '@/lib/client-access-token'

const LikeButton = ({ item }) => {
	const isAuthenticated = ClientAccessToken.getAccessToken()

	const context = useContext(AppContext)

	const handleLike = async nft_id => {
		// Change myLikes via setMyLikes
		context.setMyLikes([...context.myLikes, nft_id])

		context.setMyLikeCounts({
			...context.myLikeCounts,
			[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) + 1,
		})

		try {
			await authAxios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v3/like/${nft_id}`)
			mixpanel.track('Liked item')
		} catch (err) {
			if (err.response.data.code === 429) {
				// Change myLikes via setMyLikes
				context.setMyLikes(context.myLikes.filter(item => !(item === nft_id)))

				context.setMyLikeCounts({
					...context.myLikeCounts,
					[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) - 0,
				})
				return context.setThrottleMessage(err.response.data.message)
			}

			if (process.env.NODE_ENV === 'development') {
				console.error(err)
			}

			//TODO: update this in notion
			captureException(err, {
				tags: {
					nft_like: 'LikeButton.js',
				},
			})
		}
	}

	const handleUnlike = async nft_id => {
		// Change myLikes via setMyLikes
		context.setMyLikes(context.myLikes.filter(item => !(item === nft_id)))

		context.setMyLikeCounts({
			...context.myLikeCounts,
			[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) - 1,
		})

		try {
			await authAxios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v3/unlike/${nft_id}`)
			mixpanel.track('Unliked item')
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}

			//TODO: update this in notion
			captureException(error, {
				tags: {
					nft_unlike: 'LikeButton.js',
				},
			})
		}
	}

	const like_count = context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count
	const liked = context.myLikes?.includes(item.nft_id)

	const handleLoggedOutLike = () => {
		mixpanel.track('Liked but logged out')
		context.setLoginModalOpen(true)
	}

	return (
		<Tippy content="Sign in to like" disabled={isAuthenticated || context.isMobile}>
			<button className="focus:outline-none hover:bg-red-50 dark:hover:bg-red-900 focus-visible:bg-red-50 dark:focus-visible:bg-red-900 px-2 -mx-2 rounded-xl group" disabled={context.disableLikes} onClick={() => (isAuthenticated ? (liked ? handleUnlike(item.nft_id) : handleLike(item.nft_id)) : handleLoggedOutLike())}>
				<div className={`flex flex-row items-center rounded-md py-1 dark:text-gray-300 ${liked ? 'text-red-500 dark:text-red-600' : 'group-hover:text-red-400 dark:group-hover:text-red-400'} ${context.disableLikes ? 'hover:text-gray-500 text-gray-500' : ''}`}>
					<div className={'flex'}>{liked ? <HeartIconSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}</div>
					<div className="ml-1 whitespace-nowrap">{Number(like_count < 0 ? 0 : like_count).toLocaleString()}</div>
				</div>
			</button>
		</Tippy>
	)
}

export default LikeButton
