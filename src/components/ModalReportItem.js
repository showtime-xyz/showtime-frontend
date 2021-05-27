import { useState } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'
import GreenButton from './UI/Buttons/GreenButton'
import GhostButton from './UI/Buttons/GhostButton'

export default function Modal({ isOpen, setReportModalOpen, nftId, activityId, removeItemFromFeed }) {
	const [inputValue, setInputValue] = useState('')
	const [confirmationShowing, setConfirmationShowing] = useState(false)
	const [waitingForResponse, setWaitingForResponse] = useState(false)

	const handleSubmit = async event => {
		mixpanel.track('Submit report item')
		setWaitingForResponse(true)
		event.preventDefault()

		// Post changes to the API
		await axios.post('/api/reportitem_v2', {
			nft_id: nftId,
			description: inputValue,
			activity_id: activityId,
		})

		setConfirmationShowing(true)
		setWaitingForResponse(false)
		setTimeout(function () {
			setConfirmationShowing(false)
			setReportModalOpen(false)
			setInputValue('')
			if (removeItemFromFeed) {
				removeItemFromFeed(activityId)
			}
		}, 1500)
	}
	return (
		<>
			{isOpen && (
				<ScrollableModal
					closeModal={() => {
						setReportModalOpen(false)
						setInputValue('')
					}}
					contentWidth="30rem"
					zIndex={4} //needs to be above mobile modal close button
				>
					<div className="p-4">
						<form onSubmit={handleSubmit}>
							<CloseButton setEditModalOpen={setReportModalOpen} />
							<div className="text-2xl dark:text-gray-300 border-b-2 dark:border-gray-800 pb-2">Report</div>
							{confirmationShowing ? (
								<div className="my-8">We received your report. Thank you!</div>
							) : (
								<>
									<div className="my-8">
										<textarea name="details" placeholder="Provide details (optional)" value={inputValue} autoFocus onChange={e => setInputValue(e.target.value)} type="text" maxLength="200" className="w-full text-black dark:text-gray-300 p-3 rounded-lg border-2 border-gray-400 dark:border-gray-800 focus:outline-none focus:border-gray-500 dark:focus:border-gray-600" rows={4} />
									</div>
									<div className="border-t-2 dark:border-gray-800 pt-4">
										<GreenButton type="submit" loading={waitingForResponse}>
											Submit
										</GreenButton>
										<GhostButton
											onClick={() => {
												setReportModalOpen(false)
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
