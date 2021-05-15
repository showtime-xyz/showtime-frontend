import { useState, useEffect } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import ScrollableModal from './ScrollableModal'

export default function ModalThrottleUser({ isOpen, closeModal, modalContent }) {
	const [modalText, setModalText] = useState('')

	const handleThrottleAction = async () => {
		// Do anything else we need to do from here
		mixpanel.track(modalText)
	}

	useEffect(() => {
		setModalText(modalContent)
		handleThrottleAction()
	}, [])

	return (
		<>
			{isOpen && (
				<ScrollableModal closeModal={closeModal} contentWidth="30rem">
					<div className="p-4">
						<CloseButton setEditModalOpen={closeModal} />
						<div className="text-3xl border-b-2 pb-2">
							Looks like there's a problem!
						</div>
						<div className="my-8">{modalContent}</div>
					</div>
				</ScrollableModal>
			)}
		</>
	)
}
