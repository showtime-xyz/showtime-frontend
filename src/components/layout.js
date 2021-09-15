import Head from 'next/head'
import PropTypes from 'prop-types'
//import backend from "../lib/backend";
import Footer from './footer'
import Header from './header'
import { useTheme } from 'next-themes'
import Script from 'next/script'

const Layout = ({ children }) => {
	const { resolvedTheme } = useTheme()

	return (
		<>
			<Head>
				<link rel="icon" href="/logo_sm.png" />

				<meta name="keywords" content="showtime, ethereum, token, nft" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />

				<script
					dangerouslySetInnerHTML={{
						__html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', 'G-EJP74KCP4M');
         `,
					}}
				/>

				<meta name="theme-color" content={resolvedTheme === 'dark' ? '#171717' : '#ffffff'} />
			</Head>
			<Script src="https://www.googletagmanager.com/gtag/js?id=G-EJP74KCP4M" strategy="afterInteractive" />
			<div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black tracking-wide">
				<Header />
				<div className="w-full mx-auto flex-1 z-0 relative flex flex-col">
					<main className="flex-1 flex flex-col">{children}</main>
				</div>

				<Footer />
			</div>
		</>
	)
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Layout
