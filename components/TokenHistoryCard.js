import React, { useState, useEffect } from "react";
import { truncateWithEllipses } from "../lib/utilities";
import Link from "next/link";
import { format } from "date-fns";
import backend from "../lib/backend";

export default function TokenHistoryCard({ nftId }) {
  const [nftHistory, setNftHistory] = useState();
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    setLoadingHistory(true);
    const getNFTHistory = async (nftId) => {
      setLoadingHistory(true);
      const historyData = await backend.get(`/v1/nft_history/${nftId}`);
      const {
        data: {
          data: { history, show_quantity: multiple },
        },
      } = historyData;
      setNftHistory({ history, multiple });
      setLoadingHistory(false);
    };
    getNFTHistory(nftId);
    return () => setNftHistory(null);
  }, [nftId]);
  if (loadingHistory) {
    return (
      <div className="text-center my-4">
        <div className="loading-card-spinner" />
      </div>
    );
  }
  return (
    <div className="px-4 py-2 flex flex-col border-2 border-gray-300 rounded-xl w-full">
      {nftHistory && nftHistory.history ? (
        nftHistory.history.map((entry) => (
          <div className="py-2" key={entry.timestamp}>
            <div className="flex">
              {entry.from_address ? (
                <>
                  <Link
                    href="/[profile]"
                    as={`/${entry.from_username || entry.from_address}`}
                  >
                    <a>
                      <div className="flex items-center hover:text-stpink">
                        <img
                          src={
                            entry.from_img_url ||
                            "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                          }
                          style={{ width: 24, height: 24 }}
                          className="rounded-full mr-2"
                        />
                        <div>
                          {truncateWithEllipses(
                            entry.from_username || entry.from_name,
                            26
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                  <div className="px-3">{" → "}</div>
                </>
              ) : (
                <div className="mr-2">Created by</div>
              )}
              <Link
                href="/[profile]"
                as={`/${entry.to_username || entry.to_address}`}
              >
                <a>
                  <div className="flex items-center hover:text-stpink">
                    <img
                      src={
                        entry.to_img_url ||
                        "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                      }
                      style={{ width: 24, height: 24 }}
                      className="rounded-full mr-2"
                    />
                    <div>
                      {truncateWithEllipses(
                        entry.to_username || entry.to_name,
                        26
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            {entry.timestamp && (
              <div className="text-gray-500 text-sm">
                {format(new Date(`${entry.timestamp}Z`), "PPp")}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-4 my-2 bg-gray-100 rounded-xl">No history found.</div>
      )}
    </div>
  );
}
