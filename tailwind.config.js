const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

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
			boxShadow: {
				dark: '0px 12px 32px 0px #FFFFFF1A, 0px 8px 12px 0px #FFFFFF1A, 0px 1px 3px 0px #FFFFFF33',
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'class',
		}),
	],
}
