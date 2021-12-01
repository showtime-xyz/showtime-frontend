import { useCallback, useMemo, useContext } from 'react'
import { useRouter as useNextRouter, NextRouter } from 'next/router'
import { useLinkTo, useNavigation, useNavigationState } from '@react-navigation/native'
import { StackRouter } from '@react-navigation/routers'
import { StackActions, getPathFromState, NavigationState } from '@react-navigation/native'
import { reloadAsync } from 'expo-updates'

// this is scary...
// but react navigation doesn't expose LinkingContext 😬
import LinkingContext from '@react-navigation/native/lib/module/LinkingContext'
import type { LinkingOptions } from '@react-navigation/native'

// hack to access getStateForAction from react-navigation's stack
// https://github.com/react-navigation/react-navigation/blob/main/packages/routers/src/StackRouter.tsx#L224
const stack = StackRouter({})

const path = (from: Parameters<ReturnType<typeof useRouter>['push']>[0]) => {
	let path = (typeof from == 'string' ? from : from.pathname) || ''

	// replace each instance of [key] with the corresponding value from query[key]
	// this ensures we're navigating to the correct URL
	// it currently ignores [...param]
	// but I can't see why you would use this with RN + Next.js
	if (typeof from == 'object' && from.query && typeof from.query == 'object') {
		for (const key in from.query) {
			if (from.query[key] != null) {
				path = path.replace(`[${key}]`, `${from.query[key]}`)
			}
		}
	}

	return path
}

const getPath = (navigationState: NavigationState) => {
	return (
		navigationState?.routes?.[navigationState?.index]?.path ??
		navigationState?.routes?.[navigationState?.index]?.state?.routes[0]?.path ??
		'/'
	)
}

export function useRouter() {
	const linkTo = useLinkTo()
	const router = useNextRouter()
	const navigation = useNavigation()
	const navigationState = useNavigationState(state => state)
	const linking = useContext(LinkingContext) as {
		options?: LinkingOptions<ReactNavigation.RootParamList>
	}

	return {
		push: useCallback(
			(...nextProps: Parameters<NextRouter['push']>) => {
				if (router) {
					router.push(...nextProps)
				} else {
					const [url, as] = nextProps

					const to = as ? path(as) : path(url)

					if (to) {
						linkTo(to)
					}
				}
			},
			[linkTo, router]
		),
		replace: useCallback(
			(...nextProps: Parameters<NextRouter['replace']>) => {
				if (router) {
					router.replace(...nextProps)
				} else {
					const [url, as] = nextProps

					const to = as ? path(as) : path(url)

					if (to) {
						linkTo(to)
					}
				}
			},
			[linkTo, router]
		),
		back: useCallback(
			(...nextProps: Parameters<NextRouter['back']>) => {
				if (router) {
					router.back(...nextProps)
				} else {
					navigation.goBack()
				}
			},
			[router, navigation]
		),
		pop: useCallback(() => {
			if (router) {
				const nextState = stack.getStateForAction(
					{
						type: 'stack',
						key: navigationState.key,
						index: navigationState.index,
						routes: navigationState.routes,
						routeNames: navigationState.routeNames,
						stale: navigationState.stale,
					},
					StackActions.pop(),
					// @ts-expect-error pop doesn't need the dict here, it's okay
					// https://github.com/react-navigation/react-navigation/blob/main/packages/routers/src/StackRouter.tsx#L317
					{}
				)

				if (nextState) {
					let path = nextState.index != undefined ? nextState.routes[nextState.index]?.path : undefined

					if (!path) {
						const getPath = linking?.options?.getPathFromState ?? getPathFromState
						path = getPath(nextState, linking?.options?.config)
					}

					if (path != undefined) {
						router.replace(path)
					}
				}
			} else {
				navigation.dispatch(StackActions.pop())
			}
		}, [router, navigation, navigationState]),
		prefetch: useCallback(
			(...nextProps: Parameters<NextRouter['prefetch']>) => {
				if (router) {
					router.prefetch(...nextProps)
				}
			},
			[router]
		),
		pathname: useMemo(() => {
			if (router) {
				return router.pathname
			} else {
				const pathname = getPath(navigationState)

				return pathname
			}
		}, [router, navigationState]),
		reload: useCallback(async () => {
			if (router) {
				router.reload()
			} else {
				await reloadAsync()
			}
		}, [router]),
	}
}
