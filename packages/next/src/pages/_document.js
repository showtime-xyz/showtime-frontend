import { getInitialProps } from '@expo/next-adapter/document'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

class Document extends NextDocument {
	render() {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="UTF-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					{/* preload fonts */}
					<link rel="stylesheet" href="/fonts/showtime.css" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
					<link rel="preload" href="/fonts/woff2/Afronaut.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
					<link rel="preload" href="/fonts/woff/Afronaut.woff" as="font" type="font/woff" crossOrigin="anonymous" />
				</Head>
				<body className="!max-w-screen">
					{/* Here we will mount our modal portal */}
					<div id="modal" />
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

Document.getInitialProps = getInitialProps

export default Document
