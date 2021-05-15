import { useContext, useEffect, useState } from 'react'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import AppContext from '@/context/app-context'

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
			<div>
				<button
					className="flex items-center justify-center hover:opacity-70 w-full mt-2.5 sm:w-auto sm:mt-0 absolute top-1 right-1"
					onClick={() => removeRecommendation(item)}
				>
					<div className="flex items-center justify-center p-2.5 w-3.5 h-3.5 text-gray-200">
						{context.isMobile ? (
							<h6 className="ml-2.5 text-sm">Remove</h6>
						) : (
							<FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
						)}
					</div>
				</button>
			</div>
		)
	)
}

export default RemoveRecommendationButton
