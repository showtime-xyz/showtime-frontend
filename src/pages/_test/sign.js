import Layout from '@/components/layout'
import { Magic } from 'magic-sdk'
import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { ethers } from 'ethers'
import useWeb3Modal from '@/lib/web3Modal'
import { Biconomy } from '@biconomy/mexa'
import { useContext } from 'react'
import AppContext from '@/context/app-context'

const _SignPage = () => {
	const { web3, setWeb3 } = useContext(AppContext)
	const { isAuthenticated, loading } = useAuth()
	const [signText, setSignText] = useState('')
	const web3Modal = useWeb3Modal()

	const submitForm = async e => {
		e.preventDefault()

		const signature = await signMessage(signText)

		alert(`SIGNATURE: ${signature}`)
	}

	const signMessage = async message => {
		const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
		let _web3

		if (!web3) {
			if (await magic.user.isLoggedIn()) _web3 = new ethers.providers.Web3Provider(magic.rpcProvider)
			else _web3 = new ethers.providers.Web3Provider(await web3Modal.connect())

			_web3 = new ethers.providers.Web3Provider(new Biconomy(_web3.provider, { apiKey: process.env.NEXT_PUBLIC_BICONOMY_KEY, debug: true }))
			setWeb3(_web3)
		} else _web3 = web3

		return _web3.getSigner().signMessage(message)
	}

	if (loading || !isAuthenticated) {
		return (
			<Layout>
				<span>Not logged in!</span>
			</Layout>
		)
	}

	return (
		<Layout>
			<form onSubmit={submitForm} className="flex items-center justify-center mt-20">
				<textarea className="rounded-lg border mr-2" value={signText} onChange={event => setSignText(event.target.value)} />
				<button type="submit">Sign</button>
			</form>
		</Layout>
	)
}

export default _SignPage
