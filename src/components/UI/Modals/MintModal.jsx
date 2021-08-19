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
import { ExclamationIcon } from '@heroicons/react/outline'
import XIcon from '@/components/Icons/XIcon'

const MODAL_PAGES = {
	GENERAL: 'general',
	OPTIONS: 'options',
	LOADING: 'loading',
	MINTING: 'minting',
	SUCCESS: 'success',
	CHANGE_WALLET: 'change_wallet',
}

const MintModal = ({ open, onClose }) => {
	const { [FLAGS.hasMinting]: canMint } = useFlags()
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const confettiCanvas = useRef(null)
	const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL)

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
	const [sourcePreview, setSourcePreview] = useState({ type: null, size: null, ext: null, src: null })
	const [putOnSale, setPutOnSale] = useState(false)
	const [price, setPrice] = useState('')
	const [currency, setCurrency] = useState('ETH')
	const [editionCount, setEditionCount] = useState(1)
	const [royaltiesPercentage, setRoyaltiesPercentage] = useState(10)
	const [notSafeForWork, setNotSafeForWork] = useState(false)
	const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
	const [transactionHash, setTransactionHash] = useState('')
	const [tokenID, setTokenID] = useState('')

	useEffect(() => {
		if (sourcePreview.type !== 'model' || window.customElements.get('model-viewer')) return
		import('@google/model-viewer')
	}, [sourcePreview.type])

	const resetForm = () => {
		setTitle('')
		setDescription('')
		setIpfsHash('')
		setSourcePreview({ type: null, size: null, ext: null, src: null })
		setPutOnSale(false)
		setPrice('')
		setCurrency('ETH')
		setEditionCount(1)
		setRoyaltiesPercentage(10)
		setNotSafeForWork(false)
		setHasAcceptedTerms(false)
		setTransactionHash('')
		setTokenID('')
		setModalPage(MODAL_PAGES.GENERAL)
	}

	const saveDraft = () => axios.post('/api/mint/draft', { title, description, number_of_copies: editionCount, nsfw: notSafeForWork, price: price || null, royalties: royaltiesPercentage, currency, ipfs_hash: ipfsHash, agreed_to_terms: hasAcceptedTerms, mime_type: sourcePreview.src ? `${sourcePreview.type}/${sourcePreview.ext}` : null })
	const markDraftMinted = () => axios.post('/api/mint/draft', { title, description, number_of_copies: editionCount, nsfw: notSafeForWork, price: price || null, royalties: royaltiesPercentage, currency, ipfs_hash: ipfsHash, agreed_to_terms: hasAcceptedTerms, mime_type: sourcePreview.src ? `${sourcePreview.type}/${sourcePreview.ext}` : null, minted: true })

	const loadDraft = async () => {
		const draft = await axios.get('/api/mint/draft').then(({ data }) => data)

		setTitle(draft.title || '')
		setDescription(draft.description || '')
		setHasAcceptedTerms(draft.agreed_to_terms || false)
		setNotSafeForWork(draft.nsfw || false)
		setPrice(draft.price || '')
		setCurrency(draft.currency_ticker || 'ETH')
		setEditionCount(parseInt(draft.number_of_copies) || 1)
		setRoyaltiesPercentage(parseInt(draft.royalties) || 10)
		setIpfsHash(draft.ipfs_hash || null)
		if (draft.ipfs_hash) setSourcePreview({ type: draft.mime_type.split('/')[0], size: '??', ext: draft.mime_type.split('/')[1], src: `https://gateway.pinata.cloud/ipfs/${draft.ipfs_hash}` })
	}

	useEffect(() => {
		loadDraft()
	}, [])

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		saveDraft().finally(() => {
			if (modalPage === MODAL_PAGES.GENERAL) return

			resetForm()
			loadDraft()
		})
		onClose()
	}

	const isValid = useMemo(() => {
		if (!canMint || !title || !hasAcceptedTerms || !editionCount || !royaltiesPercentage || !ipfsHash) return false
		if (putOnSale && (!price || !currency)) return false
		if (editionCount < 1 || editionCount > 10000 || royaltiesPercentage > 69 || royaltiesPercentage < 0) return false

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
						...(notSafeForWork ? { attributes: [{ value: 'NSFW' }] } : {}),
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
		const { biconomy, web3 } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false)).catch(error => {
			if (error !== 'Modal closed by user') throw error

			isWeb3ModalActive.current = false
			throw setModalPage(MODAL_PAGES.GENERAL)
		})
		const signerAddress = await web3.getSigner().getAddress()

		if (
			!myProfile?.wallet_addresses_v2
				?.filter(address => address.minting_enabled)
				?.map(({ address }) => address.toLowerCase())
				?.includes(signerAddress.toLowerCase())
		) {
			return setModalPage(MODAL_PAGES.CHANGE_WALLET)
		}

		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTING_CONTRACT, minterAbi, biconomy.getSignerByAddress(signerAddress))

		const { data } = await contract.populateTransaction.issueToken(signerAddress, editionCount, contentHash, 0, signerAddress, royaltiesPercentage * 100)

		const provider = biconomy.getEthersProvider()

		const transaction = await provider
			.send('eth_sendTransaction', [
				{
					data,
					from: signerAddress,
					to: process.env.NEXT_PUBLIC_MINTING_CONTRACT,
					signatureType: 'EIP712_SIGN',
				},
			])
			.catch(error => {
				if (error.code === 4001) throw setModalPage(MODAL_PAGES.GENERAL)

				if (JSON.parse(error?.body || error?.error?.body || '{}')?.error?.message?.includes('caller is not minter')) {
					alert('Your address is not approved for minting.')
					throw setModalPage(MODAL_PAGES.GENERAL)
				}

				throw error
			})

		markDraftMinted()
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
				return <CreatePage {...{ title, setTitle, description, setDescription, ipfsHash, setIpfsHash, sourcePreview, setSourcePreview, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setModalPage, hasAcceptedTerms, setHasAcceptedTerms, isValid, mintToken }} />
			case MODAL_PAGES.OPTIONS:
				return <OptionsPage {...{ editionCount, setEditionCount, royaltiesPercentage, setRoyaltiesPercentage, notSafeForWork, setNotSafeForWork }} />
			case MODAL_PAGES.LOADING:
				return <LoadingPage />
			case MODAL_PAGES.MINTING:
				return <MintingPage transactionHash={transactionHash} />
			case MODAL_PAGES.SUCCESS:
				return <SuccessPage transactionHash={transactionHash} tokenID={tokenID} shotConfetti={shotConfetti} />
			case MODAL_PAGES.CHANGE_WALLET:
				return <WalletErrorPage mintToken={mintToken} />
		}
	})(modalPage)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" static className={`fixed inset-0 overflow-y-auto ${sourcePreview.src ? 'pt-[96px] md:pt-0' : ''}`} open={open} onClose={trueOnClose}>
				<canvas ref={confettiCanvas} className="absolute inset-0 w-screen h-screen z-[11] pointer-events-none" />
				<div className="min-h-screen text-center">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-95 transition-opacity z-10" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block align-middle h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-flex flex-col md:flex-row items-stretch align-bottom rounded-t-3xl md:rounded-b-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-black dark:bg-gray-900 relative z-20 md:max-h-[85vh]">
							{sourcePreview.src && <div className="p-10 flex items-center justify-center">{sourcePreview.type == 'model' ? <model-viewer src={sourcePreview.src} autoplay camera-controls auto-rotate ar ar-modes="scene-viewer quick-look" interaction-prompt="none" /> : sourcePreview.type === 'video' ? <video src={sourcePreview.src} className="md:max-w-sm w-auto h-auto max-h-full" autoPlay loop muted /> : <img src={sourcePreview.src} className="md:max-w-sm w-auto h-auto max-h-full" />}</div>}
							<div className="bg-white dark:bg-black shadow-xl rounded-t-3xl md:rounded-b-3xl sm:max-w-lg sm:w-full flex flex-col">
								<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
									{modalPage === MODAL_PAGES.OPTIONS ? (
										<>
											<button onClick={() => setModalPage(MODAL_PAGES.GENERAL)} className="rounded-xl bg-gray-100 dark:bg-gray-800 px-5 py-4 group">
												<ChevronLeft className="w-auto h-3 transform group-hover:-translate-x-0.5 transition" />
											</button>
											<h2 className="text-gray-900 dark:text-white text-xl font-bold">Options</h2>
										</>
									) : (
										<h2 className="text-gray-900 dark:text-white text-xl font-bold">Create NFT</h2>
									)}
									<button onClick={trueOnClose} className="p-3 -my-3 hover:bg-gray-100 disabled:hidden rounded-xl transition" disabled={modalPage === MODAL_PAGES.LOADING}>
										<XIcon className="w-4 h-4" />
									</button>
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

