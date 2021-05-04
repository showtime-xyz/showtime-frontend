module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		commonjs: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
		route: 'readonly',
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['react', 'react-hooks'],
	rules: {
		indent: 'off',
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'never'],
		'react/no-unescaped-entities': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
	},
	reportUnusedDisableDirectives: true,
}
