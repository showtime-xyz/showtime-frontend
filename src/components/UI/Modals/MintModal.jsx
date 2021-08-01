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
import getWeb3Modal from '@/lib/web3Modal'
import minterAbi from '@/data/ShowtimeMT.json'
import PolygonIcon from '@/components/Icons/PolygonIcon'
import Link from 'next/link'
import { useContext } from 'react'
import AppContext from '@/context/app-context'
import TwitterIcon from '@/components/Icons/Social/TwitterIcon'
import { useRef } from 'react'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useTheme } from 'next-themes'
import useProfile from '@/hooks/useProfile'

const MODAL_PAGES = {
	GENERAL: 'general',
	OPTIONS: 'options',
	LOADING: 'loading',
	MINTING: 'minting',
	SUCCESS: 'success',
}

const MintModal = ({ open, onClose }) => {
	const { [FLAGS.hasMinting]: canMint } = useFlags()
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const confettiCanvas = useRef(null)
	const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL)

	const resetForm = () => {
		setTitle('')
		setDescription('')
		setIpfsHash('')
		setSourcePreview({ src: null, type: null })
		setPutOnSale(false)
		setPrice('')
		setCurrency('ETH')
		setEditionCount(1)
		setRoyaltiesPercentage(10)
		setNotSafeForWork(false)
		setHasAcceptedTerms(false)
		setTransactionHash('')
		setTokenID('')
	}

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		resetForm()
		onClose()
	}

	const shotConfetti = () => {
		if (!confettiCanvas.current) return

		const confettiSource = confetti.create(confettiCanvas.current, { resize: true, disableForReducedMotion: true })
		const end = Date.now() + 1 * 1000
		const colors = ['#4DEAFF', '#894DFF', '#E14DFF']

		const frame = () => {
			confettiSource({ particleCount: 3, angle: 120, spread: 55, colors: colors, shapes: ['circle'] })
			confettiSource({ particleCount: 3, angle: 60, spread: 55, colors: colors, shapes: ['circle'] })

			if (Date.now() < end) requestAnimationFrame(frame)
		}

		frame()
	}

	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [ipfsHash, setIpfsHash] = useState(null)
	const [sourcePreview, setSourcePreview] = useState({ src: null, type: null })
	const [putOnSale, setPutOnSale] = useState(false)
	const [price, setPrice] = useState('')
	const [currency, setCurrency] = useState('ETH')
	const [editionCount, setEditionCount] = useState(1)
	const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10)
	const [notSafeForWork, setNotSafeForWork] = useState(false)
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
	const [transactionHash, setTransactionHash] = useState('')
	const [tokenID, setTokenID] = useState('')

	const isValid = useMemo(() => {
		if (!canMint || !title || !hasAcceptedTerms || !editionCount || !royaltiesPercentage || !ipfsHash) return false
		if (putOnSale && (!price || !currency)) return false
		if (editionCount < 1 || royaltiesPercentage > 100 || royaltiesPercentage < 0) return false

		return true
	}, [title, hasAcceptedTerms, putOnSale, price, currency, editionCount, royaltiesPercentage, canMint, ipfsHash])

	const mintToken = async () => {
		setModalPage(MODAL_PAGES.LOADING)

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

		const web3Modal = getWeb3Modal({ theme: resolvedTheme })
		isWeb3ModalActive.current = true
		const { biconomy, web3 } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false))
		const signerAddress = await web3.getSigner().getAddress()

		if (
			!myProfile?.wallet_addresses_v2
				?.filter(address => address.minting_enabled)
				?.map(({ address }) => address.toLowerCase())
				?.includes(signerAddress.toLowerCase())
		) {
			alert("Please use an address that's linked to your Showtime profile and has been approved for the minting beta.")
			return setModalPage(MODAL_PAGES.GENERAL)
		}

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

		setTransactionHash(transaction)

		provider.once(transaction, result => {
			setTokenID(contract.interface.decodeFunctionResult('issueToken', result.logs[0].data)[0].toNumber())
			setModalPage(MODAL_PAGES.SUCCESS)
		})

		setModalPage(MODAL_PAGES.MINTING)
	}

	const renderedPage = (type => {
		switch (type) {
			case MODAL_PAGES.GENERAL:
				return <CreatePage {...{ title, setTitle, description, setDescription, ipfsHash, setIpfsHash, setSourcePreview, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setModalPage, hasAcceptedTerms, setHasAcceptedTerms, isValid, mintToken }} />
			case MODAL_PAGES.OPTIONS:
				return <OptionsPage {...{ editionCount, setEditionCount, royaltiesPercentage, setRoyaltiesPercentage, notSafeForWork, setNotSafeForWork }} />
			case MODAL_PAGES.LOADING:
				return <LoadingPage />
			case MODAL_PAGES.MINTING:
				return <MintingPage transactionHash={transactionHash} />
			case MODAL_PAGES.SUCCESS:
				return <SuccessPage transactionHash={transactionHash} tokenID={tokenID} shotConfetti={shotConfetti} />
		}
	})(modalPage)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" static className="fixed inset-0 overflow-y-auto" open={open} onClose={trueOnClose}>
				<canvas ref={confettiCanvas} className="absolute inset-0 w-screen h-screen z-[11] pointer-events-none" />
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-10" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-flex items-stretch align-bottom rounded-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-black relative z-20">
							{sourcePreview.src && <div className="p-10 flex items-center justify-center">{sourcePreview.type === 'video' ? <video src={sourcePreview.src} className="max-w-sm w-auto h-auto" autoPlay loop muted /> : <img src={sourcePreview.src} className="max-w-sm w-auto h-auto" />}</div>}
							<div className="bg-white shadow-xl rounded-3xl sm:max-w-lg sm:w-full flex flex-col">
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
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const CreatePage = ({ title, setTitle, description, setDescription, ipfsHash, setIpfsHash, setSourcePreview, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setModalPage, hasAcceptedTerms, setHasAcceptedTerms, isValid, mintToken }) => {
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
				<IpfsUpload ipfsHash={ipfsHash} onChange={setIpfsHash} onPreview={setSourcePreview} />
			</div>
			<div className="p-4 border-b border-gray-100">
				<div className="flex items-center justify-between space-x-4">
					<div>
						<p className="font-semibold text-gray-900">Sell</p>
						<p className="text-sm font-medium text-gray-700">Enter a fixed price to allow people to purchase your NFT.</p>
					</div>
					<Switch value={putOnSale} onChange={setPutOnSale} disabled />
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
				<div className="flex items-center justify-end">
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

const LoadingPage = () => {
	return (
		<div tabIndex="0" className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 border-t-indigo-500 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 text-center">We're preparing your NFT</p>
				<p className="font-medium text-gray-900 text-center max-w-xs">We'll ask you to confirm with your preferred wallet shortly</p>
			</div>
		</div>
	)
}

const MintingPage = ({ transactionHash }) => {
	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 border-t-indigo-500 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 text-center">Your NFT is being minted on the Polygon network.</p>
				<p className="font-medium text-gray-900 text-center max-w-xs">Feel free to navigate away from this screen</p>
			</div>
			<Button style="tertiary" as="a" href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on Polygon Scan</span>
			</Button>
		</div>
	)
}

const SuccessPage = ({ transactionHash, tokenID, shotConfetti }) => {
	const { myProfile, user } = useContext(AppContext)

	useEffect(() => {
		shotConfetti()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<p className="font-medium text-5xl">🎉</p>
			<p className="font-medium text-gray-900 text-center">
				Your NFT has been minted on the Polygon network, you can now view it on your{' '}
				<Link href={`/${myProfile?.username || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.address || user?.publicAddress}`}>
					<a className="font-semibold focus:outline-none focus-visible:underline">Showtime profile &rarr;</a>
				</Link>
			</p>
			<div className="flex items-center space-x-4">
				<Button style="tertiary" as="a" href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<span className="text-sm font-medium">View on Polygon Scan</span>
				</Button>
				<a className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full space-x-2" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://tryshowtime.com/t/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${tokenID}`)}&text=${encodeURIComponent('🌟 Just minted an awesome new NFT on @tryShowtime!!\n')}`} target="_blank" rel="noreferrer">
					<TwitterIcon className="w-4 h-auto" />
					<span className="text-sm font-medium">Share it on Twitter</span>
				</a>
			</div>
		</div>
	)
}

export default MintModal
