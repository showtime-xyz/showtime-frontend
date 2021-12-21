import { Text } from 'design-system/text'
import { Portal } from './portal'
import React, { useState, useImperativeHandle } from 'react'
import { MotiView, AnimatePresence } from 'moti'
import { AccessibilityInfo, LayoutChangeEvent, StyleSheet } from 'react-native'
import { tw } from 'design-system/tailwind'

type ShowParams = { message?: string; hideAfter?: number; element?: React.ReactElement }

type Toast = {
	show: (params: ShowParams) => void
	hide: () => void
	isVisible: boolean
}

export const Toast = React.createRef<Toast | undefined>()

const TOAST_DIMENSIONS = { width: 244, height: 60 }
const SAFE_AREA_TOP = 44

export const ToastProvider = ({ children }: any) => {
	const [show, setShow] = useState(false)
	const [message, setMessage] = useState<string | undefined>()
	const [render, setRender] = useState<React.ReactElement | null>()
	const [layout, setLayout] = useState<LayoutChangeEvent['nativeEvent']['layout'] | undefined>()

	useImperativeHandle(
		Toast,
		() => ({
			show: ({ message, hideAfter, element }: ShowParams) => {
				if (!show) {
					setRender(element)
					setMessage(message)
					setShow(true)

					if (message) {
						AccessibilityInfo.announceForAccessibility(message)
					}

					if (hideAfter) {
						setTimeout(() => {
							setShow(false)
						}, hideAfter)
					}
				}
			},
			hide: () => {
				setShow(false)
			},
			isVisible: show,
		}),
		[show, setShow]
	)

	const toastHeight = layout?.height ?? 0

	return (
		<>
			{children}
			<AnimatePresence>
				{show ? (
					<Portal>
						<MotiView
							style={[
								styles.toastContainer,
								{ opacity: layout ? 1 : 0 },
								tw.style('bg-white dark:bg-black shadow-black dark:shadow-white'),
							]}
							accessibilityLiveRegion="polite"
							pointerEvents="box-none"
							from={{ translateY: -toastHeight }}
							animate={{ translateY: SAFE_AREA_TOP }}
							exit={{ translateY: -toastHeight }}
							transition={{ type: 'timing', duration: 350 }}
							onDidAnimate={(key, finished, _value, fourth) => {
								if (
									key === 'translateY' &&
									finished &&
									fourth.attemptedValue === -TOAST_DIMENSIONS.height
								) {
									setLayout(undefined)
								}
							}}
							onLayout={e => {
								setLayout(e.nativeEvent.layout)
							}}
						>
							{render ? (
								render
							) : (
								<Text tw="text-center p-4 dark:text-white text-gray-900">{message}</Text>
							)}
						</MotiView>
					</Portal>
				) : null}
			</AnimatePresence>
		</>
	)
}

const styles = StyleSheet.create({
	toastContainer: {
		alignSelf: 'center',
		borderRadius: 16,
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.1,
		shadowRadius: 16,
		elevation: 5,
		justifyContent: 'center',
	},
})
