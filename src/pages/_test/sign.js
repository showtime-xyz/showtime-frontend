import Layout from '@/components/layout'
import { Magic } from 'magic-sdk'
import { useState } from 'react'
import useAuth from '@/hooks/useAuth'
import Web3 from 'web3'
import useWeb3Modal from '@/lib/web3Modal'

const _SignPage = () => {
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
		let web3

		if (await magic.user.isLoggedIn()) web3 = new Web3(magic.rpcProvider)
		else web3 = new Web3(await web3Modal.connect())

		const fromAddress = (await web3.eth.getAccounts())[0]

		return web3.eth.personal.sign(message, fromAddress)
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
