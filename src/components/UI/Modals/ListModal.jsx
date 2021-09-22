import { Dialog, Transition } from '@headlessui/react'
import Button from '../Buttons/Button'
import { useState, Fragment } from 'react'
import Dropdown from '../Dropdown'
import { useMemo } from 'react'
import axios from '@/lib/axios'
import { v4 as uuid } from 'uuid'
import { ethers } from 'ethers'
import { getBiconomy } from '@/lib/biconomy'
import getWeb3Modal from '@/lib/web3Modal'
import marketplaceAbi from '@/data/ERC1155Sale.json'
import PolygonIcon from '@/components/Icons/PolygonIcon'
import TwitterIcon from '@/components/Icons/Social/TwitterIcon'
import { useRef } from 'react'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { useTheme } from 'next-themes'
import useProfile from '@/hooks/useProfile'
import { ExclamationIcon } from '@heroicons/react/outline'
import XIcon from '@/components/Icons/XIcon'
import { LIST_CURRENCIES } from '@/lib/constants'
import useSWR from 'swr'
import backend from '@/lib/backend'

const MODAL_PAGES = {
	GENERAL: 'general',
	LOADING: 'loading',
	MINTING: 'minting',
	SUCCESS: 'success',
	CHANGE_WALLET: 'change_wallet',
}

const ListModal = ({ open, onClose, token }) => {
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const confettiCanvas = useRef(null)
	const [modalPage, setModalPage] = useState(MODAL_PAGES.GENERAL)
	const { data: ownershipData } = useSWR(
		() => open && myProfile && `/v1/owned_quantity?nft_id=${token.nft_id}&profile_id=${myProfile.profile_id}`,
		url => backend.get(url).then(res => res.data?.data)
	)

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

	const [price, setPrice] = useState('')
	const [currency, setCurrency] = useState(LIST_CURRENCIES.TEST)
	const [editionCount, setEditionCount] = useState(1)
	const [transactionHash, setTransactionHash] = useState('')

	useEffect(() => {
		if (!token?.mime_type?.startsWith('model') || window.customElements.get('model-viewer')) return
		import('@google/model-viewer')
	}, [token?.mime_type])

	const resetForm = () => {
		setPrice('')
		setCurrency(LIST_CURRENCIES.TEST)
		setEditionCount(1)
		setTransactionHash('')
		setModalPage(MODAL_PAGES.GENERAL)
	}

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		resetForm()
		onClose()
	}

	const isValid = useMemo(() => {
		if (!price || !currency) return false
		if (editionCount < 1 || editionCount > 10000) return false

		return true
	}, [price, currency, editionCount])

	const listToken = async () => {
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

		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, marketplaceAbi, biconomy.getSignerByAddress(signerAddress))

		const { data } = await contract.populateTransaction.createSale(token.token_id, editionCount, price, currency)

		const provider = biconomy.getEthersProvider()

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

		setModalPage(MODAL_PAGES.MINTING)
	}

	const renderedPage = (type => {
		switch (type) {
			case MODAL_PAGES.GENERAL:
				return <ListPage {...{ token, price, setPrice, currency, setCurrency, editionCount, setEditionCount, maxTokens: ownershipData?.owned_count || 1, isValid, listToken }} />
			case MODAL_PAGES.LOADING:
				return <LoadingPage />
			case MODAL_PAGES.MINTING:
				return <MintingPage transactionHash={transactionHash} />
			case MODAL_PAGES.SUCCESS:
				return <SuccessPage token={token} transactionHash={transactionHash} shotConfetti={shotConfetti} />
			case MODAL_PAGES.CHANGE_WALLET:
				return <WalletErrorPage listToken={listToken} />
		}
	})(modalPage)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" static className="fixed inset-0 overflow-y-auto z-1 pt-[96px] md:pt-0" open={open} onClose={trueOnClose}>
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
							{token && token.source_url && <div className="p-10 flex items-center justify-center">{token.mime_type.startsWith('model') ? <model-viewer src={token.source_url} autoplay camera-controls auto-rotate ar ar-modes="scene-viewer quick-look" interaction-prompt="none" /> : token.mime_type.startsWith('video') ? <video src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" autoPlay loop muted /> : <img src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" />}</div>}
							<div className="bg-white dark:bg-black shadow-xl rounded-t-3xl md:rounded-b-3xl sm:max-w-lg sm:w-full flex flex-col">
								<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
									<h2 className="text-gray-900 dark:text-white text-xl font-bold">Create NFT</h2>
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

