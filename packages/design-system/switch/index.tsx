import { useCallback, ComponentProps } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView, AnimatePresence, motify } from 'moti'
import { Platform, Pressable, StyleSheet } from 'react-native'
import { View } from '../view'
import { Extrapolate } from 'react-native-reanimated'
import { useIsDarkMode } from '../hooks'

const width = 50
const height = 28
const thumbHeight = 24
const thumbWidth = 24
const thumbOffset = 2

const MotiGradient = motify(LinearGradient)()

type SwitchProps = {
	accessibilityLabel?: string
	checked?: boolean
	onChange?: (nextValue: boolean) => void
}

export const Switch = (props: SwitchProps) => {
	const { checked, onChange, accessibilityLabel } = props

	const isDark = useIsDarkMode()

	const checkedColor = ['#C4B5FD', '#8B5CF6', '#4C1D95']
	const uncheckedColor = isDark ? ['#3F3F46', '#3F3F46', '#3F3F46'] : ['#D4D4D8', '#D4D4D8', '#D4D4D8']

	return (
		<Pressable
			style={styles.pressableStyle}
			onPress={useCallback(() => {
				onChange(!checked)
			}, [onChange, checked])}
			accessibilityRole="switch"
			accessibilityState={{ checked }}
			accessibilityLabel={accessibilityLabel}
		>
			<View style={styles.gradientWrapper}>
				{Platform.OS === 'web' ? (
					<LinearGradient
						colors={checked ? checkedColor : uncheckedColor}
						start={[0, 1]}
						end={[1, 0]}
						locations={[0, 0.4, 1]}
						style={{ width, height }}
					/>
				) : (
					<AnimatedGradient
						colors={checked ? checkedColor : uncheckedColor}
						start={[0, 1]}
						end={[1, 0]}
						locations={[0, 0.4, 1]}
						style={{ width, height }}
					/>
				)}
			</View>
			<MotiView
				style={styles.thumbStyle}
				animate={{
					translateX: checked ? width - thumbWidth - thumbOffset : thumbOffset,
				}}
				transition={{ overshootClamping: Extrapolate.CLAMP }}
			/>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	thumbStyle: {
		position: 'absolute',
		height: thumbHeight,
		width: thumbWidth,
		backgroundColor: 'white',
		borderRadius: 999,
	},
	pressableStyle: {
		justifyContent: 'center',
		width,
	},
	gradientWrapper: { overflow: 'hidden', borderRadius: 999 },
})

const AnimatedGradient = ({ colors, ...rest }: ComponentProps<typeof MotiGradient>) => {
	return (
		<AnimatePresence initial={false}>
			<View>
				<MotiGradient
					key={colors.join('')}
					colors={colors}
					from={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: 'timing', duration: 400 }}
					{...rest}
				/>
			</View>
		</AnimatePresence>
	)
}
