import { Dialog, Transition } from '@headlessui/react'
import Checkbox from '../Inputs/Checkbox'
import Switch from '../Inputs/Switch'
import ChevronRight from '@/components/Icons/ChevronRight'
import Button from '../Buttons/Button'
import { useState, Fragment } from 'react'
import Dropdown from '../Dropdown'
import ChevronLeft from '@/components/Icons/ChevronLeft'
import PercentageIcon from '@/components/Icons/PercentageIcon'
import TextareaAutosize from 'react-autosize-textarea'
import IpfsUpload from '@/components/IpfsUpload'
import { useMemo } from 'react'
import useFlags, { FLAGS } from '@/hooks/useFlags'
import axios from '@/lib/axios'
import { v4 as uuid } from 'uuid'
import { ethers } from 'ethers'
import { getBiconomy } from '@/lib/biconomy'
import useWeb3Modal from '@/lib/web3Modal'
import minterAbi from '@/data/ShowtimeMT.json'

const MODAL_PAGES = {
	GENERAL: 'general',
	OPTIONS: 'options',
}

const MintModal = ({ open, onClose }) => {
	const { [FLAGS.hasMinting]: canMint } = useFlags()
	const web3Modal = useWeb3Modal({ withMagic: true })

	const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL)

	//const [draft, setDraft] = useState({})
	const [draftId /*, setDraftId */] = useState(null)

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [ipfsHash, setIpfsHash] = useState(null)
	const [putOnSale, setPutOnSale] = useState(false)
	const [price, setPrice] = useState('')
	const [currency, setCurrency] = useState('ETH')
	const [editionCount, setEditionCount] = useState(1)
	const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10)
	const [notSafeForWork, setNotSafeForWork] = useState(false)
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)

	const isValid = useMemo(() => {
		if (!canMint || !title || !hasAcceptedTerms || !editionCount || !royaltiesPercentage || !ipfsHash) return false
		if (putOnSale && (!price || !currency)) return false
		if (editionCount < 1 || royaltiesPercentage > 100 || royaltiesPercentage < 0) return false

		return true
	}, [title, hasAcceptedTerms, putOnSale, price, currency, editionCount, royaltiesPercentage, canMint, ipfsHash])

	const isEmpty = useMemo(() => {
		return !title && !description && !ipfsHash && !hasAcceptedTerms && !draftId && !price && !notSafeForWork && editionCount == 1 && royaltiesPercentage == 10 && currency == 'ETH'
	}, [title, description, ipfsHash, hasAcceptedTerms, draftId, currency, price, notSafeForWork, editionCount, royaltiesPercentage])

	// const isDirty = useMemo(() => {
	// 	if (isEmpty) return false

	// 	return draftId != draft.id || editionCount != draft.number_of_copies || currency != draft.currency_ticker || description != draft.description || ipfsHash != draft.ipfs_hash || notSafeForWork != draft.nsfw || title != draft.title || price != draft.price || royaltiesPercentage != draft.royalties || hasAcceptedTerms != draft.agreed_to_terms
	// }, [currency, description, draft.agreed_to_terms, draft.currency_ticker, draft.description, draft.id, draft.ipfs_hash, draft.nsfw, draft.number_of_copies, draft.price, draft.royalties, draft.title, draftId, editionCount, hasAcceptedTerms, ipfsHash, isEmpty, notSafeForWork, price, royaltiesPercentage, title])

	const mintToken = async () => {
		// setModalPage(MODAL_PAGES.LOADING)

		const { token: pinataToken } = await axios.post('/api/pinata/generate-key').then(res => res.data)

		const { IpfsHash: contentHash } = await axios
			.post(
				'https://api.pinata.cloud/pinning/pinJSONToIPFS',
				{
					pinataMetadata: { name: uuid() },
					pinataContent: {
						name: title,
						description,
						image: `ipfs://${ipfsHash}`,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${pinataToken}`,
					},
				}
			)
			.then(res => res.data)

		const { biconomy, web3 } = await getBiconomy(web3Modal)
		const signerAddress = await web3.getSigner().getAddress()
		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTING_CONTRACT, minterAbi, biconomy.getSignerByAddress(signerAddress))
		const { data } = await contract.populateTransaction.issueToken(signerAddress, editionCount, contentHash, 0)

		const provider = biconomy.getEthersProvider()

		const transaction = await provider.send('eth_sendTransaction', [
			{
				data,
				from: signerAddress,
				to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
				signatureType: 'EIP712_SIGN',
			},
		])

		// setModalPage(MODAL_PAGES.SUCCESS)
		window.open(`https://mumbai.polygonscan.com/tx/${transaction}`)
	}

	const renderedPage = (type => {
		switch (type) {
			case MODAL_PAGES.GENERAL:
				return <CreatePage {...{ title, setTitle, description, setDescription, ipfsHash, setIpfsHash, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setModalPage, hasAcceptedTerms, setHasAcceptedTerms, isEmpty, isValid, mintToken }} />
			case MODAL_PAGES.OPTIONS:
				return <OptionsPage {...{ editionCount, setEditionCount, royaltiesPercentage, setRoyaltiesPercentage, notSafeForWork, setNotSafeForWork }} />
		}
	})(modalPage)

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
								{modalPage === MODAL_PAGES.OPTIONS ? (
									<div className="flex items-center justify-between">
										<button onClick={() => setModalPage(MODAL_PAGES.GENERAL)} className="rounded-xl bg-gray-100 px-5 py-4 group">
											<ChevronLeft className="w-auto h-3 transform group-hover:-translate-x-0.5 transition" />
										</button>
										<h2 className="text-gray-900 text-xl font-bold">Options</h2>
										<div />
									</div>
								) : (
									<h2 className="text-gray-900 text-xl font-bold">Create NFT</h2>
								)}
							</div>
							{renderedPage}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const CreatePage = ({ title, setTitle, description, setDescription, ipfsHash, setIpfsHash, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setModalPage, hasAcceptedTerms, setHasAcceptedTerms, isEmpty, isValid, mintToken }) => {
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
							<TextareaAutosize rows={2} maxRows={6} name="description" id="description" className="px-4 py-3 text-sm relative block w-full rounded-none rounded-b-2xl bg-gray-100 focus:z-10 border border-gray-300 resize-none focus:outline-none focus-visible:ring" placeholder="Description (optional)" value={description} onChange={event => setDescription(event.target.value)} />
						</div>
					</div>
				</fieldset>
				<IpfsUpload ipfsHash={ipfsHash} onChange={setIpfsHash} />
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
			<button onClick={() => setModalPage(MODAL_PAGES.OPTIONS)} className="p-4 border-b border-gray-100 w-full text-left focus-visible:ring group">
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
					{/* eslint-disable-next-line no-constant-condition */}
					{false ? (
						<Button style="tertiary" disabled={isEmpty}>
							Save Draft
						</Button>
					) : (
						<div />
					)}
					<Button style="primary" disabled={!isValid} onClick={mintToken}>
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
