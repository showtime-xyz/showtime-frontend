import useProfile from '@/hooks/useProfile'
import axios from '@/lib/axios'
import { getBiconomy } from '@/lib/biconomy'
import getWeb3Modal from '@/lib/web3Modal'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import { useState, Fragment, useRef } from 'react'
import useSWR from 'swr'
import BadgeIcon from '../Icons/BadgeIcon'
import PolygonIcon from '../Icons/PolygonIcon'
import XIcon from '../Icons/XIcon'
import Button from '../UI/Buttons/Button'
import minterAbi from '@/data/ShowtimeMT.json'

const addressRegex = /^0x[a-fA-F0-9]{40}$/

const MODAL_STATES = {
	GENERAL: 'general',
	PROCESSING: 'processing',
	TRANSACTION: 'transaction',
	SUCCESS: 'success',
	CHANGE_WALLET: 'change_wallet',
}

const TransferModal = ({ open, onClose, token }) => {
	const { myProfile } = useProfile()
	const { resolvedTheme } = useTheme()
	const isWeb3ModalActive = useRef(false)
	const [modalState, setModalState] = useState(MODAL_STATES.GENERAL)

	const trueOnClose = () => {
		if (isWeb3ModalActive.current || modalState === MODAL_STATES.PROCESSING) return

		onClose()
	}

	const [quantity, setQuantity] = useState(1)
	const [address, setAddress] = useState('')
	const [transactionHash, setTransactionHash] = useState(null)

	const transferToken = async () => {
		setModalState(MODAL_STATES.PROCESSING)

		const web3Modal = getWeb3Modal({ theme: resolvedTheme })
		isWeb3ModalActive.current = true
		const { biconomy, web3 } = await getBiconomy(web3Modal, () => (isWeb3ModalActive.current = false)).catch(error => {
			if (error !== 'Modal closed by user') throw error

			isWeb3ModalActive.current = false
			throw setModalState(MODAL_STATES.GENERAL)
		})

		const signerAddress = await web3.getSigner().getAddress()

		if (
			!myProfile?.wallet_addresses_v2
				?.filter(address => address.minting_enabled)
				?.map(({ address }) => address.toLowerCase())
				?.includes(signerAddress.toLowerCase())
		) {
			return setModalState(MODAL_STATES.CHANGE_WALLET)
		}

		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MINTING_CONTRACT, minterAbi, biconomy.getSignerByAddress(signerAddress))

		const { data } = await contract.populateTransaction.safeTransferFrom(signerAddress, address, token.token_id, quantity, 0)

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
				if (error.code === 4001) throw setModalState(MODAL_STATES.GENERAL)

				if (JSON.parse(error?.body || error?.error?.body || '{}')?.error?.message?.includes('transfer amount exceeds balance')) {
					alert("Burn failed: You're trying to transfer more tokens than you own.")
					throw setModalState(MODAL_STATES.GENERAL)
				}

				console.log(JSON.parse(error?.body || error?.error?.body || '{}')?.error?.message)

				throw error
			})

		setTransactionHash(transaction)
		provider.once(transaction, () => setModalState(MODAL_STATES.SUCCESS))

		setModalState(MODAL_STATES.TRANSACTION)
	}

	const renderedState = (type => {
		switch (type) {
			case MODAL_STATES.GENERAL:
				return <GeneralState {...{ quantity, address, setAddress, setQuantity, transferToken, maxTokens: token?.owner_token_quantity || 1 }} />
			case MODAL_STATES.PROCESSING:
				return <LoadingState />
			case MODAL_STATES.TRANSACTION:
				return <TransactionState transactionHash={transactionHash} />
			case MODAL_STATES.SUCCESS:
				return <SuccessState transactionHash={transactionHash} />
			case MODAL_STATES.CHANGE_WALLET:
				return <WalletErrorState transferToken={transferToken} />
		}
	})(modalState)

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" static className="fixed inset-0 overflow-y-auto" open={open} onClose={trueOnClose}>
				<div className="min-h-screen text-center">
					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-95 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block align-middle h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom rounded-t-3xl sm:rounded-b-3xl text-left overflow-hidden transform transition-all sm:align-middle bg-white shadow-xl sm:max-w-lg w-full">
							<div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
								<h2 className="text-gray-900 dark:text-white text-xl font-bold">Transfer NFT</h2>
								{modalState !== MODAL_STATES.PROCESSING && (
									<button onClick={trueOnClose} className="p-3 -my-3 hover:bg-gray-100 disabled:hidden rounded-xl transition">
										<XIcon className="w-4 h-4" />
									</button>
								)}
							</div>
							{renderedState}
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const GeneralState = ({ quantity, address, setAddress, setQuantity, transferToken, maxTokens }) => {
	const { data: transferringTo, isValidating: loadingTransferAddress } = useSWR(
		() => (addressRegex.test(address) || address.includes('.')) && `/api/profile/card?wallet=${address}`,
		url => axios.get(url).then(res => res.data?.data?.profile)
	)

	return (
		<>
			<div className="p-4 border-b border-gray-100 dark:border-gray-900">
				<div className="flex items-center justify-between space-x-4">
					<div className="flex-1">
						<p className="font-semibold text-gray-900 dark:text-white">Quantity</p>
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">1 by default</p>
					</div>
					<input type="number" min="1" max={maxTokens} placeholder="1" className="px-4 py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring max-w-[60px] no-spinners" value={quantity} onChange={event => setQuantity(event.target.value)} />
				</div>
			</div>
			<div className="p-4 border-b border-gray-100 dark:border-gray-900 space-y-4">
				<div className="flex-1">
					<p className="font-semibold text-gray-900 dark:text-white">Receiver</p>
					<p className="text-sm font-medium text-gray-700 dark:text-gray-300">Paste an ENS domain or Ethereum address below</p>
				</div>
				{transferringTo?.profile_id ? (
					<div className="flex items-center justify-between rounded-3xl border-2 border-gray-100 p-4">
						<div className="flex items-center space-x-2">
							<img src={transferringTo.img_url} className="w-8 h-8 rounded-full" />
							<div>
								<div className="flex items-center space-x-1">
									<p className="text-sm font-semibold text-gray-900 dark:text-white">{transferringTo.name}</p>
									{transferringTo.verified == 1 && <BadgeIcon className="w-4 h-4 text-black dark:text-white" bgClass="text-white dark:text-black" />}
								</div>
								<p className="text-xs text-gray-700 font-medium">@{transferringTo.username}</p>
							</div>
						</div>
						<div>
							<button onClick={() => setAddress('')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full hover">
								<XIcon className="w-4 h-4" />
							</button>
						</div>
					</div>
				) : (
					<input type="text" placeholder="Paste here" className="px-4 py-3 relative block rounded-2xl dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring w-full" value={address} onChange={event => setAddress(event.target.value)} />
				)}
				{loadingTransferAddress && !transferringTo && (
					<div className="text-center w-full">
						<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
					</div>
				)}
			</div>
			<div className="p-4">
				<Button onClick={transferToken} style="primary" disabled={quantity < 1 || !(addressRegex.test(address) || address.includes('.'))} className="w-full flex items-center justify-center">
					Transfer
				</Button>
			</div>
		</>
	)
}

const LoadingState = () => {
	return (
		<div tabIndex="0" className="focus:outline-none p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">Preparing the transfer...</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs">We'll ask you to confirm with your preferred wallet shortly.</p>
			</div>
		</div>
	)
}

const TransactionState = ({ transactionHash }) => {
	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<div className="inline-block border-2 w-6 h-6 rounded-full border-gray-100 dark:border-gray-700 border-t-indigo-500 dark:border-t-cyan-400 animate-spin" />
			<div className="space-y-1">
				<p className="font-medium text-gray-900 dark:text-white text-center">Your NFT is being transferred on the Polygon network.</p>
				<p className="font-medium text-gray-900 dark:text-white text-center max-w-xs mx-auto">Feel free to navigate away from this screen</p>
			</div>
			<Button style="tertiary" as="a" href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on Polygon Scan</span>
			</Button>
		</div>
	)
}

