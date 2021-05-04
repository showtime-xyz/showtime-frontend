import ScrollUpButton from 'react-scroll-up-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

export default function ScrollUp() {
	return (
		<ScrollUpButton ContainerClassName="scrollUpButton" TransitionClassName="scrollUpButtonTransition">
			<FontAwesomeIcon className="text-white w-8 h-8" icon={faChevronUp} />
		</ScrollUpButton>
	)
}
