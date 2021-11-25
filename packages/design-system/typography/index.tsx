// Based on https://github.com/rainbow-me/rainbow/blob/%40markdalgleish/design-system/src/design-system/typography/typography.ts

import { precomputeValues } from '@capsizecss/core'
import { Platform, PixelRatio } from 'react-native'

export const fontFamily = (font: string) => {
	if (Platform.OS === 'web') {
		return font.replace(/\-/g, ' ')
	}

	return font
}

const capsize = (options: Parameters<typeof precomputeValues>[0]) => {
	const values = precomputeValues(options)
	const fontSize = parseFloat(values.fontSize)
	const baselineTrimEm = parseFloat(values.baselineTrim)
	const capHeightTrimEm = parseFloat(values.capHeightTrim)
	const fontScale = PixelRatio.getFontScale()

	return {
		fontSize,
		lineHeight: values.lineHeight !== 'normal' ? parseFloat(values.lineHeight) : undefined,
		marginBottom: PixelRatio.roundToNearestPixel(baselineTrimEm * fontSize * fontScale),
		marginTop: PixelRatio.roundToNearestPixel(capHeightTrimEm * fontSize * fontScale),
	} as const
}

// Sourced from https://seek-oss.github.io/capsize
const fontMetrics = {
	capHeight: 2048,
	ascent: 2728,
	descent: -680,
	lineGap: 0,
	unitsPerEm: 2816,
}

const createTextSize = ({
	fontSize,
	lineHeight: leading,
	letterSpacing,
	marginCorrection,
}: {
	fontSize: number
	lineHeight: number
	letterSpacing: number
	marginCorrection: {
		ios: number
		android: number
	}
}) => {
	const styles = {
		letterSpacing,
		...capsize({
			fontMetrics,
			fontSize,
			leading,
		}),
	} as const

	const marginCorrectionForPlatform = marginCorrection[Platform.OS] ?? 0

	return {
		...styles,
		marginTop: PixelRatio.roundToNearestPixel(styles.marginTop + marginCorrectionForPlatform),
		marginBottom: PixelRatio.roundToNearestPixel(styles.marginBottom - marginCorrectionForPlatform),
	}
}

export const textSizes = {
	'text-xs': createTextSize({
		fontSize: 12,
		letterSpacing: 0.6,
		lineHeight: 15,
		marginCorrection: {
			android: -0.1,
			ios: -0.3,
		},
	}),
	'text-sm': createTextSize({
		fontSize: 14,
		letterSpacing: 0.6,
		lineHeight: 17,
		marginCorrection: {
			android: -0.1,
			ios: -0.3,
		},
	}),
	'text-base': createTextSize({
		fontSize: 16,
		letterSpacing: 0.5,
		lineHeight: 19,
		marginCorrection: {
			android: -0.1,
			ios: -0.5,
		},
	}),
	'text-lg': createTextSize({
		fontSize: 18,
		letterSpacing: 0.5,
		lineHeight: 21,
		marginCorrection: {
			android: 0.2,
			ios: 0,
		},
	}),
	'text-xl': createTextSize({
		fontSize: 20,
		letterSpacing: 0.6,
		lineHeight: 23,
		marginCorrection: {
			android: 0,
			ios: -0.5,
		},
	}),
	'text-2xl': createTextSize({
		fontSize: 24,
		letterSpacing: 0.6,
		lineHeight: 27,
		marginCorrection: {
			android: -0.3,
			ios: -0.3,
		},
	}),
	'text-3xl': createTextSize({
		fontSize: 30,
		letterSpacing: 0.6,
		lineHeight: 33,
		marginCorrection: {
			android: -0.3,
			ios: -0.3,
		},
	}),
	'text-4xl': createTextSize({
		fontSize: 36,
		letterSpacing: 0.6,
		lineHeight: 41,
		marginCorrection: {
			android: -0.3,
			ios: -0.3,
		},
	}),
} as const
