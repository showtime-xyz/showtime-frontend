const TYPES = ['image', 'video']

const MintPage = ({ type }) => {
	return null
}

export async function getStaticProps({ params: { type } }) {
	return { props: { type } }
}

export async function getStaticPaths() {
	return {
		paths: TYPES.map(type => ({ params: { type } })),
		fallback: false,
	}
}

export default MintPage
