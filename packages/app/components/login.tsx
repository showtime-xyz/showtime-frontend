import { useContext, useState, useCallback } from 'react'
import { Platform, Linking } from 'react-native'
import { captureException } from '@sentry/nextjs'
import { useForm, Controller } from 'react-hook-form'
import { useWalletConnect } from '@walletconnect/react-native-dapp'
import { convertUtf8ToHex } from '@walletconnect/utils'
import { useSWRConfig } from 'swr'
// import Iron from '@hapi/iron'

import { Magic, Relayer } from 'app/lib/magic'
import { AppContext } from 'app/context/app-context'
import { axios } from 'app/lib/axios'
// @ts-ignore
import getWeb3Modal from 'app/lib/web3-modal'
import { personalSignMessage } from 'app/lib/utilities'
import { accessTokenManager } from 'app/lib/access-token-manager'
import { setLogin } from 'app/lib/login'
import { mixpanel } from 'app/lib/mixpanel'

import { View, ScrollView, Text, TextInput, Button, ButtonLabel, Pressable } from 'design-system'
import { tw } from 'design-system/tailwind'
import { useRouter } from 'app/navigation/use-router'
import { Ethereum } from 'design-system/icon'
import { setRefreshToken } from 'app/lib/refresh-token'

type EmailForm = {
	email: string
}

