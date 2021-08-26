/*
export async function getServerSideProps({ query: { slug } }) {
	return {
		redirect: {
			destination: `/${slug}`,
			permanent: true,
		},
	}
}

const RedirectURL = () => null

export default RedirectURL
*/

import { useEffect } from 'react'
export default function redirect() {
	useEffect(() => {
		window.location.assign('https://claim.tryshowtime.com//')
	})
	return <></>
}
