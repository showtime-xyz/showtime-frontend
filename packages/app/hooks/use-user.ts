import { useEffect, useState, useCallback } from 'react'
import useSWR from 'swr'
import useUnmountSignal from 'use-unmount-signal'

import { axios } from 'app/lib/axios'
import { mixpanel } from 'app/lib/mixpanel'
import { accessTokenManager } from 'app/lib/access-token-manager'

type RefreshStatus = 'IDLE' | 'REFRESHING_ACCESS_TOKEN' | 'DONE' | 'ERROR'
type AuthenticatedStatus = 'IDLE' | 'AUTHENTICATED' | 'UNAUTHENTICATED'

const useUser = () => {
	const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>('IDLE')
	const [authenticationStatus, setAuthenticationStatus] = useState<AuthenticatedStatus>('IDLE')
	const accessToken = accessTokenManager.getAccessToken()

	const unmountSignal = useUnmountSignal()
	const url = '/v2/myinfo'
	const { data: user, error, mutate } = useSWR(accessToken ? [url] : null, url =>
		axios({ url, method: 'GET', unmountSignal })
	)

	const refreshAccessToken = useCallback(async () => {
		try {
			setRefreshStatus('REFRESHING_ACCESS_TOKEN')
			const newAccessToken = await accessTokenManager.refreshAccessToken()
			if (newAccessToken) {
				setAuthenticationStatus('AUTHENTICATED')
			} else {
				setAuthenticationStatus('UNAUTHENTICATED')
			}
			setRefreshStatus('DONE')
		} catch (error) {
			console.error(error)
			setRefreshStatus('ERROR')
		}

		mutate()
	}, [mutate, setRefreshStatus, setAuthenticationStatus])

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
