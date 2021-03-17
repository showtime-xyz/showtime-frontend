import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { truncateWithEllipses, formatAddressShort } from "../lib/utilities";
import Link from "next/link";
import { format } from "date-fns";
import backend from "../lib/backend";
import AppContext from "../context/app-context";

export default function TokenHistoryCard({ nftId }) {
  const context = useContext(AppContext);
  const { isMobile } = context;
  const [nftHistory, setNftHistory] = useState();
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingMoreHistory, setLoadingMoreHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);

  const getNFTHistory = async (nftId) => {
    const historyData = await backend.get(
      `/v1/nft_history/${nftId}${hasMoreHistory ? "" : "?limit=10"}`
    );
    const {
      data: {
        data: { history, show_quantity: multiple, has_more: hasMore },
      },
    } = historyData;
    setNftHistory({ history, multiple });
    setLoadingHistory(false);
    setHasMoreHistory(hasMore);
  };
  useEffect(() => {
    setHasMoreHistory(false);
    setLoadingHistory(true);
    setLoadingMoreHistory(false);
    getNFTHistory(nftId);
    return () => setNftHistory(null);
  }, [nftId]);

  const handleGetMoreHistory = async () => {
    setLoadingMoreHistory(true);
    await getNFTHistory(nftId);
    setLoadingMoreHistory(false);
    setHasMoreHistory(false);
  };

  if (loadingHistory) {
    return (
      <div className="text-center my-4">
        <div className="loading-card-spinner" />
      </div>
    );
  }
  return (
    <div className="p-2 md:p-4 flex flex-col border-2 border-gray-300 rounded-xl w-full">
      {nftHistory && nftHistory.history && nftHistory.history.length > 0 ? (
        nftHistory.history.map((entry) => (
          <div
            className="p-3 hover:bg-gray-100 rounded-xl"
            key={`${entry.timestamp}${entry.from_address}${entry.to_address}`}
          >
            <div className="flex flex-col md:flex-row">
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
                            entry.from_username ||
                              entry.from_name ||
                              formatAddressShort(entry.from_address),
                            26
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                  {isMobile ? (
                    <div className="p-2 w-max text-gray-400">{`Sent ${
                      nftHistory.multiple ? entry.quantity : ""
                    } to ↓ `}</div>
                  ) : (
                    <div className="px-3 w-max text-gray-400">{`${
                      nftHistory.multiple ? entry.quantity : ""
                    } → `}</div>
                  )}
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
                        entry.to_username ||
                          entry.to_name ||
                          formatAddressShort(entry.to_address),
                        26
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            {entry.timestamp && (
              <div className="text-gray-500 text-sm">
                {format(new Date(entry.timestamp), "PPp")}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-4 bg-gray-100 rounded-xl">No history found.</div>
      )}
      {hasMoreHistory && (
        <div className="flex flex-row items-center my-2 justify-center">
          {!loadingMoreHistory ? (
            <div
              className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-200 rounded-full hover:text-stpink hover:border-stpink cursor-pointer"
              onClick={handleGetMoreHistory}
            >
              <div className="mr-2 text-sm text-black">Show All</div>
              <div>
                <FontAwesomeIcon style={{ height: 12 }} icon={faArrowDown} />
              </div>
            </div>
          ) : (
            <div className="p-1">
              <div className="loading-card-spinner-small" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
