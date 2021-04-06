import React from "react";
import Link from "next/link";
import UserImageList from "../UserImageList";

export default function Follow({ act }) {
  const { counterparties } = act;
  const count = counterparties?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[0]?.username || counterparties[0]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[0].name}
              </a>
            </Link>
            .
          </>
        )}
        {count === 2 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[0]?.username || counterparties[0]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[0].name}
              </a>
            </Link>{" "}
            and{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[1]?.username || counterparties[1]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[1].name}
              </a>
            </Link>
            .
          </>
        )}
        {count === 3 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[0]?.username || counterparties[0]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[0].name}
              </a>
            </Link>
            ,{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[1]?.username || counterparties[1]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[1].name}
              </a>
            </Link>{" "}
            and{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[2]?.username || counterparties[2]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[2].name}
              </a>
            </Link>
            .
          </>
        )}
        {count > 3 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[0]?.username || counterparties[0]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[0].name}
              </a>
            </Link>
            ,{" "}
            <Link
              href="/[profile]"
              as={`/${
                counterparties[1]?.username || counterparties[1]?.wallet_address
              }`}
            >
              <a className="text-black hover:text-stpink">
                {counterparties[1].name}
              </a>
            </Link>{" "}
            and {count - 2} others.
          </>
        )}
      </div>
      <div className="flex mt-2">
        <UserImageList users={counterparties} />
      </div>
    </div>
  );
}
