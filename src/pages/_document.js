import Document, { Html, Head, Main, NextScript } from 'next/document'
export default class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
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
