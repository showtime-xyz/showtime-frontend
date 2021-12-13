import { useState, useEffect } from 'react'
import { AppState, LogBox, useColorScheme, Platform } from 'react-native'
import { enableScreens, enableFreeze, FullWindowOverlay } from 'react-native-screens'
import { StatusBar, setStatusBarStyle } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DripsyProvider } from 'dripsy'
import { useDeviceContext } from 'twrnc'
// import * as Sentry from 'sentry-expo'
import { MMKV } from 'react-native-mmkv'
import { SWRConfig, useSWRConfig } from 'swr'
import WalletConnectProvider, {
	useWalletConnect,
	RenderQrcodeModalProps,
	QrcodeModal,
} from '@walletconnect/react-native-dapp'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { useNavigation } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'

import { tw } from 'design-system/tailwind'
import { theme } from 'design-system/theme'
import { NavigationProvider } from 'app/navigation'
import { NextTabNavigator } from 'app/navigation/next-tab-navigator'
import { accessTokenManager } from 'app/lib/access-token-manager'
import { AppContext } from 'app/context/app-context'
import { setLogout } from 'app/lib/logout'
import { mixpanel } from 'app/lib/mixpanel'
import { deleteCache } from 'app/lib/delete-cache'
import { useUser } from 'app/hooks/use-user'
import { useRouter } from 'app/navigation/use-router'
import { deleteRefreshToken } from 'app/lib/refresh-token'

enableScreens(true)
// enableFreeze(true)

// Sentry.init({
// 	dsn: 'https://a0b390d1d15543a8a85ab594eb4b0c50@o614247.ingest.sentry.io/5860034',
// 	enableInExpoDevelopment: true,
// 	debug: process.env.STAGE === 'development',
// })

LogBox.ignoreLogs([
	'Constants.deviceYearClass',
	'No native splash screen',
	"The provided value 'ms-stream' is not a valid 'responseType'.",
	"The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
])

function QRCodeModal(props: RenderQrcodeModalProps): JSX.Element {
	if (!props.visible) {
		return null
	}

	return (
		<FullWindowOverlay style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center' }}>
			<QrcodeModal division={4} {...props} />
		</FullWindowOverlay>
	)
}

function mmkvProvider() {
	const storage = new MMKV()
	const appCache = storage.getString('app-cache')
	const map = new Map(appCache ? JSON.parse(appCache) : [])

	AppState.addEventListener('change', () => {
		const appCache = JSON.stringify(Array.from(map.entries()))
		storage.set('app-cache', appCache)
	})

	return map
}

function SWRProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const navigation = useNavigation()

	return (
		<SWRConfig
			value={{
				provider: mmkvProvider,
				isVisible: () => {
					return AppState.currentState === 'active'
				},
				isOnline: () => {
					return true
					// return NetInfo.fetch().then((state) => state.isConnected)
				},
				// TODO: tab focus too
				initFocus(callback) {
					let appState = AppState.currentState

					const onAppStateChange = nextAppState => {
						/* If it's resuming from background or inactive mode to active one */
						if (appState.match(/inactive|background/) && nextAppState === 'active') {
							callback()
						}
						appState = nextAppState
					}

					// Subscribe to the app state change events
					const subscription = AppState.addEventListener('change', onAppStateChange)

					// Subscribe to the navigation events
					const unsubscribe = navigation.addListener('focus', callback)

					return () => {
						subscription.remove()
						unsubscribe()
					}
				},
				initReconnect(callback) {
					let netInfoState = {
						isConnected: undefined,
						isInternetReachable: undefined,
					}

					NetInfo.fetch().then(state => {
						netInfoState = state
					})

					// Subscribe to the network change events
					const unsubscribe = NetInfo.addEventListener(nextNetInfoState => {
						if (
							netInfoState.isInternetReachable === false &&
							nextNetInfoState.isConnected === true &&
							nextNetInfoState.isInternetReachable === true
						) {
							callback()
						}
						netInfoState = nextNetInfoState
					})

					return () => {
						unsubscribe()
					}
				},
			}}
		>
			{children}
		</SWRConfig>
	)
}

function AppContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const { user } = useUser()
	const router = useRouter()
	const { mutate } = useSWRConfig()
	const connector = useWalletConnect()
	useDeviceContext(tw)
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'

	useEffect(() => {
		if (Platform.OS === 'android') {
			if (isDark) {
				NavigationBar.setBackgroundColorAsync('#000')
				NavigationBar.setButtonStyleAsync('light')
				setStatusBarStyle('dark')
			} else {
				NavigationBar.setBackgroundColorAsync('#FFF')
				NavigationBar.setButtonStyleAsync('dark')
				setStatusBarStyle('light')
			}
		}
	}, [])

	const [web3, setWeb3] = useState(null)
	const [windowSize, setWindowSize] = useState(null)
	const [myLikes, setMyLikes] = useState(null)
	const [myLikeCounts, setMyLikeCounts] = useState(null)
	const [myCommentLikes, setMyCommentLikes] = useState(null)
	const [myCommentLikeCounts, setMyCommentLikeCounts] = useState(null)
	const [myComments, setMyComments] = useState(null)
	const [myCommentCounts, setMyCommentCounts] = useState(null)
	const [myFollows, setMyFollows] = useState(null)
	const [myRecommendations, setMyRecommendations] = useState(null)
	// eslint-disable-next-line no-unused-vars
	const [isMobile, setIsMobile] = useState(null)
	const [toggleRefreshFeed, setToggleRefreshFeed] = useState(false)
	const [throttleMessage, setThrottleMessage] = useState(null)
	// const [throttleOpen, setThrottleOpen] = useState(false)
	// const [throttleContent, setThrottleContent] = useState('')
	// eslint-disable-next-line no-unused-vars
	const [disableLikes, setDisableLikes] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [disableComments, setDisableComments] = useState(false)
	// eslint-disable-next-line no-unused-vars
	const [disableFollows, setDisableFollows] = useState(false)
	// const [recQueue, setRecQueue] = useState([])
	// eslint-disable-next-line no-unused-vars
	const [loadingRecommendedFollows, setLoadingRecommendedFollows] = useState(true)
	const [recommendedFollows, setRecommendedFollows] = useState([])
	const [commentInputFocused, setCommentInputFocused] = useState(false)

	// useEffect(() => {
	// 	if (infoData) {
	// 		setMyProfile({
	// 			...infoData.data.profile,
	// 			notifications_last_opened: infoData.data.profile.notifications_last_opened
	// 				? new Date(infoData.data.profile.notifications_last_opened)
	// 				: null,
	// 			links: infoData.data.profile.links.map(link => ({
	// 				name: link.type__name,
	// 				prefix: link.type__prefix,
	// 				icon_url: link.type__icon_url,
	// 				type_id: link.type_id,
	// 				user_input: link.user_input,
	// 			})),
	// 		})
	// 		setMyLikes(infoData.data.likes_nft)
	// 		setMyCommentLikes(infoData.data.likes_comment)
	// 		setMyComments(infoData.data.comments)
	// 		setMyFollows(infoData.data.follows)

	// 		// Load up the recommendations async if we are onboarding
	// 		if (infoData.data.profile.has_onboarded == false) {
	// 			const my_rec_data = await axios({
	// 				url: '/v1/follow_recommendations_onboarding',
	// 				method: 'GET',
	// 			})
	// 			setMyRecommendations(my_rec_data.data)
	// 		}
	// 	}
	// }, [infoData, setMyProfile, setMyLikes, setMyCommentLikes, setMyComments, setMyFollows])

	const injectedGlobalContext = {
		web3,
		setWeb3,
		windowSize,
		myLikes,
		myLikeCounts,
		myCommentLikes,
		myCommentLikeCounts,
		myComments,
		myCommentCounts,
		myFollows,
		myRecommendations,
		isMobile,
		toggleRefreshFeed,
		throttleMessage,
		disableLikes,
		disableComments,
		disableFollows,
		recommendedFollows,
		loadingRecommendedFollows,
		commentInputFocused,
		setWindowSize,
		setMyLikes,
		setMyLikeCounts,
		setMyCommentLikes,
		setMyCommentLikeCounts,
		setMyComments,
		setMyCommentCounts,
		setMyFollows,
		setMyRecommendations,
		setThrottleMessage,
		setRecommendedFollows,
		setCommentInputFocused,
		setToggleRefreshFeed,
		logOut: () => {
			deleteCache()
			deleteRefreshToken()
			accessTokenManager.deleteAccessToken()
			mutate(null)
			connector.killSession()
			setMyLikes([])
			setMyLikeCounts({})
			setMyCommentLikes([])
			setMyCommentLikeCounts({})
			setMyComments([])
			setMyCommentCounts({})
			setMyFollows([])
			setMyRecommendations([])
			setWeb3(null)
			mixpanel.track('Logout')
			// Triggers all event listeners for this key to fire. Used to force cross tab logout.
			setLogout(Date.now().toString())
		},
	}

	return <AppContext.Provider value={injectedGlobalContext}>{children}</AppContext.Provider>
}

function App() {
	return (
		<DripsyProvider theme={theme}>
			<SafeAreaProvider style={{ backgroundColor: 'black' }}>
				<NavigationProvider>
					<SWRProvider>
						<WalletConnectProvider
							clientMeta={{
								description: 'Connect with Showtime',
								url: 'https://showtime.io',
								icons: ['https://showtime.io/logo.jpg'],
								name: 'Showtime',
								// @ts-expect-error
								scheme: 'showtime://',
							}}
							redirectUrl="showtime://"
							storageOptions={{
								// @ts-ignore
								asyncStorage: AsyncStorage,
							}}
							renderQrcodeModal={(props: RenderQrcodeModalProps): JSX.Element => (
								<QRCodeModal {...props} />
							)}
						>
							<AppContextProvider>
								<>
									{/* TODO: change this when we update the splash screen */}
									<StatusBar style="dark" />
									<NextTabNavigator />
								</>
							</AppContextProvider>
						</WalletConnectProvider>
					</SWRProvider>
				</NavigationProvider>
			</SafeAreaProvider>
		</DripsyProvider>
	)
}

export default App
