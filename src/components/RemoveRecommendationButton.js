import { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import AppContext from '@/context/app-context'
import { XIcon } from '@heroicons/react/solid'

const RemoveRecommendationButton = ({ item, removeRecommendation }) => {
	const context = useContext(AppContext)

	const myFollows = context?.myFollows || []
	const [isFollowed, setIsFollowed] = useState(false)

	useEffect(() => {
		var it_is_followed = false

		_.forEach(myFollows, follow => {
			if (follow?.profile_id === item?.profile_id) it_is_followed = true
		})

		setIsFollowed(it_is_followed)
	}, [myFollows])

	return (
		!isFollowed &&
		context.user && (
			<div className="opacity-0 group-hover:opacity-100 transition">
				<button className="flex items-center justify-center hover:opacity-70 w-full mt-2.5 sm:w-auto sm:mt-0 absolute top-1 right-1" onClick={() => removeRecommendation(item)}>
					<div className="flex items-center justify-center text-gray-200">{context.isMobile ? <h6 className="ml-2.5 text-sm">Remove</h6> : <XIcon className="w-4 h-4 text-gray-400" />}</div>
				</button>
			</div>
		)
	)
}

export default RemoveRecommendationButton
