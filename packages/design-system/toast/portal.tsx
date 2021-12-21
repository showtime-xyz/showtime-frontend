import { Modal } from 'react-native'

export const Portal = (props: any) => {
	return <Modal focusable={false} transparent {...props} />
}
