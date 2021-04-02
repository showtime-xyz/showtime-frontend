import React from "react";
import Link from "next/link";
import UserImageList from "../UserImageList";

export default function Follow({ act }) {
  const { followed } = act;
  const count = followed?.length;
  return (
    <div className="flex flex-col">
      <div className="text-gray-500">
        {count === 1 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${followed[0]?.username || followed[0]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[0].name}</a>
            </Link>
            .
          </>
        )}
        {count === 2 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${followed[0]?.username || followed[0]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[0].name}</a>
            </Link>{" "}
            and{" "}
            <Link
              href="/[profile]"
              as={`/${followed[1]?.username || followed[1]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[1].name}</a>
            </Link>
            .
          </>
        )}
        {count === 3 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${followed[0]?.username || followed[0]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[0].name}</a>
            </Link>
            ,{" "}
            <Link
              href="/[profile]"
              as={`/${followed[1]?.username || followed[1]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[1].name}</a>
            </Link>{" "}
            and{" "}
            <Link
              href="/[profile]"
              as={`/${followed[2]?.username || followed[2]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[2].name}</a>
            </Link>
            .
          </>
        )}
        {count > 3 && (
          <>
            Followed{" "}
            <Link
              href="/[profile]"
              as={`/${followed[0]?.username || followed[0]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[0].name}</a>
            </Link>
            ,{" "}
            <Link
              href="/[profile]"
              as={`/${followed[1]?.username || followed[1]?.wallet_address}`}
            >
              <a className="text-black hover:text-stpink">{followed[1].name}</a>
            </Link>{" "}
            and {count - 2} others.
          </>
        )}
      </div>
      <div className="flex mt-2">
        <UserImageList users={followed} />
      </div>
    </div>
  );
}
