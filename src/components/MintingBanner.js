import XIcon from './Icons/XIcon'
import { Transition } from '@headlessui/react'
import useStickyState from '@/hooks/useStickyState'

const MintingBanner = ({ openMintModal }) => {
	const [show, setShow] = useStickyState('showMintBanner', true, false)

	return (
		<Transition as="span" show={show} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
			<div className="relative bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-sm">
				<div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
					<div className="pr-16 sm:text-center sm:px-16">
						<p className="font-medium text-gray-900 dark:text-gray-100">
							<a href="https://twitter.com/tryShowtime/status/1430898860759552008" target="_blank" className="md:hidden text-gray-900 dark:text-gray-100 font-bold" rel="noreferrer">
								We're rolling out free minting! <span aria-hidden="true">&rarr;</span>
							</a>
							<span className="hidden md:inline">
								<span className="text-xs mr-1 -mt-1 inline-block">🎉</span> You can now create NFTs for free (no gas costs)!{' '}
								<button className="text-gray-900 dark:text-gray-100 font-bold" onClick={openMintModal}>
									Get started
								</button>{' '}
								and{' '}
								<a className="text-gray-900 dark:text-gray-100 font-bold" href="/claim" target="_blank">
									claim our genesis drop NFT
								</a>{' '}
								to celebrate.
							</span>
						</p>
					</div>
					<div className="absolute inset-y-0 right-2 flex items-center">
						<button onClick={() => setShow(false)} type="button" className="flex p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none transition">
							<span className="sr-only">Dismiss</span>
							<XIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
		</Transition>
	)
}

export default MintingBanner
