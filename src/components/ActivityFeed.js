import ActivityCard from './ActivityCard'

export default function ActivityFeed({ activity, setItemOpenInModal, removeActorFromFeed, setReportModalIsOpen }) {
	return (
		<>
			<div className="sm:px-3">
				{activity.map(act => (
					<ActivityCard act={act} key={act.id} setItemOpenInModal={setItemOpenInModal} setReportModalIsOpen={setReportModalIsOpen} removeActorFromFeed={removeActorFromFeed} />
				))}
			</div>
		</>
	)
}
