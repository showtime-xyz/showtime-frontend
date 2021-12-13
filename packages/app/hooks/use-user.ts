import { useEffect, useReducer, useCallback } from 'react'
import useSWR from 'swr'
import useUnmountSignal from 'use-unmount-signal'

import { axios } from 'app/lib/axios'
import { mixpanel } from 'app/lib/mixpanel'
import { accessTokenManager } from 'app/lib/access-token-manager'

type RefreshStatus = 'IDLE' | 'REFRESHING_ACCESS_TOKEN' | 'DONE' | 'ERROR'
type AuthenticatedStatus = 'IDLE' | 'AUTHENTICATED' | 'UNAUTHENTICATED'

type State = {
	refreshStatus: RefreshStatus
	authenticationStatus: AuthenticatedStatus
}

type ActionType =
	| { type: 'SET_REFRESH_STATUS'; payload: RefreshStatus }
	| { type: 'SET_AUTHENTICATION_STATUS'; payload: AuthenticatedStatus }

const initialState: State = {
	refreshStatus: 'IDLE',
	authenticationStatus: 'IDLE',
}

const reducer = (state: State, action: ActionType): State => {
	switch (action.type) {
		case 'SET_REFRESH_STATUS':
			return { ...state, refreshStatus: action.payload }
		case 'SET_AUTHENTICATION_STATUS':
			return { ...state, authenticationStatus: action.payload }
		default:
			return { ...state }
	}
}

const useUser = () => {
	const [state, dispatch] = useReducer(reducer, initialState)
	const refreshStatus = state.refreshStatus
	const authenticationStatus = state.authenticationStatus
	const accessToken = accessTokenManager.getAccessToken()

	const unmountSignal = useUnmountSignal()
	const url = '/v2/myinfo'
	const { data: user, error, mutate } = useSWR(accessToken ? [url] : null, url =>
		axios({ url, method: 'GET', unmountSignal })
	)

	const refreshAccessToken = useCallback(async () => {
		try {
			dispatch({ type: 'SET_REFRESH_STATUS', payload: 'REFRESHING_ACCESS_TOKEN' })
			const newAccessToken = await accessTokenManager.refreshAccessToken()
			if (newAccessToken) {
				dispatch({ type: 'SET_AUTHENTICATION_STATUS', payload: 'AUTHENTICATED' })
			} else {
				dispatch({ type: 'SET_AUTHENTICATION_STATUS', payload: 'UNAUTHENTICATED' })
			}
			dispatch({ type: 'SET_REFRESH_STATUS', payload: 'DONE' })
		} catch (error) {
			console.error(error)
			dispatch({ type: 'SET_REFRESH_STATUS', payload: 'ERROR' })
		}

		mutate()
	}, [dispatch, mutate])

	useEffect(() => {
		refreshAccessToken()
	}, [accessToken])

	useEffect(() => {
		if (user) {
			mixpanel.identify(user.publicAddress)

			// if (user.email) {
			// 	mixpanel.people.set({
			// 		$email: user.email, // only reserved properties need the $
			// 		USER_ID: user.publicAddress, // use human-readable names
			// 	})
			// } else {
			// 	mixpanel.people.set({
			// 		USER_ID: user.publicAddress, // use human-readable names
			// 	})
			// }
		}
	}, [user])

	const isRefreshingAccessToken = refreshStatus === 'REFRESHING_ACCESS_TOKEN'
	const isAuthenticated = authenticationStatus === 'AUTHENTICATED'
	const isFetchingAuthenticatedUser = !isRefreshingAccessToken && isAuthenticated && !user

	return {
		user,
		error,
		mutate,
		isLoading: isRefreshingAccessToken ?? isFetchingAuthenticatedUser ?? (!user && !error),
		isAuthenticated: (user && !error) ?? isAuthenticated,
	}
}

export { useUser }