// TODO: loading state
export function Login() {
	const router = useRouter()
	const context = useContext(AppContext)
	const connector = useWalletConnect()
	const [signaturePending, setSignaturePending] = useState(false)
	const { mutate } = useSWRConfig()

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm({
		mode: 'onBlur',
		reValidateMode: 'onChange',
	})

	const handleSubmitEmail = useCallback(
		async ({ email }: EmailForm) => {
			try {
				const Web3Provider = (await import('@ethersproject/providers')).Web3Provider

				mixpanel.track('Login - email button click')

				// Magic Link authenticates through email
				const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY)
				const did = await magic.auth.loginWithMagicLink({ email })
				// @ts-ignore
				const web3 = new Web3Provider(magic.rpcProvider)
				context.setWeb3(web3)

				const response = await axios({
					url: '/v1/login_magic',
					method: 'POST',
					data: { email, did },
				})

				const accessToken = response?.access
				const refreshToken = response?.refresh
				const validResponse = accessToken && refreshToken

				if (validResponse) {
					// TODO:
					// const sealedRefreshToken = await Iron.seal(
					// 	{ refreshToken },
					// 	process.env.ENCRYPTION_SECRET_V2,
					// 	Iron.defaults
					// )
					// setRefreshToken(sealedRefreshToken)
					setRefreshToken(refreshToken)
					accessTokenManager.setAccessToken(accessToken)
					setLogin(Date.now().toString())
				} else {
					throw 'Login failed'
				}

				mutate(null)
				mixpanel.track('Login success - email')
				router.pop()
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error(error)
				}

				captureException(error, {
					tags: {
						login_signature_flow: 'modalLogin.js',
						login_magic_link: 'modalLogin.js',
					},
				})
			}
		},
		[context, router]
	)

	const handleSubmitWallet = useCallback(async () => {
		try {
			let address: string
			let signature: string

			if (Platform.OS === 'web') {
				const Web3Provider = (await import('@ethersproject/providers')).Web3Provider
				mixpanel.track('Login - wallet button click')

				const web3Modal = await getWeb3Modal()
				const web3 = new Web3Provider(await web3Modal.connect())

				address = await web3.getSigner().getAddress()
				const response = await axios({ url: `/v1/getnonce?address=${address}`, method: 'GET' })

				setSignaturePending(true)
				signature = await personalSignMessage(
					web3,
					process.env.NEXT_PUBLIC_SIGNING_MESSAGE + ' ' + response?.data
				)
			} else {
				await connector.connect()
				if (!connector.connected) {
					return
				}

				address = connector.session?.accounts[0]
				const response = await axios({ url: `/v1/getnonce?address=${address}`, method: 'GET' })

				setSignaturePending(true)
				const msgParams = [
					convertUtf8ToHex(`Sign into Showtime with this wallet. ${response?.data}`),
					address.toLowerCase(),
				]

				signature = await connector.signPersonalMessage(msgParams)
			}

			const response = await axios({
				url: '/v1/login_wallet',
				method: 'POST',
				data: { signature, address },
			})

			const accessToken = response?.access
			const refreshToken = response?.refresh
			const validResponse = accessToken && refreshToken

			if (validResponse) {
				// TODO:
				// const sealedRefreshToken = await Iron.seal(
				// 	{ refreshToken },
				// 	process.env.ENCRYPTION_SECRET_V2,
				// 	Iron.defaults
				// )
				// setRefreshToken(sealedRefreshToken)
				setRefreshToken(refreshToken)
				accessTokenManager.setAccessToken(accessToken)
				setLogin(Date.now().toString())

				// Expire the nonce after successful login
				axios({ url: `/v1/rotatenonce?address=${address}`, method: 'POST' })
			} else {
				throw 'Login failed'
			}

			mutate(null)
			mixpanel.track('Login success - wallet signature')
			router.pop()
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error(error)
			}

			captureException(error, {
				tags: {
					login_signature_flow: 'modalLogin.js',
				},
			})
		} finally {
			setSignaturePending(false)
		}
	}, [context])

	return (
		<>
			<ScrollView tw="h-120 md:h-60">
				{signaturePending ? (
					<View tw="py-40">
						<Text tw="text-center dark:text-gray-400">Pushed a request to your wallet...</Text>
					</View>
				) : (
					<View tw="px-4">
						<Text tw="text-gray-900 dark:text-white mb-4 text-center">
							If this is your first time, it will create a new account on Showtime.
						</Text>
						<View tw="py-4 flex-row justify-center">
							<Text tw="text-gray-600 dark:text-gray-400 text-xs text-center">
								By signing in you agree to our{' '}
							</Text>
							<Pressable
								onPress={() => {
									Linking.openURL(
										'https://www.notion.so/Showtime-Legal-c407e36eb7cd414ca190245ca8621e68'
									)
								}}
							>
								<Text tw="text-black dark:text-white font-bold text-xs text-center">
									Terms &amp; Conditions
								</Text>
							</Pressable>
							<Text tw="text-gray-600 dark:text-gray-400 text-xs text-center">.</Text>
						</View>

						<View tw="mb-4">
							<Button onPress={() => handleSubmitWallet()} variant="primary" size="regular">
								<Ethereum
									width={24}
									height={24}
									color={tw.style('bg-white dark:bg-black')?.backgroundColor as string}
								/>
								<ButtonLabel tw="ml-2">Sign in with Wallet</ButtonLabel>
							</Button>
						</View>

						<Text tw="py-6 text-gray-700 dark:text-gray-600 text-center">— or —</Text>
						<Text tw="mb-4 dark:text-white text-center">Enter your email to receive a sign in link</Text>
						<Controller
							control={control}
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									tw="mb-4 border-2 dark:border-gray-800 dark:bg-gray-800 w-full text-black dark:text-gray-300 rounded-lg p-3 focus:outline-none focus-visible:ring-1"
									onBlur={onBlur}
									onChangeText={value => onChange(value)}
									value={value}
									placeholder="Email"
									autoCapitalize="none"
									autoCorrect={false}
									textContentType="emailAddress"
								/>
							)}
							name="email"
							rules={{ required: true }}
							defaultValue=""
						/>
						{/* {errors.email && <Text sx={{ fontSize: 12, textAlign: 'center' }}>This is required.</Text>} */}

						<Button onPress={handleSubmit(handleSubmitEmail)} variant="tertiary" size="regular">
							<ButtonLabel tw="text-black dark:text-white">Sign in with Email</ButtonLabel>
						</Button>
					</View>
				)}
				<Relayer />
			</ScrollView>
		</>
	)
}
