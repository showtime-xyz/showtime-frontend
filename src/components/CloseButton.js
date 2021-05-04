import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import mixpanel from 'mixpanel-browser'

const CloseButton = ({ setEditModalOpen, isDetailModal }) => {
	return (
		<div
			className="absolute top-5 right-5 cursor-pointer z-[4]"
			onClick={() => {
				setEditModalOpen(false)
				if (isDetailModal) {
					mixpanel.track('Close NFT modal - x button')
				}
			}}
		>
			<FontAwesomeIcon className="w-6 h-6 text-gray-400" icon={faTimes} />
		</div>
	)
}

export default CloseButton