const CreatePage = ({ title, setTitle, description, setDescription, ipfsHash, setIpfsHash, sourcePreview, setSourcePreview, putOnSale, setPutOnSale, price, setPrice, currency, setCurrency, editionCount, royaltiesPercentage, setModalPage, hasAcceptedTerms, setHasAcceptedTerms, isValid, mintToken }) => {
	return (
		<div>
			<div className="p-4 border-b border-gray-100 dark:border-gray-900 space-y-4">
				<fieldset>
					<div className="mt-1 rounded-md shadow-sm -space-y-px">
						<div>
							<label htmlFor="title" className="sr-only">
								Title
							</label>
							<input type="text" name="title" id="title" className="px-4 py-3 relative block w-full rounded-none rounded-t-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 focus:z-10 border border-b-0 border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} />
						</div>
						<div>
							<label htmlFor="description" className="sr-only">
								Description
							</label>
							<TextareaAutosize rows={2} maxRows={6} name="description" id="description" className="px-4 py-3 text-sm relative block w-full rounded-none rounded-b-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 focus:z-10 border border-gray-300 dark:border-gray-700 resize-none focus:outline-none focus-visible:ring" placeholder="Description (optional)" value={description} onChange={event => setDescription(event.target.value)} />
						</div>
					</div>
				</fieldset>
				<IpfsUpload ipfsHash={ipfsHash} onChange={setIpfsHash} fileDetails={sourcePreview} setFileDetails={setSourcePreview} />
			</div>
			<div className="p-4 border-b border-gray-100 dark:border-gray-900">
				<div className="flex items-center justify-between space-x-4">
					<div>
						<p className="font-semibold text-gray-900 dark:text-white">Sell</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter a fixed price to allow people to purchase your NFT.</p>
					</div>
					<Switch value={putOnSale} onChange={setPutOnSale} disabled />
				</div>
				<Transition show={putOnSale} as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-y-full opacity-0" enterTo="translate-y-0 opacity-100">
					<div className="mt-4 flex items-stretch justify-between space-x-2">
						<input className="flex-1 px-4 relative block w-full rounded-xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring font-medium" placeholder="Price" value={price} onChange={event => setPrice(event.target.value)} />
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
			<button onClick={() => setModalPage(MODAL_PAGES.OPTIONS)} className="p-4 border-b border-gray-100 dark:border-gray-900 w-full text-left focus-visible:ring group">
				<div className="flex items-center justify-between space-x-4">
					<div>
						<p className="font-semibold text-gray-900 dark:text-white">Options</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{editionCount == 1 ? 'Unique' : editionCount} Edition{editionCount == 1 ? '' : 's'} / {royaltiesPercentage}% Royalties
						</p>
					</div>
					<ChevronRight className="w-auto h-4 transform -translate-x-1 group-hover:translate-x-0 transition" />
				</div>
			</button>
			<div className="p-4 border-b border-gray-100 dark:border-gray-900">
				<Checkbox value={hasAcceptedTerms} onChange={setHasAcceptedTerms}>
					I have the rights to publish this artwork, and understand it will be minted on the <span className="font-semibold text-gray-900 dark:text-white">Polygon</span> network.
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
			<div className="p-4 border-b border-gray-100 dark:border-gray-900">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900 dark:text-white">Number of Editions</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">1 by default</p>
					</div>
					<input type="number" min="1" max="10000" className="px-4 py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring text-right" value={editionCount} onChange={event => setEditionCount(event.target.value)} />
				</div>
			</div>
			<div className="p-4 border-b border-gray-100 dark:border-gray-900">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900 dark:text-white">Royalties</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">10% by default</p>
					</div>
					<div className="flex items-center space-x-2">
						<input type="number" max="69" step="10" className="px-4 max-w-[60px] py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring no-spinners font-medium text-right" value={royaltiesPercentage} onChange={event => setRoyaltiesPercentage(event.target.value)} />
						<PercentageIcon className="w-4 h-4 text-gray-700 dark:text-gray-500" />
					</div>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900 dark:text-white">Explicit Content</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">18+</p>
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
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">We're preparing your NFT</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs">We'll ask you to confirm with your preferred wallet shortly</p>
			</div>
		</div>
	)
}

