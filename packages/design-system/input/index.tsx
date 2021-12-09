import { TextInput } from 'dripsy'
import { Pressable, Props as PressableProps } from '../pressable-scale'
import { View } from '../view'
import { tw } from '../tailwind'
import { Platform, TextInputProps, useColorScheme } from 'react-native'
import { useOnFocus, useIsDarkMode } from '../hooks'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { colors } from '../tailwind/colors'

type InputProps = {
	leftElement?: React.ReactElement
	rightElement?: React.ReactElement
	placeholder?: string
	onChangeText?: (text: string) => void
	value?: string
	isInvalid?: boolean
	id?: string
	disabled?: boolean
	type?: TextInputProps['keyboardType']
}

const borderColor = {
	dark: '#52525B',
	light: '#E4E4E7',
}

const boxShadow = {
	dark: borderColor.dark + ' 0px 0px 0px 4px',
	light: borderColor.light + ' 0px 0px 0px 4px',
}

export const Input = (props: InputProps) => {
	const { leftElement, rightElement, placeholder, onChangeText, value, disabled, type, isInvalid, id } = props
	const { onFocus, onBlur, focused } = useOnFocus()
	const colorScheme = useColorScheme()
	const isDark = useIsDarkMode()

	const animatableStyle = useAnimatedStyle(() => {
		return {
			boxShadow: Platform.OS === 'web' && focused.value ? boxShadow[colorScheme] : undefined,
			opacity: disabled ? 0.75 : 1,
		}
	}, [focused, disabled])

	return (
		<Animated.View
			style={[
				{
					flexDirection: 'row',
					alignItems: 'center',
					borderRadius: 999,
					...tw.style(`bg-gray-100 dark:bg-gray-900 ${isInvalid ? 'border-red-500 border' : ''}`),
				},
				// @ts-ignore
				animatableStyle,
			]}
		>
			{leftElement}
			<TextInput
				sx={{
					flexGrow: 1,
					paddingY: 12,
					paddingLeft: leftElement ? 0 : 16,
					paddingRight: rightElement ? 0 : 16,
					fontWeight: '500',
					...tw.style('text-gray-800 dark:text-gray-300'),
				}}
				style={{
					// @ts-ignore remove focus outline on web as we'll control the focus styling
					outline: Platform.select({ web: 'none', default: undefined }),
				}}
				placeholderTextColor={isDark ? colors.gray['400'] : colors.gray['500']}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				editable={!disabled}
				onFocus={onFocus}
				onBlur={onBlur}
				nativeID={id}
				selectionColor={isDark ? colors.gray['300'] : colors.gray['700']}
				keyboardType={type}
				disabled={disabled}
				//@ts-ignore - web only
				accessibilityInvalid={Platform.select({ web: isInvalid, default: undefined })}
			/>
			{rightElement && <View sx={{ marginLeft: 'auto' }}>{rightElement}</View>}
		</Animated.View>
	)
}

// This component adds appropriate padding to match our design system and increase the pressable area
// Usage - with rightElement and leftElement
export const InputPressable = (props: PressableProps) => {
	return <Pressable {...props} sx={{ padding: 10, ...props.sx }} />
}
