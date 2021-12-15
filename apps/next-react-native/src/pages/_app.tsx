import '../styles/styles.css'

import 'raf/polyfill'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import { enableFreeze } from 'react-native-screens'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { DripsyProvider } from 'dripsy'
import { useDeviceContext } from 'twrnc'
import { SWRConfig, useSWRConfig } from 'swr'

import { accessTokenManager } from 'app/lib/access-token-manager'
import { tw } from 'design-system/tailwind'
import { theme } from 'design-system/theme'
import { NavigationProvider } from 'app/navigation'
import { NextTabNavigator } from 'app/navigation/next-tab-navigator'
import { isServer } from 'app/lib/is-server'
import { AppContext } from 'app/context/app-context'
import { setLogout } from 'app/lib/logout'
import { mixpanel } from 'app/lib/mixpanel'
import { deleteCache } from 'app/lib/delete-cache'
import { useRouter } from 'app/navigation/use-router'
import { useUser } from 'app/hooks/use-user'
import { deleteRefreshToken } from 'app/lib/refresh-token'

// enableFreeze(true)

function localStorageProvider() {
	const map = new Map(JSON.parse(localStorage.getItem('app-cache')) || [])

	window.addEventListener('beforeunload', () => {
		const appCache = JSON.stringify(Array.from(map.entries()))
		localStorage.setItem('app-cache', appCache)
	})

	return map
}

function AppContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const { user } = useUser()
	const router = useRouter()
	const { mutate } = useSWRConfig()

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
	// 	if (userData) {
	// 		setUser(userData)

	// 		mixpanel.identify(userData.publicAddress)

	// 		// if (user_data.email) {
	// 		// 	mixpanel.people.set({
	// 		// 		$email: user_data.email, // only reserved properties need the $
	// 		// 		USER_ID: user_data.publicAddress, // use human-readable names
	// 		// 	})
	// 		// } else {
	// 		// 	mixpanel.people.set({
	// 		// 		USER_ID: user_data.publicAddress, // use human-readable names
	// 		// 	})
	// 		// }
	// 	}
	// }, [userData, setUser, mixpanel])

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

export default function App({ Component, pageProps }: AppProps) {
	useDeviceContext(tw)

	return (
		<>
			<Head>
				<title>Showtime</title>
				<meta key="title" name="title" content="Showtime" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
				<meta
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
					name="viewport"
				/>
			</Head>
			<DripsyProvider theme={theme}>
				<SafeAreaProvider>
					<NavigationProvider>
						<SWRConfig
							value={{
								provider: isServer ? () => new Map() : localStorageProvider,
							}}
						>
							<AppContextProvider>
								<NextTabNavigator Component={Component} pageProps={pageProps} />
							</AppContextProvider>
						</SWRConfig>
					</NavigationProvider>
				</SafeAreaProvider>
			</DripsyProvider>
		</>
	)
}
