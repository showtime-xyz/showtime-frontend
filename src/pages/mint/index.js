export async function getServerSideProps() {
	return {
		redirect: {
			destination: '/mint/image',
			permanent: true,
		},
	}
}

const RedirectURL = () => null

export default RedirectURL
