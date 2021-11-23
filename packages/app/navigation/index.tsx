import { useRef, useMemo, useEffect } from 'react'
import { Platform, useColorScheme } from 'react-native'
import { useRouter } from 'next/router'
import { NavigationContainer, useLinkTo, LinkingOptions } from '@react-navigation/native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { linking } from 'app/navigation/linking'

function LinkTo() {
	const linkTo = useLinkTo()
	const router = useRouter()

	useEffect(function trigger() {
		if (Platform.OS === 'web' && router) {
			const handler = (path: string) => {
				linkTo(path)
			}

			router.events.on('routeChangeComplete', handler)

			return () => {
				router.events.off('routeChangeComplete', handler)
			}
		}
	}, [])

	return null
}

function useLinkingConfig(trackedLinking: React.MutableRefObject<LinkingOptions<ReactNavigation.RootParamList>>) {
	return {
		linking: trackedLinking.current,
		onReady: useMemo(
			() =>
				Platform.select({
					web: () => {
						trackedLinking.current.enabled = false
					},
				}),
			[]
		),
	}
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
	const trackedLinking = useRef(linking)
	const linkingConfig = useLinkingConfig(trackedLinking)
	const colorScheme = useColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<NavigationContainer
			linking={linkingConfig.linking}
			onReady={linkingConfig.onReady}
			theme={{
				dark: isDark,
				colors: {
					primary: '#fff',
					background: isDark ? '#27272A' : '#fff',
					card: '#000',
					text: isDark ? '#fff' : '#000',
					border: 'rgb(39, 39, 41)',
					notification: '#8B5CF6',
				},
			}}
			documentTitle={{
				enabled: true,
				formatter: options => (options?.title ? `${options.title} | Showtime` : 'Showtime'),
			}}
		>
			<LinkTo />
			<BottomSheetModalProvider>{children}</BottomSheetModalProvider>
		</NavigationContainer>
	)
}
