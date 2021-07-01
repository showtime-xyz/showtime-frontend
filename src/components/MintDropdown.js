import { classNames } from '@/lib/utilities'
import { TYPES } from '@/pages/mint/[type]'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment } from 'react'
import AudioIcon from './Icons/AudioIcon'
import FileIcon from './Icons/FileIcon'
import ImageIcon from './Icons/ImageIcon'
import PlusIcon from './Icons/PlusIcon'
import TextIcon from './Icons/TextIcon'
import VideoIcon from './Icons/VideoIcon'
import Button from './UI/Buttons/Button'

// Next.js' Link component doesn't appropiately forward all props, so we need to wrap it in order to use it on our menu
const NextLink = ({ href, children, ...rest }) => (
	<Link href={href}>
		<a {...rest}>{children}</a>
	</Link>
)

const MintDropdown = () => {
	const OPTIONS = [
		{ type: 'image', Icon: ImageIcon },
		{ type: 'video', Icon: VideoIcon },
		{ type: 'audio', Icon: AudioIcon },
		{ type: 'text', Icon: TextIcon },
		{ type: 'file', Icon: FileIcon },
	].filter(({ type }) => TYPES.includes(type))

	return (
		<Menu as="div" className="ml-5 md:relative">
			{({ open }) => (
				<>
					<div>
						<Menu.Button as={Button} style="primary" iconOnly={true}>
							<PlusIcon className="w-4 h-4" />
						</Menu.Button>
					</div>
					<Transition show={open} as={Fragment} enter="transition ease-out duration-200" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
						<Menu.Items static className="origin-top-right absolute right-0 mt-2 focus:outline-none w-full md:w-auto px-4 md:px-0">
							<Menu.Item>
								<button className="bg-white dark:bg-black bg-opacity-90 dark:bg-opacity-90 w-[120vw] h-screen fixed z-10 -ml-10 focus:outline-none md:hidden" />
							</Menu.Item>
							<div className="mt-0.5 md:mt-0 rounded-2xl shadow-lg border border-transparent dark:border-gray-800 bg-white dark:bg-gray-900 space-y-4 divide-y divide-gray-100 dark:divide-gray-800 relative z-20 min-w-[10rem] w-full md:w-auto py-1 px-2">
								<div className="py-1">
									{OPTIONS.map(({ type, Icon }) => (
										<Menu.Item key={type} as={NextLink} className={({ active }) => classNames(active ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-500', 'rounded-lg w-full text-left py-2 pr-6 pl-2 text-sm font-semibold transition flex items-center space-x-2')} href={`/mint/${type}`}>
											<Icon className="w-4 h-4" />
											<span className="capitalize">{type}</span>
										</Menu.Item>
									))}
								</div>
							</div>
						</Menu.Items>
					</Transition>
				</>
			)}
		</Menu>
	)
}

export default MintDropdown
