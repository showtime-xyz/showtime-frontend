const hexToRgba = require('hex-to-rgba')
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

const buildShadow = (opacity, blur, pos, theme) => `${pos}rem 0.5rem ${blur}rem 0rem ${hexToRgba(theme('colors.rose.500'), opacity)}, -0.5rem ${pos}rem ${blur}rem 0rem ${hexToRgba(theme('colors.indigo.500'), opacity)}, 0.5rem ${pos}rem ${blur}rem 0rem ${hexToRgba(theme('colors.fuchsia.500'), opacity)}, ${pos}rem -0.5rem ${blur}rem 0rem ${hexToRgba(theme('colors.violet.500'), opacity)}`

module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			maxWidth: {
				'screen-3xl': '1680px',
				screen: '100vw',
			},
			borderRadius: {
				inherit: 'inherit',
			},
			colors: {
				inherit: 'inherit',
				stpink: '#e45cff',
				stlink: 'rgb(81, 125, 228)',
				stgreen: '#6bd464',

				stred: '#ff5151',
				stblue: '#3A80F6',
				stpurple: '#a577ff',
				styellow: '#f3bf4b',
				stpink100: 'rgba(228, 92, 255, 0.1)',
				stpurple100: 'rgba(165, 119, 255, 0.1)',
				stgreen100: 'rgba(107, 212, 100, 0.15)',
				stred100: 'rgba(255, 81, 81, 0.1)',
				stblue100: 'rgba(58, 128, 246, 0.1)',
				stgreen700: '#52a34d',
				stpurple700: '#946ce6',

				stteal: '#1dd4e0',
				stteal100: 'rgba(29, 212, 224, 0.2)',
				stteal700: '#198c94',
				gray: colors.trueGray,
				cyan: colors.cyan,
				yellow: colors.yellow,
				fuchsia: colors.fuchsia,
				violet: colors.violet,
				indigo: colors.indigo,
				rose: colors.rose,
			},
			cursor: {
				copy: 'copy',
			},
			fontSize: {
				sm2: ['.875rem', '1.7rem'],
			},
			fontFamily: {
				afro: ['Afronaut'],
				tomato: ['"Tomato Grotesk"'],
				sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
			},
			whitespace: {
				'break-spaces': 'break-spaces',
			},
			zIndex: {
				1: 1,
				2: 2,
			},
			boxShadow: theme => ({
				brand: buildShadow(0.15, 1, 0, theme),
			}),
			animation: {
				'shadow-flow': 'shadow-flow 4s ease-in-out infinite',
			},
			keyframes: theme => ({
				'shadow-flow': {
					'0%, 100%': { boxShadow: buildShadow(0.15, 1, 0, theme) },
					'50%': { boxShadow: buildShadow(0.15, 1, 0.5, theme) },
				},
			}),
		},
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'class',
		}),
	],
}
