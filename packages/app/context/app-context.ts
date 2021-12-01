import { createContext } from 'react'

type AppContextType = {
	web3: any
	setWeb3: any
	windowSize: any
	setWindowSize: any
	isMobile: any
	toggleRefreshFeed: any
	throttleMessage: any
	disableLikes: any
	disableComments: any
	disableFollows: any
	recommendedFollows: any
	loadingRecommendedFollows: any
	commentInputFocused: any
	setThrottleMessage: any
	setRecommendedFollows: any
	setCommentInputFocused: any
	setToggleRefreshFeed: any
	logOut: any
}

const AppContext = createContext({} as AppContextType)

export { AppContext }
