import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import ImageIcon from '@/components/Icons/ImageIcon'
import VideoIcon from '@/components/Icons/VideoIcon'
import HelpIcon from '@/components/Icons/HelpIcon'
import Checkbox from '../Inputs/Checkbox'
import Switch from '../Inputs/Switch'
import ChevronRight from '@/components/Icons/ChevronRight'
import Button from '../Buttons/Button'
import { useState } from 'react'
import AudioIcon from '@/components/Icons/AudioIcon'
import TextIcon from '@/components/Icons/TextIcon'
import FileIcon from '@/components/Icons/FileIcon'
import { MINT_TYPES } from '@/lib/constants'
import Dropdown from '../Dropdown'
import ChevronLeft from '@/components/Icons/ChevronLeft'
import PercentageIcon from '@/components/Icons/PercentageIcon'

const MintModal = ({ open, onClose }) => {
	const [isOptionsOpen, setOptionsOpen] = useState(false)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [putOnSale, setPutOnSale] = useState(false)
	const [price, setPrice] = useState('')
	const [currency, setCurrency] = useState('ETH')
	const [editionCount, setEditionCount] = useState(1)
	const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10)
	const [notSafeForWork, setNotSafeForWork] = useState(false)
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={open} onClose={onClose}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
							<div className="p-4 border-b border-gray-100">
								{isOptionsOpen ? (
									<div className="flex items-center justify-between">
										<button onClick={() => setOptionsOpen(false)} className="rounded-xl bg-gray-100 px-5 py-4 group">
											<ChevronLeft className="w-auto h-3 transform group-hover:-translate-x-0.5 transition" />
										</button>
										<h2 className="text-gray-900 text-xl font-bold">Options</h2>
										<div />
									</div>
								) : (
									<h2 className="text-gray-900 text-xl font-bold">Create NFT</h2>
								)}
							</div>
							{isOptionsOpen ? <OptionsPage {...{ editionCount, setEditionCount, royaltiesPercentage, setRoyaltiesPercentage, notSafeForWork, setNotSafeForWork }} /> : <CreatePage {...{ title, setTitle, description, setDescription, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setOptionsOpen, hasAcceptedTerms, setHasAcceptedTerms }} />}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const CreatePage = ({ title, setTitle, description, setDescription, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setOptionsOpen, hasAcceptedTerms, setHasAcceptedTerms }) => {
	const MINT_FORMATS = [
		{ type: 'image', Icon: ImageIcon },
		{ type: 'video', Icon: VideoIcon },
		{ type: 'audio', Icon: AudioIcon },
		{ type: 'text', Icon: TextIcon },
		{ type: 'file', Icon: FileIcon },
	].filter(({ type }) => MINT_TYPES.includes(type))

	return (
		<div>
			<div className="p-4 border-b border-gray-100 space-y-4">
				<fieldset>
					<div className="mt-1 rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="title" className="sr-only">
								Title
							</label>
							<input type="text" name="title" id="title" className="px-4 py-3 relative block w-full rounded-none rounded-t-2xl bg-gray-100 focus:z-10 border border-b-0 border-gray-300 focus:outline-none focus-visible:ring" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} />
						</div>
						<div>
							<label htmlFor="description" className="sr-only">
								Description
							</label>
							<textarea name="description" id="description" className="px-4 py-3 relative block w-full rounded-none rounded-b-2xl bg-gray-100 focus:z-10 border border-gray-300 resize-none focus:outline-none focus-visible:ring" placeholder="Description (optional)" value={description} onChange={event => setDescription(event.target.value)} />
						</div>
					</div>
				</fieldset>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<div>
							<p className="text-gray-900 text-sm font-semibold">Attachment</p>
							<p className="text-xs font-medium text-gray-500">50mb max</p>
						</div>
						<div className="h-5 w-px bg-gray-300 mx-4" />
						<div className="flex items-center space-x-2 text-gray-900">
							{MINT_FORMATS.map(({ type, Icon }) => (
								<button key={type} className="bg-gray-100 rounded-full p-2.5 focus-visible:ring">
									<Icon className="w-5 h-5" />
								</button>
							))}
						</div>
					</div>
					<div className="flex items-center space-x-1">
						<span className="text-gray-700 text-xs font-medium">
							Stored on <span className="font-semibold text-gray-900">IPFS</span>
						</span>
						<HelpIcon className="w-4 h-4 cursor-help" />
					</div>
				</div>
			</div>
			<div className="p-4 border-b border-gray-100">
				<div className="flex items-center justify-between space-x-4">
					<div>
						<p className="font-semibold text-gray-900">Sell</p>
						<p className="text-sm font-medium text-gray-700">Enter a fixed price to allow people to purchase your NFT.</p>
					</div>
					<Switch value={putOnSale} onChange={setPutOnSale} />
				</div>
				<Transition show={putOnSale} as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-y-full opacity-0" enterTo="translate-y-0 opacity-100">
					<div className="mt-4 flex items-stretch justify-between space-x-2">
						<input className="flex-1 px-4 relative block w-full rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus-visible:ring font-medium" placeholder="Price" value={price} onChange={event => setPrice(event.target.value)} />
						<Dropdown
							className="flex-1"
							value={currency}
							onChange={setCurrency}
							options={[
								{ label: 'ETH', value: 'ETH' },
								{ label: 'USDC', value: 'USDC' },
							]}
						/>
					</div>
				</Transition>
			</div>
			<button onClick={() => setOptionsOpen(true)} className="p-4 border-b border-gray-100 w-full text-left focus-visible:ring group">
				<div className="flex items-center justify-between space-x-4">
					<div>
						<p className="font-semibold text-gray-900">Options</p>
						<p className="text-sm font-medium text-gray-700">
							{editionCount == 1 ? 'Unique' : editionCount} Edition{editionCount == 1 ? '' : 's'} / {royaltiesPercentage}% Royalties
						</p>
					</div>
					<ChevronRight className="w-auto h-4 transform -translate-x-1 group-hover:translate-x-0 transition" />
				</div>
			</button>
			<div className="p-4 border-b border-gray-100">
				<Checkbox value={hasAcceptedTerms} onChange={setHasAcceptedTerms}>
					I have the rights to publish this artwork, and understand it will be minted on the <span className="font-semibold text-gray-900">Polygon</span> network.
				</Checkbox>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" disabled>
						Save Draft
					</Button>
					<Button style="primary" disabled>
						Create
					</Button>
				</div>
			</div>
		</div>
	)
}

