import { Dialog, Transition } from '@headlessui/react'
import Button from '../Buttons/Button'
import { ethers } from 'ethers'
import { getBiconomy } from '@/lib/biconomy'
import getWeb3Modal from '@/lib/web3Modal'
import marketplaceAbi from '@/data/ERC1155Sale.json'
import PolygonIcon from '@/components/Icons/PolygonIcon'
import { useRef, useState, Fragment, useEffect, useContext } from 'react'
import { useTheme } from 'next-themes'
import iercPermit20Abi from '@/data/IERC20Permit.json'
import useProfile from '@/hooks/useProfile'
import { ExclamationIcon } from '@heroicons/react/outline'
import XIcon from '@/components/Icons/XIcon'
import { DEFAULT_PROFILE_PIC, LIST_CURRENCIES } from '@/lib/constants'
import { formatAddressShort, signTokenPermit, switchToChain, truncateWithEllipses } from '@/lib/utilities'
import BadgeIcon from '@/components/Icons/BadgeIcon'
import confetti from 'canvas-confetti'
import Link from 'next/link'
import axios from '@/lib/axios'
import AppContext from '@/context/app-context'

const MODAL_PAGES = {
	GENERAL: 'general',
	LOADING: 'loading',
	PROCESSING: 'processing',
	SUCCESS: 'success',
	CHANGE_WALLET: 'change_wallet',
	NO_BALANCE: 'no_balance',
	NEEDS_ALLOWANCE: 'needs_allowance',
	PROCESSING_ALLOWANCE: 'processing_allowance',
}

