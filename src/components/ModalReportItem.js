import { useState } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'

export default function Modal({ isOpen, setReportModalOpen, nftId, activityId, removeItemFromFeed }) {
	const [inputValue, setInputValue] = useState('')
	const [confirmationShowing, setConfirmationShowing] = useState(false)
	const [waitingForResponse, setWaitingForResponse] = useState(false)

	const handleSubmit = async event => {
		mixpanel.track('Submit report item')
		setWaitingForResponse(true)
		event.preventDefault()

		// Post changes to the API
		await axios.post('/api/reportitem_v2', { nft_id: nftId, description: inputValue, activity_id: activityId })

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
							<div className="text-3xl border-b-2 pb-2">Report {/*activityId ? "Activity" : "Item"*/}</div>
							{confirmationShowing ? (
								<div className="my-8">We received your report. Thank you!</div>
							) : (
								<>
									<div className="my-8">
										<textarea
											name="details"
											placeholder="Provide details (optional)"
											value={inputValue}
											autoFocus
											onChange={e => {
												setInputValue(e.target.value)
											}}
											type="text"
											maxLength="200"
											className="w-full text-black p-3 rounded-lg border-2 border-gray-400"
											rows={4}
										/>
									</div>
									<div className="border-t-2 pt-4">
										<button type="submit" className="bg-green-500 hover:bg-green-400 border-2 border-green-500 hover:border-green-400 text-white transition px-4 py-2 w-24 rounded-full float-right">
											{waitingForResponse ? (
												<div className="flex items-center justify-center">
													<div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
												</div>
											) : (
												'Submit'
											)}
										</button>
										<button
											type="button"
											className="border-2 text-gray-800 border-gray-800 hover:border-gray-500 hover:text-gray-500 px-4 py-2 rounded-full transition"
											onClick={() => {
												setReportModalOpen(false)
												setInputValue('')
											}}
										>
											Cancel
										</button>
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
