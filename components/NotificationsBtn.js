import React, { useRef, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faBell,
  faComment,
  faHeart,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import { formatDistanceToNowStrict } from "date-fns";
import { truncateWithEllipses } from "../lib/utilities";
import AppContext from "../context/app-context";
import backend from "../lib/backend";

//should get the types from db
const getNotificationInfo = (type) => {
  switch (type) {
    case 1:
      return { type: "followed_me", icon: "user", goTo: "profile" };
    case 2:
      return { type: "liked_my_creation", icon: "heart", goTo: "nft" };
    case 3:
      return { type: "liked_my_owned", icon: "heart", goTo: "nft" };
    case 4:
      return { type: "commented_my_creation", icon: "comment", goTo: "nft" };
    case 5:
      return { type: "commented_my_owned", icon: "comment", goTo: "nft" };
    default:
      return { type: "no_type", icon: "user", goTo: "profile" };
  }
};

const iconObjects = {
  comment: faComment,
  heart: faHeart,
  user: faUser,
};

const updateNotificationsLastOpened = async () => {
  await fetch(`/api/updatenotificationslastopened`, {
    method: "post",
  });
};

export default function NotificationsBtn() {
  const context = useContext(AppContext);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const toggleOpen = () => {
    if (!isActive) {
      updateNotificationsLastOpened();
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    const getNotifications = async () => {
      const res = await fetch("/api/getnotifications");
      const notifs = await res.json();
      setNotifications(notifs);
      setLoadingNotifications(false);
    };
    getNotifications();
  }, []);

  return (
    <div className="relative">
      <div
        onClick={() => {
          toggleOpen();
        }}
        className="hover:text-stpink border-gray-900 hover:border-stpink border-2 rounded-full h-9 w-9 flex items-center justify-center cursor-pointer"
      >
        <FontAwesomeIcon
          style={{
            height: 20,
            width: 20,
          }}
          icon={faBell}
        />
      </div>
      <div
        ref={dropdownRef}
        className={`text-black absolute text-center top-10 right-0 bg-white py-2 px-2 shadow-lg rounded-xl transition-all text-sm transform ${
          isActive ? "visible opacity-1 translate-y-2" : "invisible opacity-0"
        }`}
        style={{ zIndex: 1 }}
      >
        {loadingNotifications && (
          <div className="flex items-center justify-center">
            <div className="loading-card-spinner-small" />
          </div>
        )}
        {!loadingNotifications &&
          notifications &&
          notifications.length > 0 &&
          notifications.map((notif) => (
            // either link to your profile or to the nft
            <Link
              href={
                getNotificationInfo(notif.type_id).goTo === "profile"
                  ? "/[profile]"
                  : "/t/[...token]"
              }
              as={
                getNotificationInfo(notif.type_id).goTo === "profile"
                  ? context.myProfile.username || context.user.publicAddress
                  : "t/0x06012c8cf97bead5deae237070f9587f8e7a266d/1275300"
              }
              key={notif.id}
            >
              <div
                className="py-2  px-4 hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap flex items-start w-full"
                key={notif.id}
              >
                <div className="flex-shrink w-max mr-1 relative">
                  <img
                    alt={notif.name}
                    src={
                      notif.img_url
                        ? notif.img_url
                        : "https://storage.googleapis.com/opensea-static/opensea-profile/4.png"
                    }
                    className="rounded-full mr-1 mt-1"
                    style={{ height: 36, width: 36 }}
                  />
                  <div className="absolute bottom-0 right-0 bg-white rounded-full h-5 w-5 flex items-center justify-center shadow">
                    <FontAwesomeIcon
                      style={{
                        height: 12,
                        width: 12,
                      }}
                      icon={
                        iconObjects[getNotificationInfo(notif.type_id).icon]
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <div>{truncateWithEllipses(notif.description, 50)}</div>
                  <div className="text-gray-400 text-xs">
                    {formatDistanceToNowStrict(new Date(notif.to_timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        {!loadingNotifications &&
          notifications &&
          notifications.length === 0 && (
            <div className="py-2 px-4 whitespace-nowrap">
              No notifications yet.
            </div>
          )}
      </div>
    </div>
  );
}