const ListPage = ({ token, price, setPrice, currency, setCurrency, editionCount, setEditionCount, maxTokens, isValid, listToken }) => {
	return (
		<>
			<div className="flex-1 overflow-y-auto">
				<div className="p-4 border-b border-gray-100 dark:border-gray-900">
					<div>
						<p className="font-semibold text-gray-900 dark:text-white space-x-1 flex items-center">
							<span>Sell</span>
						</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter a fixed price to allow people to purchase your NFT.</p>
					</div>
					<div className="mt-4 flex items-stretch justify-between space-x-2">
						<input className="flex-1 px-4 relative block w-full rounded-xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring font-medium" placeholder="Price" value={price} onChange={event => setPrice(event.target.value)} />
						<Dropdown className="flex-1" value={currency} onChange={setCurrency} options={Object.entries(LIST_CURRENCIES).map(([ticker, address]) => ({ label: ticker, value: address }))} />
					</div>
				</div>
				<div className="p-4 border-b border-gray-100 dark:border-gray-900">
					<div className="flex items-center justify-between">
						<div className="flex-1 mr-4">
							<p className="font-semibold text-gray-900 dark:text-white">Number of Editions</p>
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300">1 by default</p>
						</div>
						<input type="number" min="1" max={maxTokens} className="px-4 py-3 max-w-[60px] relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring text-right" style={{ '-moz-appearance': 'textfield' }} value={editionCount} onChange={event => (event.target.value > maxTokens ? setEditionCount(maxTokens) : event.target.value < 1 ? setEditionCount(1) : setEditionCount(parseInt(event.target.value)))} />
					</div>
				</div>
				<div className="p-4 border-b border-gray-100 dark:border-gray-900">
					<p className="font-bold text-gray-900">{token?.token_name}</p>
					{token?.token_description && <p className="text-gray-900 font-medium text-sm mt-4">{token.token_description}</p>}
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-end">
					<Button style="primary" disabled={!isValid} onClick={listToken}>
						List your NFT
					</Button>
				</div>
			</div>
		</>
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
				<p className="font-medium text-gray-900 dark:text-white text-center">Your NFT is being listed on Showtime.</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">Feel free to navigate away from this screen.</p>
			</div>
			<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on PolygonScan</span>
			</Button>
		</div>
	)
}

const SuccessPage = ({ transactionHash, token, shotConfetti }) => {
	const tokenURL = `/t/${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'polygon'}/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${tokenID}`

	useEffect(() => {
		shotConfetti()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const visitTokenPage = event => {
		event.preventDefault()

		window.location = tokenURL
	}

	return (
		<div className="p-12 space-y-10 flex-1 flex flex-col items-center justify-center">
			<p className="font-medium text-5xl">🎉</p>
			<p className="font-medium text-gray-900 dark:text-white text-center !mt-6">Your NFT has been successfully listed!</p>
			<Button style="primary" as="a" href={tokenURL} onClick={visitTokenPage} className="!mt-6">
				View on Showtime &rarr;
			</Button>
			<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
				<a className="flex items-center bg-blue-50 dark:bg-blue-900 text-blue-500 dark:text-blue-200 px-4 py-2 rounded-full space-x-2" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://tryshowtime.com/t/${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai' : 'polygon'}/${process.env.NEXT_PUBLIC_MINTING_CONTRACT}/${token.token_id}`)}&text=${encodeURIComponent('🌟 Just listed an awesome NFT on @tryShowtime!!\n')}`} target="_blank" rel="noreferrer">
					<TwitterIcon className="w-4 h-auto" />
					<span className="text-sm font-medium">Share on Twitter</span>
				</a>
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<span className="text-sm font-medium">PolygonScan</span>
				</Button>
			</div>
		</div>
	)
}

const WalletErrorPage = ({ listToken }) => {
	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-300" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 dark:text-white text-center">The wallet you selected doesn't own this NFT.</p>
			<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">
				Please{' '}
				<button onClick={listToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
		</div>
	)
}

export default ListModal
