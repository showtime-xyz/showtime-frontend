import Axios from 'axios'

const axios = Axios.create({
	withCredentials: true,
	headers: {
		'x-requested-with': 'XMLHttpRequest',
	},
})

export default axios
