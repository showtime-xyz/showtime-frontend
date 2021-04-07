import React from "react";
import ActivityCard from "./ActivityCard";

export default function ActivityFeed({ activity, setItemOpenInModal }) {
  return (
    <>
      {activity.map((act) => (
        <ActivityCard
          act={act}
          key={act.id}
          setItemOpenInModal={setItemOpenInModal}
        />
      ))}
    </>
  );
}