const OptionsPage = ({ editionCount, setEditionCount, royaltiesPercentage, setRoyaltiesPercentage, notSafeForWork, setNotSafeForWork }) => {
	return (
		<div>
			<div className="p-4 border-b border-gray-100">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900">Number of Editions</p>
						<p className="text-sm font-medium text-gray-700">1 by default</p>
					</div>
					<input type="number" min="1" className="px-4 py-3 relative block rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus-visible:ring" value={editionCount} onChange={event => setEditionCount(event.target.value)} />
				</div>
			</div>
			<div className="p-4 border-b border-gray-100">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900">Royalties</p>
						<p className="text-sm font-medium text-gray-700">10% by default</p>
					</div>
					<div className="flex items-center space-x-2">
						<input type="number" max="100" step="10" className="px-4 max-w-[60px] py-3 relative block rounded-2xl bg-gray-100 border border-gray-300 focus:outline-none focus-visible:ring no-spinners" value={royaltiesPercentage} onChange={event => setRoyaltiesPercentage(event.target.value)} />
						<PercentageIcon className="w-4 h-4 text-gray-700" />
					</div>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900">Explicit Content</p>
						<p className="text-sm font-medium text-gray-700">18+</p>
					</div>
					<Switch value={notSafeForWork} onChange={setNotSafeForWork} />
				</div>
			</div>
		</div>
	)
}

export default MintModal
