import { makeTheme } from 'dripsy'
import { Platform } from 'react-native'

import { fontFamily, textSizes, headingSizes } from 'design-system/typography'

const webFont = (font: string) => {
	return Platform.select({
		web: `"${fontFamily(
			font
		)}", Arial, Helvetica Neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
		default: font,
	})
}

const theme = makeTheme({
	space: [],
	fontSizes: [],
	fonts: {
		root: 'Inter',
		inter: 'Inter',
	},
	customFonts: {
		Inter: {
			bold: webFont('Inter-Bold'),
			default: webFont('Inter-Regular'),
			normal: webFont('Inter-Regular'),
			100: webFont('Inter-Thin'),
			200: webFont('Inter-ExtraLight'),
			300: webFont('Inter-Light'),
			400: webFont('Inter-Regular'),
			500: webFont('Inter-Semibold'),
			600: webFont('Inter-Bold'),
			700: webFont('Inter-Bold'),
			800: webFont('Inter-ExtraBold'),
			900: webFont('Inter-Black'),
		},
	},
	text: {
		body: {
			fontWeight: 'default',
			...textSizes.body,
		},
		small: {
			fontWeight: 'default',
			...textSizes.small,
		},
		title: {
			fontWeight: 900,
			...headingSizes.title,
		},
		heading: {
			fontWeight: 'bold',
			...headingSizes.heading,
		},
	},
})

type MyTheme = typeof theme

declare module 'dripsy' {
	interface DripsyCustomTheme extends MyTheme {}
}

export { theme }
