import React, { useState } from "react";
import ActivityCard from "./ActivityCard";
import ModalReportItem from "./ModalReportItem";

export default function ActivityFeed({
  activity,
  setItemOpenInModal,
  removeItemFromFeed,
  removeActorFromFeed,
}) {
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  return (
    <>
      {typeof document !== "undefined" ? (
        <>
          <ModalReportItem
            isOpen={reportModalIsOpen}
            setReportModalOpen={setReportModalIsOpen}
            activityId={reportModalIsOpen}
            removeItemFromFeed={removeItemFromFeed}
          />
        </>
      ) : null}
      <div className="sm:px-3">
        {activity.map((act) => (
          <ActivityCard
            act={act}
            key={act.id}
            setItemOpenInModal={setItemOpenInModal}
            setReportModalIsOpen={setReportModalIsOpen}
            removeActorFromFeed={removeActorFromFeed}
          />
        ))}
      </div>
    </>
  );
}
