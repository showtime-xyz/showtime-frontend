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
}: {
	fontSize: number
	lineHeight: number
	letterSpacing: number
}) => {
	return {
		letterSpacing,
		...capsize({
			fontMetrics,
			fontSize,
			leading,
		}),
	}
}

export const headingSizes = {
	title: createTextSize({
		fontSize: 23,
		letterSpacing: 0.6,
		lineHeight: 27,
	}),
	heading: createTextSize({
		fontSize: 20,
		letterSpacing: 0.6,
		lineHeight: 24,
	}),
} as const

export const textSizes = {
	body: createTextSize({
		fontSize: 16,
		letterSpacing: 0.5,
		lineHeight: 24,
	}),
	small: createTextSize({
		fontSize: 14,
		letterSpacing: 0.6,
		lineHeight: 17,
	}),
} as const
