import { useState, useEffect } from "react";
import { DEFAULT_PROFILE_PIC } from "@/lib/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { truncateWithEllipses, formatAddressShort } from "@/lib/utilities";
import Link from "next/link";
import backend from "@/lib/backend";
import { formatDistanceToNowStrict } from "date-fns";

export default function TokenHistoryCard({ nftId, closeModal }) {
  const [nftHistory, setNftHistory] = useState();
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingMoreHistory, setLoadingMoreHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);

  const getNFTHistory = async (nftId) => {
    const historyData = await backend.get(
      `/v1/nft_history/${nftId}${hasMoreHistory ? "" : "?limit=7"}`
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
        <div className="inline-block border-4 w-12 h-12 rounded-full border-gray-100 border-t-gray-800 animate-spin" />
      </div>
    );
  }
  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden flex flex-col border-2 border-gray-300 dark:border-gray-800 rounded-xl w-full h-full">
        {nftHistory && nftHistory.history && nftHistory.history.length > 0 ? (
          <table
            className="table-auto text-sm w-full h-full overflow-auto"
            style={{ borderSpacing: 50 }}
          >
            <tbody>
              {nftHistory.history.length == 1 &&
              !nftHistory.history[0].from_address ? null : (
                <tr className="text-left text-gray-400 text-sm">
                  <td className="truncate px-4 py-4 w-[fit-content]">From</td>
                  <td className="truncate px-4 py-4 w-[fit-content]">To</td>
                  {nftHistory.multiple && (
                    <td className="truncate px-2 py-4 w-[fit-content] text-right">
                      Qty
                    </td>
                  )}
                  <td className="truncate px-4 py-4 w-[fit-content]">Date</td>
                </tr>
              )}
              {nftHistory.history.map((entry) => (
                <tr
                  key={`${entry.timestamp}${entry.from_address}${entry.to_address}`}
                >
                  <td
                    className={`truncate py-3 px-4 ${
                      !entry.from_address
                        ? `border-t-2 border-gray-100 dark:border-gray-800 rounded-bl-xl ${
                            nftHistory.history.length == 1
                              ? "rounded-tl-xl"
                              : null
                          }`
                        : ""
                    }`}
                  >
                    {entry.from_address ? (
                      <Link
                        href="/[profile]"
                        as={`/${entry.from_username || entry.from_address}`}
                      >
                        <a onClick={closeModal}>
                          <div className="flex items-center dark:text-gray-300 hover:text-stpink dark:hover:text-stpink transition-all w-max">
                            <img
                              src={entry.from_img_url || DEFAULT_PROFILE_PIC}
                              className="rounded-full mr-2 w-6 h-6"
                            />
                            <div>
                              {truncateWithEllipses(
                                entry.from_name ||
                                  entry.from_username ||
                                  formatAddressShort(entry.from_address),
                                26
                              )}
                            </div>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className="text-gray-400">Created</div>
                    )}
                  </td>
                  <td
                    className={`truncate py-3 px-4 ${
                      !entry.from_address
                        ? "border-t-2 border-gray-100 dark:border-gray-800 flex flex-row"
                        : ""
                    }`}
                  >
                    {entry.to_address ? (
                      <Link
                        href="/[profile]"
                        as={`/${entry.to_username || entry.to_address}`}
                      >
                        <a onClick={closeModal}>
                          <div className="flex items-center dark:text-gray-300 hover:text-stpink dark:hover:text-stpink transition-all w-max">
                            <img
                              src={entry.to_img_url || DEFAULT_PROFILE_PIC}
                              className="rounded-full mr-2 w-6 h-6"
                            />
                            <div>
                              {truncateWithEllipses(
                                entry.to_name ||
                                  entry.to_username ||
                                  formatAddressShort(entry.to_address),
                                26
                              )}
                            </div>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <div className="text-gray-400">Deleted</div>
                    )}
                  </td>
                  {nftHistory.multiple && (
                    <td
                      className={`truncate py-3 px-4 dark:text-gray-400 ${
                        !entry.from_address
                          ? "border-t-2 border-gray-100 dark:border-gray-800 text-right"
                          : "text-right"
                      }`}
                    >
                      {entry.quantity}
                    </td>
                  )}
                  <td
                    className={`truncate py-3 px-4 dark:text-gray-500 ${
                      !entry.from_address
                        ? `border-t-2 border-gray-100 dark:border-gray-800 rounded-br-xl ${
                            nftHistory.history.length == 1
                              ? "rounded-tr-xl"
                              : null
                          }`
                        : ""
                    }`}
                  >
                    {formatDistanceToNowStrict(new Date(entry.timestamp), {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-2 px-4 dark:text-gray-400 border-t-2 border-gray-100 dark:border-gray-800 rounded-xl text-sm">
            No history found.
          </div>
        )}
      </div>
      {hasMoreHistory && (
        <div className="flex flex-row items-center my-2 justify-center">
          {!loadingMoreHistory ? (
            <div
              className="text-center px-4 py-1 flex items-center w-max border-2 border-gray-300 dark:border-gray-800 rounded-full dark:text-gray-500 hover:text-stpink dark:hover:text-stpink hover:border-stpink dark:hover:border-stpink cursor-pointer transition-all"
              onClick={handleGetMoreHistory}
            >
              <div className="mr-2 text-sm">Show All</div>
              <div>
                <FontAwesomeIcon className="h-3" icon={faArrowDown} />
              </div>
            </div>
          ) : (
            <div className="p-1">
              <div className="inline-block w-6 h-6 border-2 border-gray-100 border-t-gray-800 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
