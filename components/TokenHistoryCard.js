import React from "react";
import { truncateWithEllipses } from "../lib/utilities";
import Link from "next/link";
import { format } from "date-fns";

export default function TokenHistoryCard({ history }) {
  return (
    <div className="px-4 py-2 flex flex-col border-2 border-gray-300 rounded-xl md:w-max">
      {history.map((entry) => (
        <div className="hover:text-stpink py-2" key={entry.timestamp}>
          <Link href="/[profile]" as={`/${entry.address}`}>
            <a>
              <div>{truncateWithEllipses(entry.name, 26)}</div>
              {entry.timestamp && (
                <div className="text-gray-500">
                  {format(new Date(entry.timestamp), "PPpp")}
                </div>
              )}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