const SuccessState = ({ transactionHash }) => {
	return (
		<div className="p-12 space-y-8 flex-1 flex flex-col items-center justify-center">
			<p className="font-medium text-5xl">🎉</p>
			<p className="font-medium text-gray-900 dark:text-white text-center">Your NFT has been transferred on the Polygon network. It might still show up on your profile for a few minutes.</p>
			<Button style="tertiary" as="a" href={`https://mumbai.polygonscan.com/tx/${transactionHash}`} target="_blank" className="space-x-2">
				<PolygonIcon className="w-4 h-4" />
				<span className="text-sm font-medium">View on Polygon Scan</span>
			</Button>
		</div>
	)
}

const WalletErrorState = ({ transferToken }) => {
	return (
		<div tabIndex="0" className="p-12 space-y-5 flex-1 flex flex-col items-center justify-center focus:outline-none">
			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
				<ExclamationIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
			</div>
			<p className="font-medium text-gray-900 text-center">The wallet you selected does not own this NFT.</p>
			<p className="font-medium text-gray-900 text-center max-w-xs mx-auto">
				Please{' '}
				<button onClick={transferToken} className="font-semibold focus:outline-none focus-visible:underline">
					try again with a different wallet
				</button>
				.
			</p>
		</div>
	)
}

export default TransferModal
