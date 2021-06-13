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
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
