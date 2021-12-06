import React, { useCallback } from 'react'
import { Pressable, View } from 'dripsy'
import { Path, Svg } from 'react-native-svg'
import { MotiView } from 'moti'
import { tw } from '../tailwind'
import { Platform, useColorScheme } from 'react-native'

type CheckboxProps = {
	onChange: (checked: boolean) => void
	checked: boolean
	hitSlop?: number
	accesibilityLabel: string
}

export const Checkbox = ({ checked, onChange, hitSlop = 14, accesibilityLabel }: CheckboxProps) => {
	const handleChange = useCallback(() => {
		onChange(!checked)
	}, [onChange, checked])

	const isDark = useColorScheme() === 'dark'

	const commonChild = (
		<View
			sx={{
				height: 24,
				width: 24,
				borderRadius: 4,
				borderWidth: 1,
				borderColor: '#D4D4D8',
				alignItems: 'center',
				justifyContent: 'center',
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowOpacity: 0,
				shadowRadius: 4,
			}}
			style={tw`bg-white dark:bg-gray-900`}
		>
			<MotiView
				from={{ opacity: 0 }}
				animate={{ scale: checked ? [1.08, 1] : 1, opacity: checked ? 1 : 0 }}
				transition={{ duration: 100, type: 'timing' }}
			>
				<Svg width="13" height="12" viewBox="0 0 13 12" fill="none">
					<Path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12.5735 0.180762C13.0259 0.497477 13.1359 1.12101 12.8192 1.57346L5.81923 11.5735C5.64971 11.8156 5.38172 11.9704 5.08722 11.9962C4.79273 12.022 4.50193 11.9161 4.29289 11.7071L0.292893 7.7071C-0.0976311 7.31658 -0.0976311 6.68341 0.292893 6.29289C0.683417 5.90236 1.31658 5.90236 1.70711 6.29289L4.86429 9.45007L11.1808 0.426532C11.4975 -0.0259174 12.121 -0.135952 12.5735 0.180762Z"
						fill={isDark ? '#FFFFFF' : '#18181B'}
					/>
				</Svg>
			</MotiView>
		</View>
	)

	return Platform.OS !== 'web' ? (
		<Pressable
			onPress={handleChange}
			accessibilityRole="checkbox"
			accessibilityState={{ checked }}
			accessibilityLabel={accesibilityLabel}
			hitSlop={hitSlop}
		>
			{commonChild}
		</Pressable>
	) : (
		<View>
			{commonChild}
			<input
				type="checkbox"
				checked={checked}
				onChange={handleChange}
				//@ts-ignore
				style={visuallyHiddenStyle}
			/>
		</View>
	)
}

const visuallyHiddenStyle = {
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: '1px',
	overflow: 'hidden',
	position: 'absolute',
	whiteSpace: 'nowrap',
	width: '1px',
}
