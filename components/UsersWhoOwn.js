import React, { useState } from "react";
import Link from "next/link";
import ModalUserList from "./ModalUserList";

const UserImagesList = ({ users }) => {
  const displayedUsers = users.slice(0, 5);
  return (
    <div className="flex mb-2">
      {displayedUsers.map((u) => (
        <Link href="/[profile]" as={`/${u.username || u.wallet_address}`}>
          <a className="rounded-full mr-2">
            <img src={u.img_url} className="w-12 h-12 rounded-full" />
          </a>
        </Link>
      ))}
    </div>
  );
};

export default function UsersWhoOwn({ users, closeModal }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <div className="text-xs md:text-sm mt-3 text-gray-400">
      {users.length === 1 && (
        <div className="flex flex-col">
          <UserImagesList users={users} />
          <div>
            <Link
              href="/[profile]"
              as={`/${users[0]?.username || users[0].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[0].name}
              </span>
            </Link>
          </div>
        </div>
      )}
      {users.length === 2 && (
        <div className="flex flex-col">
          <UserImagesList users={users} />
          <div>
            <Link
              href="/[profile]"
              as={`/${users[0]?.username || users[0].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[0].name}
              </span>
            </Link>{" "}
            and{" "}
            <Link
              href="/[profile]"
              as={`/${users[1]?.username || users[1].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[1].name}
              </span>
            </Link>
          </div>
        </div>
      )}
      {users.length === 3 && (
        <div className="flex flex-col">
          <UserImagesList users={users} />
          <div>
            <Link
              href="/[profile]"
              as={`/${users[0]?.username || users[0].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[0].name}
              </span>
            </Link>
            ,{" "}
            <Link
              href="/[profile]"
              as={`/${users[1]?.username || users[1].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[1].name}
              </span>
            </Link>{" "}
            and{" "}
            <Link
              href="/[profile]"
              as={`/${users[2]?.username || users[2].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[2].name}
              </span>
            </Link>
          </div>
        </div>
      )}
      {users.length > 3 && (
        <div className="flex flex-col">
          <UserImagesList users={users} />
          <div>
            <Link
              href="/[profile]"
              as={`/${users[0]?.username || users[0].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[0].name}
              </span>
            </Link>
            ,{" "}
            <Link
              href="/[profile]"
              as={`/${users[1]?.username || users[1].wallet_address}`}
            >
              <span
                className="text-black cursor-pointer hover:text-stpink"
                onClick={closeModal}
              >
                {users[1].name}
              </span>
            </Link>{" "}
            and{" "}
            <span
              className="text-black cursor-pointer hover:text-stpink"
              onClick={() => setModalIsOpen(true)}
            >
              {users.length - 2} others
            </span>
            <ModalUserList
              isOpen={modalIsOpen}
              title="Owned By"
              users={users}
              closeModal={() => setModalIsOpen(false)}
              emptyMessage="Nobody owns this yet."
              onRedirect={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
