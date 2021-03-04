import React from "react";
import { truncateWithEllipses } from "../lib/utilities";
import Link from "next/link";

export default function TokenHistoryCard({ history }) {
  return (
    <div className="p-4 flex flex-col border-2 border-gray-300 rounded-xl w-max">
      {history.map((entry) => (
        <div className="hover:text-stpink">
          <Link href="/[profile]" as={`/${entry.address}`}>
            <a>
              <div>{truncateWithEllipses(entry.name, 26)}</div>
              <div className="text-gray-400">{entry.timestamp}</div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
