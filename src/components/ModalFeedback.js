import { useState } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'
import GreenButton from './UI/Buttons/GreenButton'
import axios from '@/lib/axios'
import GhostButton from './UI/Buttons/GhostButton'

export default function ModalFeedback({ isOpen, closeModal }) {
	const [inputValue, setInputValue] = useState('')
	const [confirmationShowing, setConfirmationShowing] = useState(false)

	const handleSubmit = async event => {
		mixpanel.track('Submit website feedback')
		event.preventDefault()

		// Post changes to the API
		await axios.post('/api/feedback', {
			description: inputValue,
		})

		setConfirmationShowing(true)

		setTimeout(function () {
			setConfirmationShowing(false)
			closeModal()
			setInputValue('')
		}, 2500)
	}
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
						<form onSubmit={handleSubmit}>
							<CloseButton setEditModalOpen={closeModal} />
							<div className="text-2xl dark:text-gray-300 border-b-2 dark:border-gray-800 pb-2">Feedback</div>
							{confirmationShowing ? (
								<div className="my-8 dark:text-gray-400">We have received your feedback. Thank you!</div>
							) : (
								<>
									<div className="my-4">
										<div className="my-4 mx-1 dark:text-gray-400">Please let us know how we can improve Showtime! The team reviews every message.</div>
										<textarea name="description" placeholder="Your feedback here..." value={inputValue} autoFocus onChange={e => setInputValue(e.target.value)} type="text" maxLength="500" className="w-full text-black dark:text-gray-400 p-3 rounded-lg border-2 border-gray-600 focus:outline-none focus-visible:ring-1" rows={4} />
									</div>
									<div className="border-t-2 dark:border-gray-800 pt-4">
										<GreenButton type="submit">Submit</GreenButton>
										<GhostButton
											onClick={() => {
												closeModal()
												setInputValue('')
											}}
										>
											Cancel
										</GhostButton>
									</div>
								</>
							)}
						</form>
					</div>
				</ScrollableModal>
			)}
		</>
	)
}