const BuyModal = ({ open, onClose, token }) => {
	const { myProfile } = useProfile()
	const { loginModalOpen, setLoginModalOpen } = useContext(AppContext)
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const confettiCanvas = useRef(null)
	const [modalVisibility, setModalVisibility] = useState(true)
	const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL)
	const [quantity, setQuantity] = useState(1)
	const [transactionHash, setTransactionHash] = useState('')

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

	useEffect(() => {
		if (!token?.mime_type?.startsWith('model') || window.customElements.get('model-viewer')) return
		import('@google/model-viewer')
	}, [token?.mime_type])

	const resetForm = () => {
		setTransactionHash('')
		setModalPage(MODAL_PAGES.GENERAL)
	}

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		resetForm()
		onClose()
	}

	const updateModalVisibility = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		setModalVisibility(false)
	}

	const afterModalCloseAnimation = () => {
		trueOnClose()
		setModalVisibility(true)
	}

	const buyToken = async () => {
		setModalPage(MODAL_PAGES.LOADING)

		const web3Modal = getWeb3Modal({ theme: resolvedTheme })
		isWeb3ModalActive.current = true
		const { biconomy, web3 } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false)).catch(error => {
			if (error !== 'Modal closed by user') throw error

			isWeb3ModalActive.current = false
			throw setModalPage(MODAL_PAGES.GENERAL)
		})
		const signerAddress = await web3.getSigner().getAddress()

		if (!myProfile?.wallet_addresses_v2?.map(({ address }) => address.toLowerCase())?.includes(signerAddress.toLowerCase())) {
			return setModalPage(MODAL_PAGES.CHANGE_WALLET)
		}

		const provider = biconomy.getEthersProvider()

		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, marketplaceAbi, biconomy.getSignerByAddress(signerAddress))
		const ercContract = new ethers.Contract(LIST_CURRENCIES[token.listing.currency], iercPermit20Abi, biconomy.getSignerByAddress(signerAddress))

		const basePrice = ethers.utils.parseUnits(token.listing.min_price.toString(), 18)

		if (!(await ercContract.balanceOf(signerAddress)).gt(basePrice)) {
			return setModalPage(MODAL_PAGES.NO_BALANCE)
		}

		if (!(await ercContract.allowance(signerAddress, process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT)).gt(basePrice)) {
			return setModalPage(MODAL_PAGES.NEEDS_ALLOWANCE)
		}

		const { data } = await contract.populateTransaction.buyFor(token.listing.sale_identifier, quantity, signerAddress)

		const transaction = await provider
			.send('eth_sendTransaction', [
				{
					data,
					from: signerAddress,
					to: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
					signatureType: 'EIP712_SIGN',
				},
			])
			.catch(error => {
				if (error.code === 4001) throw setModalPage(MODAL_PAGES.GENERAL)

				throw error
			})

		setTransactionHash(transaction)

		provider.once(transaction, () => setModalPage(MODAL_PAGES.SUCCESS))

		setModalPage(MODAL_PAGES.PROCESSING)
	}

	useEffect(() => {
		if (myProfile || !open) return

		setLoginModalOpen(true)
	}, [open])
	useEffect(() => {
		if (myProfile || !open || loginModalOpen) return

		trueOnClose()
	}, [loginModalOpen])

	if (!myProfile) return null

	const renderedPage = (type => {
		switch (type) {
			case MODAL_PAGES.GENERAL:
				return <BuyPage token={token} quantity={quantity} setQuantity={setQuantity} buyToken={buyToken} onClose={updateModalVisibility} />
			case MODAL_PAGES.LOADING:
				return <LoadingPage />
			case MODAL_PAGES.PROCESSING:
				return <MintingPage transactionHash={transactionHash} onClose={updateModalVisibility} />
			case MODAL_PAGES.SUCCESS:
				return <SuccessPage token={token} transactionHash={transactionHash} shotConfetti={shotConfetti} />
			case MODAL_PAGES.CHANGE_WALLET:
				return <WalletErrorPage buyToken={buyToken} />
			case MODAL_PAGES.NO_BALANCE:
				return <InvalidBalancePage token={token} buyToken={buyToken} setModalPage={setModalPage} />
			case MODAL_PAGES.NEEDS_ALLOWANCE:
				return <AllowanceRequiredPage token={token} isWeb3ModalActive={isWeb3ModalActive} setTransactionHash={setTransactionHash} setModalPage={setModalPage} buyToken={buyToken} />
			case MODAL_PAGES.PROCESSING_ALLOWANCE:
				return <AllowanceProcessingPage transactionHash={transactionHash} onClose={updateModalVisibility} />
		}
	})(modalPage)

	return (
		<Transition.Root show={open && modalVisibility} as={Fragment} afterLeave={afterModalCloseAnimation}>
			<Dialog static className="fixed xs:inset-0 overflow-y-auto z-1 pt-[96px] md:pt-0 w-full modal-mobile-position" open={open} onClose={updateModalVisibility}>
				<div className="bg-white dark:bg-black z-20 modal-mobile-gap" />
				<canvas ref={confettiCanvas} className="absolute inset-0 w-screen h-screen z-[11] pointer-events-none" />
				<div className="min-h-screen text-center">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-95 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block align-middle h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom rounded-t-3xl sm:rounded-b-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-white dark:bg-black shadow-xl sm:max-w-lg w-full">
							<div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
								<h2 className="text-gray-900 dark:text-white text-lg font-bold">Buy NFT</h2>
								<button onClick={updateModalVisibility} className="p-3 -my-3 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:hidden rounded-full transition bg-gray-100" disabled={modalPage === MODAL_PAGES.LOADING}>
									<XIcon className="w-4 h-4" />
								</button>
							</div>
							{renderedPage}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const BuyPage = ({ token, quantity, setQuantity, buyToken, onClose }) => {
	return (
		<>
			<div className="flex-1 overflow-y-auto">
				{token && (
					<>
						<div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-4">
							{token.source_url && <div className="w-auto h-20">{token.mime_type.startsWith('model') ? <model-viewer src={token.source_url} autoplay camera-controls auto-rotate ar ar-modes="scene-viewer quick-look" interaction-prompt="none" /> : token.mime_type.startsWith('video') ? <video src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" autoPlay loop muted /> : <img src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" />}</div>}
							<div>
								<p className="font-semibold text-gray-900 dark:text-white">{token?.token_name}</p>
								<p className="text-gray-600 dark:text-gray-400 font-bold text-sm">
									{parseFloat(token.listing.min_price)} ${token.listing.currency}
								</p>
							</div>
						</div>
						<div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
							<div className="flex items-center space-x-2">
								<img alt={token.creator_name} src={token.creator_img_url ? token.creator_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
								<div>
									<p className="font-medium text-gray-700 dark:text-gray-400 text-xs">Created By</p>
									<div className="flex items-center space-x-1 -mt-0.5">
										<p className="text-gray-900 dark:text-white font-semibold text-sm">{token.creator_name === token.creator_address ? formatAddressShort(token.creator_address) : truncateWithEllipses(token.creator_name, 22)}</p>
										{token.creator_verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" tickClass="text-white dark:text-black" />}
									</div>
								</div>
							</div>
							<hr className="mx-8 border-0 border-r-px dark:border-gray-800" />

							<div className="flex items-center space-x-2">
								<img alt={token.listing.name} src={token.listing.img_url ? token.listing.img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
								<div>
									<p className="font-medium text-gray-700 dark:text-gray-400 text-xs">Listed By</p>
									<div className="flex items-center space-x-1 -mt-0.5">
										<p className="text-gray-900 dark:text-white font-semibold text-sm">{token.listing.name === token.listing.address ? formatAddressShort(token.listing.name) : truncateWithEllipses(token.listing.name, 22)}</p>
										{token.listing.verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" tickClass="text-white dark:text-black" />}
									</div>
								</div>
							</div>
						</div>

						<div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
							<p className="text-gray-600 dark:text-white text-xs font-semibold">
								{token.listing.quantity}/{token.listing.total_edition_quantity} available
							</p>
							<p className="text-gray-600 dark:text-white text-xs font-semibold">{parseInt(token.listing.royalty_percentage)}% Royalties</p>
						</div>
						<div className="p-4 border-b border-gray-200 dark:border-gray-800">
							<div className="flex items-center justify-between space-x-4">
								<div className="flex-1">
									<p className="font-semibold text-gray-900 dark:text-white">Quantity</p>
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">1 by default</p>
								</div>
								<input type="number" min="1" max={token.listing.quantity} placeholder="1" className="px-4 py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring min-w-[60px] no-spinners text-right" value={quantity} onChange={event => (event.target.value < 1 || event.target.value.trim() == '' ? setQuantity(1) : event.target.value > token.listing.total_listed_quantity ? setQuantity(token.listing.total_listed_quantity) : setQuantity(parseInt(event.target.value)))} />
							</div>
						</div>
						<div className="p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<img className="rounded-full w-5 h-5" src="https://storage.googleapis.com/showtime-cdn/showtime-icon-sm.jpg" />
								<span className="text-gray-600 dark:text-gray-400 text-xs font-semibold">Showtime NFT</span>
							</div>
							<p className="text-gray-600 dark:text-gray-400 text-xs font-semibold">{token.listing.total_edition_quantity} Editions</p>
						</div>
					</>
				)}
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" onClick={onClose}>
						Cancel
					</Button>
					<Button style="primary" onClick={buyToken}>
						Checkout
					</Button>
				</div>
			</div>
		</>
	)
}

const LoadingPage = () => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div tabIndex="0" className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p>We're preparing the sale.</p>
					<p>We'll ask you to confirm with your preferred wallet shortly.</p>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" disabled={true}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Preparing...
					</Button>
				</div>
			</div>
		</div>
	)
}

const MintingPage = ({ transactionHash, onClose }) => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p>Your NFT is currently being purchased.</p>
					<p>Feel free to navigate away from this screen.</p>
				</div>
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<p className="text-sm font-medium">View on PolygonScan</p>
				</Button>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" onClick={onClose}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Purchasing...
					</Button>
				</div>
			</div>
		</div>
	)
}

const SuccessPage = ({ transactionHash, token, shotConfetti }) => {
	const tokenURL = `/t/${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'polygon'}/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${token.token_id}`

	useEffect(() => {
		shotConfetti()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const visitTokenPage = event => {
		event.preventDefault()

		window.location = tokenURL
	}

	return (
		<div className="p-12 space-y-10 flex-1 flex flex-col items-center justify-center min-h-[344px]">
			<p className="font-medium text-5xl">🎉</p>
			<p className="font-medium text-gray-900 dark:text-white text-center !mt-6">Your NFT has been successfully purchased!</p>
			<Button style="primary" as="a" href={tokenURL} onClick={visitTokenPage} className="!mt-6">
				View on Showtime &rarr;
			</Button>
			<div className="flex items-center justify-center">
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<p className="text-sm font-medium">PolygonScan</p>
				</Button>
			</div>
		</div>
	)
}

const WalletErrorPage = ({ buyToken }) => {
	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none min-h-[344px]">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 dark:text-white text-center">The wallet you selected isn't linked to your profile.</p>
			<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
				You can link it from the{' '}
				<Link href="/wallet">
					<a className="font-semibold focus:outline-none focus-visible:underline">wallets page</a>
				</Link>
				, or you can{' '}
				<button onClick={buyToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
		</div>
	)
}

const InvalidBalancePage = ({ buyToken, setModalPage, token }) => {
	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none min-h-[344px]">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 dark:text-white text-center">You don't have enough ${token.listing.currency} on your wallet.</p>
			<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
				You can{' '}
				<button onClick={() => setModalPage(MODAL_PAGES.GENERAL)} className="font-semibold focus:outline-none focus-visible:underline">
					go back
				</button>
				, or{' '}
				<button onClick={buyToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
			<p className="font-medium text-sm text-gray-600 dark:text-white text-center max-w-xs mx-auto">
				Keep in mind that Showtime uses Polygon, so you may have to{' '}
				<a className="font-semibold" href="https://wallet.polygon.technology/bridge" target="_blank" rel="noreferrer">
					bridge any Ethereum assets
				</a>{' '}
				before using them.
			</p>
		</div>
	)
}

const AllowanceRequiredPage = ({ token, isWeb3ModalActive, setModalPage, setTransactionHash, buyToken }) => {
	const { resolvedTheme } = useTheme()

	const grantAllowance = async () => {
		setModalPage(MODAL_PAGES.LOADING)
		const web3Modal = getWeb3Modal({ theme: resolvedTheme })
		isWeb3ModalActive.current = true
		const { web3, biconomy } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false)).catch(error => {
			if (error !== 'Modal closed by user') throw error

			isWeb3ModalActive.current = false
			throw setModalPage(MODAL_PAGES.GENERAL)
		})
		const signerAddress = await web3.getSigner().getAddress()
		const provider = biconomy.getEthersProvider()

		const ercContract = new ethers.Contract(LIST_CURRENCIES[token.listing.currency], iercPermit20Abi, biconomy.getSignerByAddress(signerAddress))
		const tokenPermit = await signTokenPermit(web3, ercContract, LIST_CURRENCIES[token.listing.currency]).catch(async error => {
			if (!error.message.includes('must match the active chainId')) throw error

			await switchToChain(web3, 80001, { chainId: `0x${(80001).toString(16)}`, chainName: 'Mumbai Testnet', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://rpc-mumbai.maticvigil.com/'], blockExplorerUrls: ['https://mumbai.polygonscan.com/'] })
			const tokenPermit = await signTokenPermit(web3, ercContract, LIST_CURRENCIES[token.listing.currency])
			await switchToChain(web3, 1)

			return tokenPermit
		})
		const transaction = await axios.post('/api/marketplace/permit', tokenPermit).then(res => res.data)

		setTransactionHash(transaction)
		setModalPage(MODAL_PAGES.PROCESSING_ALLOWANCE)

		provider.once(transaction, buyToken)
	}

	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none min-h-[344px]">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 dark:text-white text-center">To buy this NFT, we need permission to spend your ${token.listing.currency}.</p>
			<div className="flex items-center justify-center">
				<Button style="primary" onClick={grantAllowance}>
					Grant Permission
				</Button>
			</div>
		</div>
	)
}

const AllowanceProcessingPage = ({ transactionHash, onClose }) => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center min-h-[344px]">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p>We're processing your allowance approval.</p>
					<p>This shouldn't take more than a few seconds, but feel free to leave the page and come back later!</p>
				</div>
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<p className="text-sm font-medium">View on PolygonScan</p>
				</Button>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" onClick={onClose}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Processing...
					</Button>
				</div>
			</div>
		</div>
	)
}

export default BuyModal
