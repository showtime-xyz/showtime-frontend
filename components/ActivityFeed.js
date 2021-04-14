import React from "react";
import ActivityCard from "./ActivityCard";

export default function ActivityFeed({ activity, setItemOpenInModal }) {
  return (
    <div className="sm:px-3">
      {activity.map((act) => (
        <ActivityCard
          act={act}
          key={act.id}
          setItemOpenInModal={setItemOpenInModal}
        />
      ))}
    </div>
  );
}
