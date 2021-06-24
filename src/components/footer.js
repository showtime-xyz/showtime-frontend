import { MailIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import ModalFeedback from './ModalFeedback'
import showtimeLogo from '../../public/img/logo.png'
import mixpanel from 'mixpanel-browser'
import Link from 'next/link'
import TwitterIcon from './Icons/Social/TwitterIcon'
import InstagramIcon from './Icons/Social/InstagramIcon'
import DiscordIcon from './Icons/Social/DiscordIcon'
import EmailIcon from './Icons/Social/EmailIcon'

const Footer = () => {
	const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

	return (
		<>
			{typeof document !== 'undefined' ? (
				<>
					<ModalFeedback isOpen={isFeedbackModalOpen} closeModal={() => setIsFeedbackModalOpen(false)} />
				</>
			) : null}
			<footer className="bg-gray-900 py-24 px-40 flex justify-between">
				<div className="space-y-4">
					<Link href="/">
						<a className="flex items-center space-x-2" onClick={() => mixpanel.track('Footer logo click')}>
							<img src={showtimeLogo.src} alt="Showtime logo" className="flex-shrink-0 rounded-lg overflow-hidden w-8 h-8" />
							<span className="font-bold text-gray-100">Showtime</span>
						</a>
					</Link>
					<p className="text-gray-400 font-medium text-sm">&copy; {new Date().getFullYear()} Showtime Technologies, Inc.</p>
				</div>
				<div className="flex space-x-12">
					<div className="space-y-4">
						<a className="text-gray-200 font-bold flex items-center space-x-2" href="https://twitter.com/tryShowtime" target="_blank" rel="noopener noreferrer">
							<TwitterIcon className="w-4 h-4" />
							<span>Twitter</span>
						</a>
						<a className="text-gray-200 font-bold flex items-center space-x-2" href="https://www.instagram.com/tryshowtime/" target="_blank" rel="noopener noreferrer">
							<InstagramIcon className="w-4 h-4" />
							<span>Instagram</span>
						</a>
						<a className="text-gray-200 font-bold flex items-center space-x-2" href="https://discord.gg/FBSxXrcnsm" target="_blank" rel="noopener noreferrer">
							<DiscordIcon className="w-4 h-4" />
							<span>Discord</span>
						</a>
						<a className="text-gray-200 font-bold flex items-center space-x-2" href="mailto:help@tryshowtime.com" target="_blank" rel="noopener noreferrer">
							<EmailIcon className="w-4 h-auto" />
							<span>Contact</span>
						</a>
					</div>
					<div className="space-y-4 flex flex-col">
						<a className="text-gray-200 font-bold" href="https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68" target="_blank" rel="noopener noreferrer">
							Terms &amp; Conditions
						</a>
						<a className="text-gray-200 font-bold" href="https://showtime.nolt.io" target="_blank" rel="noopener noreferrer">
							Feedback
						</a>
					</div>
				</div>
			</footer>
		</>
	)
}

export default Footer
