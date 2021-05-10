import { useEffect, useState } from 'react'
import '@/styles/globals.css'
import AppContext from '@/context/app-context'
import mixpanel from 'mixpanel-browser'
import Router from 'next/router'
import ProgressBar from '@badrap/bar-of-progress'
import ModalThrottleUser from '@/components/ModalThrottleUser'
import axios from '@/lib/axios'

mixpanel.init('9b14512bc76f3f349c708f67ab189941')

// Progress bar during Routing changes
const progress = new ProgressBar({
	size: 3,
	color: '#e45cff',
	className: 'bar-of-progress',
	delay: 100,
})

Router.events.on('routeChangeStart', progress.start)
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)

const App = ({ Component, pageProps }) => {
	const [user, setUser] = useState()
	const [windowSize, setWindowSize] = useState(null)
	const [myLikes, setMyLikes] = useState(null)
	const [myLikeCounts, setMyLikeCounts] = useState(null)
	const [myComments, setMyComments] = useState(null)
	const [myCommentCounts, setMyCommentCounts] = useState(null)
	const [myFollows, setMyFollows] = useState(null)
	const [myProfile, setMyProfile] = useState()
	const [myRecommendations, setMyRecommendations] = useState()
	const [loginModalOpen, setLoginModalOpen] = useState(false)
	const [gridWidth, setGridWidth] = useState(null)
	const [columns, setColumns] = useState(null)
	const [isMobile, setIsMobile] = useState(null)
	const [toggleRefreshFeed, setToggleRefreshFeed] = useState(false)
	const [throttleMessage, setThrottleMessage] = useState(null)
	const [throttleOpen, setThrottleOpen] = useState(false)
	const [throttleContent, setThrottleContent] = useState('')
	const [disableLikes, setDisableLikes] = useState(false)
	const [disableComments, setDisableComments] = useState(false)
	const [disableFollows, setDisableFollows] = useState(false)

	const adjustGridProperties = windowWidth => {
		if (windowWidth < 790 + 30) {
			setIsMobile(true)
			setGridWidth(windowWidth)
			setColumns(1)
		} else if (windowWidth < 1185 + 45) {
			setIsMobile(false)
			setGridWidth(790)
			setColumns(2)
		} else if (windowWidth < 1580 + 40) {
			setIsMobile(false)
			setGridWidth(1185)
			setColumns(3)
		} else {
			setIsMobile(false)
			setGridWidth(1580)
			setColumns(4)
		}
	}

	const handleResize = () => {
		// Set window width/height to state
		setWindowSize({ width: window.innerWidth, height: window.innerHeight })
		//update grid width / columns
		adjustGridProperties(window.innerWidth)
	}

	const getUserFromCookies = async () => {
		// log in with our own API
		try {
			const user_data = await axios.get('/api/auth/user').then(res => res.data)
			setUser(user_data)

			mixpanel.identify(user_data.publicAddress)
			if (user_data.email) {
				mixpanel.people.set({
					$email: user_data.email, // only reserved properties need the $
					USER_ID: user_data.publicAddress, // use human-readable names
				})
			} else {
				mixpanel.people.set({
					USER_ID: user_data.publicAddress, // use human-readable names
				})
			}

			// get our likes, follows, profile
			const my_info_data = await axios.get('/api/profile').then(res => res.data)

			setMyLikes(my_info_data.data.likes_nft)
			setMyComments(my_info_data.data.comments)
			setMyFollows(my_info_data.data.follows)
			setMyProfile({
				...my_info_data.data.profile,
				// turn notifications_last_opened into Date before storing in context
				notifications_last_opened: my_info_data.data.profile.notifications_last_opened ? new Date(my_info_data.data.profile.notifications_last_opened) : null,
				links: my_info_data.data.profile.links.map(link => ({
					name: link.type__name,
					prefix: link.type__prefix,
					icon_url: link.type__icon_url,
					type_id: link.type_id,
					user_input: link.user_input,
				})),
			})

			// Load up the recommendations async if we are onboarding
			if (my_info_data.data.profile.has_onboarded == false) {
				const my_rec_data = await axios.get('/api/follow_recommendations_onboarding').then(res => res.data)
				setMyRecommendations(my_rec_data.data)
			}
		} catch {
			// Not logged in
			// Switch from undefined to null
			setUser(null)
		}
	}

	const disableUserActions = (likes, comments, follows) => {
		setDisableLikes(likes)
		setDisableComments(comments)
		setDisableFollows(follows)
	}

	useEffect(() => {
		if (throttleMessage) {
			setThrottleContent(throttleMessage)
			setThrottleOpen(true)
			disableUserActions(true, true, true)
		}
	}, [throttleMessage])

	useEffect(() => {
		getUserFromCookies()

		// Add event listener
		window.addEventListener('resize', handleResize)

		// Call handler right away so state gets updated with initial window size
		handleResize()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const injectedGlobalContext = {
		user,
		windowSize,
		myLikes,
		myLikeCounts,
		myComments,
		myCommentCounts,
		myFollows,
		myProfile,
		myRecommendations,
		loginModalOpen,
		gridWidth,
		columns,
		isMobile,
		toggleRefreshFeed,
		throttleMessage,
		disableLikes,
		disableComments,
		disableFollows,
		setWindowSize,
		setMyLikes,
		setMyLikeCounts,
		setMyComments,
		setMyCommentCounts,
		setMyFollows,
		setMyProfile,
		setMyRecommendations,
		setLoginModalOpen,
		setThrottleMessage,

		getUserFromCookies,
		logOut: async () => {
			await axios.post('/api/auth/logout')

			setUser(null)
			setMyLikes([])
			setMyLikeCounts({})
			setMyComments([])
			setMyCommentCounts({})
			setMyFollows([])
			setMyRecommendations([])
			setMyProfile(undefined)

			mixpanel.track('Logout')
		},
		setToggleRefreshFeed,
		setUser,
		adjustGridProperties,
	}

	return (
		<AppContext.Provider value={injectedGlobalContext}>
			<ModalThrottleUser isOpen={throttleOpen} closeModal={() => setThrottleOpen(false)} modalContent={throttleContent} />
			<Component {...pageProps} />
		</AppContext.Provider>
	)
}

export default App
