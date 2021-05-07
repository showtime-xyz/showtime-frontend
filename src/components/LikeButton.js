import { useContext } from 'react'
//import { useRouter } from "next/router";
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import Tippy from '@tippyjs/react'
import axios from '@/lib/axios'

const LikeButton = ({ item }) => {
	const context = useContext(AppContext)
	const { isMobile } = context

	const handleLike = async nft_id => {
		// Change myLikes via setMyLikes
		context.setMyLikes([...context.myLikes, nft_id])

		context.setMyLikeCounts({
			...context.myLikeCounts,
			[nft_id]: (context.myLikeCounts && !_.isNil(context.myLikeCounts[item?.nft_id]) ? context.myLikeCounts[item?.nft_id] : item.like_count) + 1,
		})

		// Post changes to the API
		await axios
			.post(`/api/like_v3/${nft_id}`)
			.then(() => {
				mixpanel.track('Liked item')
			})
			.catch(err => {
				if (err.code === 429) {
					context.setThrottleMessage(err.message)
				}
			})
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
		<Tippy content="Sign in to like" disabled={context.user || isMobile}>
			<button onClick={() => (context.user ? (liked ? handleUnlike(item.nft_id) : handleLike(item.nft_id)) : handleLoggedOutLike())}>
				<div className="flex flex-row items-center rounded-md py-1 hover:text-stred">
					<div className="mr-2 whitespace-nowrap">{Number(like_count).toLocaleString()}</div>
					<div className={`flex pr-1 ${liked ? 'text-stred' : ''}`}>
						<FontAwesomeIcon className="!w-5 !h-5" icon={liked ? faHeartSolid : faHeartOutline} />
					</div>
				</div>
			</button>
		</Tippy>
	)
}

export default LikeButton
