import { useState } from 'react'
import mixpanel from 'mixpanel-browser'
import CloseButton from './CloseButton'
import { Magic } from 'magic-sdk'
import ScrollableModal from './ScrollableModal'
import axios from '@/lib/axios'
import GreenButton from './UI/Buttons/GreenButton'
import GhostButton from './UI/Buttons/GhostButton'

const ModalAddEmail = ({ isOpen, setEmailModalOpen, setHasEmailAddress }) => {
	const [emailValue, setEmailValue] = useState(null)
	const [, setEmailError] = useState('')
	const handleSubmit = async event => {
		setEmailError('')
		event.preventDefault()

		const { elements } = event.target

		// the magic code
		try {
			const did = await new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY).auth.loginWithMagicLink({ email: elements.email.value })

			// Once we have the did from magic, login with our own API
			await axios.post(
				'/api/profile/email',
				{},
				{
					headers: { Authorization: `Bearer ${did}` },
				}
			)

			mixpanel.track('Add email success')
			setHasEmailAddress(true)
			setEmailModalOpen(false)
		} catch {
			/* handle errors */
		}
	}
	return (
		<>
			{isOpen && (
				<ScrollableModal closeModal={() => setEmailModalOpen(false)} contentWidth="30rem">
					<div className="p-4">
						<form onSubmit={handleSubmit}>
							<div className="text-2xl dark:text-gray-300 border-b-2 dark:border-gray-800 pb-2">Add Email</div>
							<CloseButton setEditModalOpen={setEmailModalOpen} />
							<div className="mt-8 dark:text-gray-400">Add your email for notifications &amp; another way to sign in.</div>
							<div className="mt-8">
								<input name="email" value={emailValue ? emailValue : ''} onChange={e => setEmailValue(e.target.value)} placeholder="Email" type="email" className="border-2 dark:border-gray-800 w-full text-black dark:text-gray-300 rounded-lg p-3 focus:outline-none focus-visible:ring-1" autoFocus />
								<div className="my-8 dark:text-gray-400">If you've previously logged in with that email, your old profile will get combined with this one.</div>
								<div className="flex items-center justify-between border-t-2 dark:border-gray-800 pt-4">
									<GhostButton type="button" onClick={() => setEmailModalOpen(false)}>
										Cancel
									</GhostButton>
									<GreenButton type="submit">Get Verification Link</GreenButton>
								</div>
							</div>
						</form>
					</div>
				</ScrollableModal>
			)}
		</>
	)
}

export default ModalAddEmail
