import React from "react";
import { truncateWithEllipses } from "../lib/utilities";
import { format } from "date-fns";

export default function UserTimestampCard({ name, imageUrl, timestamp }) {
  return (
    <div className="flex items-center md:w-max border-2 border-gray-300 rounded-xl p-4 hover:text-stpink hover:border-stpink">
      <div className="mr-4">
        <img
          alt={name}
          src={
            imageUrl
              ? imageUrl
              : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
          }
          className="rounded-full"
          style={{ height: 48, width: 48 }}
        />
      </div>
      <div className="">
        <div className="text-lg">{truncateWithEllipses(name, 26)}</div>
        {timestamp && (
          <div className="text-gray-500">
            {format(new Date(timestamp), "PPp")}
          </div>
        )}
      </div>
    </div>
  );
}