const MintingPage = ({ transactionHash }) => {
	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">Your NFT is being minted on the Polygon network.</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">Feel free to navigate away from this screen</p>
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

	const profileHref = useMemo(() => `/${myProfile?.username || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.ens_domain || myProfile?.wallet_addresses_excluding_email_v2?.[0]?.address || user?.publicAddress}`, [myProfile, user])

	useEffect(() => {
		shotConfetti()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const visitProfile = event => {
		event.preventDefault()

		window.location = profileHref
	}

	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<p className="font-medium text-5xl">🎉</p>
			<p className="font-medium text-gray-900 dark:text-white text-center">
				Your NFT has been minted on the Polygon network, you can now view it on your{' '}
				<a href={profileHref} onClick={visitProfile} className="font-semibold focus:outline-none focus-visible:underline">
					Showtime profile &rarr;
				</a>
			</p>
			<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
				<Button style="tertiary" as="a" href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<span className="text-sm font-medium">View on Polygon Scan</span>
				</Button>
				<a className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full space-x-2" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://tryshowtime.com/t/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${tokenID}`)}&text=${encodeURIComponent('🌟 Just minted an awesome new NFT on @tryShowtime!!\n')}`} target="_blank" rel="noreferrer">
					<TwitterIcon className="w-4 h-auto" />
					<span className="text-sm font-medium">Share it on Twitter</span>
				</a>
			</div>
		</div>
	)
}

const WalletErrorPage = ({ mintToken }) => {
	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 text-center">The wallet you selected isn't linked to your profile.</p>
			<p className="font-medium text-gray-900 text-center max-w-xs mx-auto">
				You can link it from the{' '}
				<Link href="/wallet">
					<a className="font-semibold focus:outline-none focus-visible:underline">wallets page</a>
				</Link>
				, or you can{' '}
				<button onClick={mintToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
		</div>
	)
}

export default MintModal
