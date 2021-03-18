import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { truncateWithEllipses, formatAddressShort } from "../lib/utilities";
import Link from "next/link";
import { format } from "date-fns";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import styled from "styled-components";

const HistoryTableHeader = styled.td`
  white-space: nowrap;
  width: fit-content;
  padding: 0.5rem 1rem 0.5rem 1rem;
  text-overflow: ellipsis;
`;

const HistoryTableData = styled.td`
  white-space: nowrap;
  padding: 0.75rem 1rem;
  text-overflow: ellipsis;
`;

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
    <>
      <div
        className={`py-2 flex flex-col border-2 border-gray-300 rounded-xl overflow-x-scroll w-full ${
          isMobile ? "overflow-x-scroll" : ""
        }`}
      >
        {nftHistory && nftHistory.history && nftHistory.history.length > 0 ? (
          <table className="table-auto text-sm" style={{ borderSpacing: 50 }}>
            <tr className="text-left text-gray-400 text-base">
              <HistoryTableHeader>From</HistoryTableHeader>
              <HistoryTableHeader>To</HistoryTableHeader>
              {nftHistory.multiple && (
                <HistoryTableHeader>Qty</HistoryTableHeader>
              )}
              <HistoryTableHeader>Transfer Date</HistoryTableHeader>
            </tr>
            {nftHistory.history.map((entry) => (
              <tr
                key={`${entry.timestamp}${entry.from_address}${entry.to_address}`}
              >
                <HistoryTableData
                  className={!entry.from_address ? "bg-gray-100" : ""}
                >
                  {entry.from_address ? (
                    <Link
                      href="/[profile]"
                      as={`/${entry.from_username || entry.from_address}`}
                    >
                      <a>
                        <div className="flex items-center hover:text-stpink w-max">
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
                  ) : (
                    <p>Created</p>
                  )}
                </HistoryTableData>
                <HistoryTableData
                  className={!entry.from_address ? "bg-gray-100" : ""}
                >
                  <Link
                    href="/[profile]"
                    as={`/${entry.to_username || entry.to_address}`}
                  >
                    <a>
                      <div className="flex items-center hover:text-stpink w-max">
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
                </HistoryTableData>
                {nftHistory.multiple && (
                  <HistoryTableData
                    className={!entry.from_address ? "bg-gray-100" : ""}
                  >
                    {entry.quantity}
                  </HistoryTableData>
                )}
                <HistoryTableData
                  className={!entry.from_address ? "bg-gray-100" : ""}
                >
                  {format(new Date(entry.timestamp), "PPp")}
                </HistoryTableData>
              </tr>
            ))}
          </table>
        ) : (
          <div className="p-4 m-2 bg-gray-100 rounded-xl">
            No history found.
          </div>
        )}
      </div>
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
    </>
  );
}
