import { Dialog, Transition } from '@headlessui/react'
import Button from '../Buttons/Button'
import { useState, Fragment } from 'react'
import Dropdown from '../Dropdown'
import { useMemo } from 'react'
import { ethers } from 'ethers'
import { getBiconomy } from '@/lib/biconomy'
import getWeb3Modal from '@/lib/web3Modal'
import minterAbi from '@/data/ShowtimeMT.json'
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
import { DEFAULT_PROFILE_PIC, LIST_CURRENCIES } from '@/lib/constants'
import useSWR from 'swr'
import backend from '@/lib/backend'
import { formatAddressShort, truncateWithEllipses } from '@/lib/utilities'
import BadgeIcon from '@/components/Icons/BadgeIcon'
import { parseEther } from '@ethersproject/units'

const MODAL_PAGES = {
	GENERAL: 'general',
	LOADING: 'loading',
	PERMIT_LOADING: 'permit_loading',
	MINTING: 'minting',
	SUCCESS: 'success',
	CHANGE_WALLET: 'change_wallet',
}

const ListModal = ({ open, onClose, token }) => {
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const confettiCanvas = useRef(null)
	const [modalVisibility, setModalVisibility] = useState(true)
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
	const [currency, setCurrency] = useState(LIST_CURRENCIES.TKN)
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

	const updateModalVisibility = () => {
		if (isWeb3ModalActive.current || modalPage === MODAL_PAGES.LOADING) return

		setModalVisibility(false)
	}

	const afterModalCloseAnimation = () => {
		trueOnClose()
		setModalVisibility(true)
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
		const mintContract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTING_CONTRACT, minterAbi, biconomy.getSignerByAddress(signerAddress))

		const provider = biconomy.getEthersProvider()

		if (!(await mintContract.isApprovedForAll(signerAddress, process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT))) {
			const { data } = await mintContract.populateTransaction.setApprovalForAll(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT, true)

			const transaction = await provider.send('eth_sendTransaction', [{ data, from: signerAddress, to: process.env.NEXT_PUBLIC_MINTING_CONTRACT, signatureType: 'EIP712_SIGN' }])
			setTransactionHash(transaction)

			await new Promise(resolve =>
				provider.once(transaction, () => {
					setModalPage(MODAL_PAGES.PERMIT_LOADING)
					resolve()
				})
			)
		}

		const { data } = await contract.populateTransaction.createSale(token.token_id, editionCount, parseEther(price) /* assuming 18 decimals */, currency)

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
				if (error.code === 4001 || error.message == 'User declined transaction') throw setModalPage(MODAL_PAGES.GENERAL)

				throw error
			})

		setTransactionHash(transaction)

		provider.once(transaction, () => setModalPage(MODAL_PAGES.SUCCESS))

		setModalPage(MODAL_PAGES.MINTING)
	}

	const renderedPage = (type => {
		switch (type) {
			case MODAL_PAGES.GENERAL:
				return <ListPage {...{ token, price, setPrice, currency, setCurrency, editionCount, setEditionCount, maxTokens: ownershipData?.owned_count || 1, isValid, listToken }} onClose={updateModalVisibility} />
			case MODAL_PAGES.LOADING:
				return <LoadingPage />
			case MODAL_PAGES.MINTING:
				return <MintingPage transactionHash={transactionHash} />
			case MODAL_PAGES.SUCCESS:
				return <SuccessPage token={token} transactionHash={transactionHash} shotConfetti={shotConfetti} />
			case MODAL_PAGES.CHANGE_WALLET:
				return <WalletErrorPage listToken={listToken} />
			case MODAL_PAGES.PERMIT_LOADING:
				return <PermitLoadingPage transactionHash={transactionHash} />
		}
	})(modalPage)

	return (
		<Transition.Root show={open && modalVisibility} as={Fragment} afterLeave={afterModalCloseAnimation}>
			<Dialog as="div" static className="fixed inset-0 overflow-y-auto z-1 pt-[96px] md:pt-0" open={open} onClose={updateModalVisibility}>
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
							<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
								<h2 className="text-gray-900 dark:text-white text-lg font-bold">List NFT</h2>
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

const ListPage = ({ token, price, setPrice, currency, setCurrency, editionCount, setEditionCount, maxTokens, isValid, listToken, onClose }) => {
	return (
		<>
			<div className="flex-1 overflow-y-auto">
				{token && (
					<>
						<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center space-x-4">
							{token.source_url && <div className="w-auto h-20">{token.mime_type.startsWith('model') ? <model-viewer src={token.source_url} autoplay camera-controls auto-rotate ar ar-modes="scene-viewer quick-look" interaction-prompt="none" /> : token.mime_type.startsWith('video') ? <video src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" autoPlay loop muted /> : <img src={token.source_url} className="md:max-w-sm w-auto h-auto max-h-full" />}</div>}
							<div>
								<p className="font-bold text-gray-900 dark:text-white">{token?.token_name}</p>
								{token?.token_description && <p className="text-gray-900 dark:text-gray-300 font-medium text-sm">{token.token_description}</p>}
							</div>
						</div>
						<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center">
							<div className="flex items-center space-x-2">
								<img alt={token.creator_name} src={token.creator_img_url ? token.creator_img_url : DEFAULT_PROFILE_PIC} className="rounded-full w-8 h-8" />
								<div>
									<p className="font-medium text-gray-700 dark:text-gray-400 text-xs">Creator</p>
									<div className="flex items-center space-x-1 -mt-0.5">
										<p className="text-gray-900 dark:text-white font-semibold text-sm">{token.creator_name === token.creator_address ? formatAddressShort(token.creator_address) : truncateWithEllipses(token.creator_name, 22)}</p>
										{token.creator_verified == 1 && <BadgeIcon className="w-3.5 h-3.5 text-black dark:text-white" bgClass="text-white dark:text-black" />}
									</div>
								</div>
							</div>
							<hr className="mx-8 border-0 border-r-px dark:border-gray-800" />
						</div>
					</>
				)}
				<div className="p-4 border-b border-gray-100 dark:border-gray-900">
					<div>
						<p className="font-semibold text-gray-900 dark:text-white space-x-1 flex items-center">
							<span>Sell</span>
						</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter a fixed price to allow people to purchase your NFT</p>
					</div>
					<div className="mt-4 flex items-stretch justify-between space-x-2">
						<input className="flex-1 px-4 relative block w-full rounded-xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring font-medium" placeholder="Price" value={price} onChange={event => setPrice(event.target.value)} />
						<Dropdown className="flex-1" value={currency} onChange={setCurrency} options={Object.entries(LIST_CURRENCIES).map(([ticker, address]) => ({ label: ticker, value: address }))} />
					</div>
				</div>
				<div className="p-4 border-b border-gray-100 dark:border-gray-900">
					<div className="flex items-center justify-between">
						<div className="flex-1 mr-4">
							<p className="font-semibold text-gray-900 dark:text-white">Copies</p>
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300">1 by default (you own {maxTokens})</p>
						</div>
						<input type="number" min="1" max={maxTokens} className="px-4 py-3 flex-1 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring text-right" style={{ '-moz-appearance': 'textfield' }} value={editionCount} onChange={event => (event.target.value > maxTokens ? setEditionCount(maxTokens) : event.target.value < 1 ? setEditionCount(1) : setEditionCount(parseInt(event.target.value)))} />
					</div>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" onClick={onClose}>
						Cancel
					</Button>
					<Button style="primary" disabled={!isValid} onClick={listToken}>
						List on Showtime
					</Button>
				</div>
			</div>
		</>
	)
}

const LoadingPage = ({ transactionHash }) => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div tabIndex="0" className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center border-b border-gray-100">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p>We'll ask you to sign with your wallet shortly.</p>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" disabled={true}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Listing...
					</Button>
				</div>
			</div>
			<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on PolygonScan</span>
			</Button>
		</div>
	)
}

const PermitLoadingPage = () => {
	return (
		<div tabIndex="0" className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">We're preparing your account to sell Showtime NFTs</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">You only need to do this once, and it shouldn't take more than a few seconds.</p>
			</div>
		</div>
	)
}

const MintingPage = ({ transactionHash }) => {
	return (
		<div className="flex flex-col min-h-[344px]">
			<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center border-b border-gray-100">
				<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
				<div className="space-y-1 text-gray-900 dark:text-white  text-sm text-center font-medium leading-[1.4rem]">
					<p>Your NFT is being listed on Showtime.</p>
					<p>Feel free to navigate away from this screen.</p>
				</div>
				<Button style="tertiary" as="a" href={`https://${process.env.NEXT_PUBLIC_CHAIN_ID === 'mumbai' ? 'mumbai.' : ''}polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
					<PolygonIcon className="w-4 h-4" />
					<p className="text-sm font-medium">View on PolygonScan</p>
				</Button>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between">
					<Button style="tertiary" disabled={true}>
						Cancel
					</Button>
					<Button style="primary" disabled={true}>
						Listing...
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
		<div className="p-12 space-y-10 flex-1 flex flex-col items-center justify-center  min-h-[344px]">
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
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none  min-h-[344px]">
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
