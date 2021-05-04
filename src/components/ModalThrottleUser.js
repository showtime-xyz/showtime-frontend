import { useState } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'

export default function ModalThrottleUser({ isOpen, closeModal, modalContent }) {
	const [inputValue, setInputValue] = useState('')
	const [confirmationShowing, setConfirmationShowing] = useState(false)

	const handleThrottleAction = async event => {
		mixpanel.track('Throttle limit exceeded')
		event.preventDefault()

		// Post changes to the API
		await axios.post('/api/feedback', {
			description: inputValue,
		})

		setConfirmationShowing(true)
	}

	useEffect(() => {
		handleThrottleAction()
	}, [])

	return (
		<>
			{isOpen && (
				<ScrollableModal
					closeModal={() => {
						closeModal()
						setInputValue('')
					}}
					contentWidth="30rem"
				>
					<div className="p-4">
						<CloseButton setEditModalOpen={closeModal} />
						<div className="text-3xl border-b-2 pb-2">Feedback</div>
						<div className="my-8">{modalContent}</div>
					</div>
				</ScrollableModal>
			)}
		</>
	)
}
