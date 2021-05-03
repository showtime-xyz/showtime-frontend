import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet()

		// Step 2: Retrieve styles from components in the page
		const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement()

		// Step 4: Pass styleTags as a prop
		return { ...page, styleTags }
	}
	render() {
		return (
			<Html>
				<Head>
					{/* preload fonts */}
					<link rel="stylesheet" href="/fonts/showtime.css" />
					<link rel="preload" href="/fonts/woff2/Tomato Grotesk Medium.woff2" as="font" type="font/woff2" />
					<link rel="preload" href="/fonts/woff/Tomato Grotesk Medium.woff" as="font" type="font/woff" />
					<link rel="preload" href="/fonts/woff2/Afronaut.woff2" as="font" type="font/woff2" />
					<link rel="preload" href="/fonts/woff/Afronaut.woff" as="font" type="font/woff" />
					{this.props.styleTags}
				</Head>
				<body>
					{/* Here we will mount our modal portal */}
					<div id="modal" />
					<Main />

					<NextScript />
				</body>
			</Html>
		)
	}
}
