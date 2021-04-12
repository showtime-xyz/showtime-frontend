import React, { useRef, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faComment, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import { formatDistanceToNowStrict } from "date-fns";
// import { truncateWithEllipses } from "../lib/utilities";
import useInterval from "../hooks/useInterval";
import AppContext from "../context/app-context";
import { getNotificationInfo } from "../lib/constants";

const iconObjects = {
  comment: faComment,
  heart: faHeart,
  user: faUser,
};

export default function NotificationsBtn() {
  const context = useContext(AppContext);
  // const myNotificationsLastOpened =
  //   context.myProfile && context.myProfile.notifications_last_opened;
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const [previouslyLastOpened, setPreviouslyLastOpened] = useState();

  const toggleOpen = async () => {
    if (!isActive) {
      setPreviouslyLastOpened(context.myProfile.notifications_last_opened);
      updateNotificationsLastOpened();
      setHasUnreadNotifications(false);
    }
    setIsActive(!isActive);
  };

  const updateNotificationsLastOpened = async () => {
    try {
      await fetch(`/api/updatenotificationslastopened`, {
        method: "post",
      });
      await context.setMyProfile({
        ...context.myProfile,
        notifications_last_opened: new Date(),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getNotifications = async () => {
    try {
      const res = await fetch("/api/getnotifications");
      const notifs = await res.json();
      setNotifications(notifs);
      setLoadingNotifications(false);
      setHasUnreadNotifications(
        (notifs &&
          notifs[0] &&
          context.myProfile.notifications_last_opened === null) ||
          (notifs &&
            notifs[0] &&
            new Date(notifs[0].to_timestamp) >
              new Date(context.myProfile.notifications_last_opened))
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);
  useInterval(getNotifications, 3 * 60 * 1000);

  return (
    <div className="relative">
      <div
        onClick={() => {
          toggleOpen();
        }}
        className="hover:text-stpink transition-all rounded-full h-6 w-6 flex items-center justify-center cursor-pointer relative"
      >
        <FontAwesomeIcon
          style={{
            height: 20,
            width: 20,
          }}
          icon={faBell}
        />
        {hasUnreadNotifications && (
          <div
            className="bg-stpink"
            style={{
              position: "absolute",
              height: 10,
              width: 10,
              top: 0,
              left: 0,
              borderRadius: "50%",
            }}
          />
        )}
      </div>
      <div
        ref={dropdownRef}
        className={`text-black absolute text-center top-10 right-0 bg-white py-2 px-2 shadow-lg rounded-xl transition-all transform border border-gray-200 ${
          isActive ? "visible opacity-1 translate-y-2" : "invisible opacity-0"
        }`}
        style={{
          zIndex: 1,
          maxWidth: context.windowSize.width < 768 ? "92vw" : 500,
          width:
            loadingNotifications || !notifications || notifications.length === 0
              ? "unset"
              : context.windowSize.width < 768
              ? "92vw"
              : 500,
        }}
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
                  ? notif.link_to_profile__address
                    ? `/${
                        notif.link_to_profile__username ||
                        notif.link_to_profile__address
                      }`
                    : `/${
                        context.myProfile.username || context.user.publicAddress
                      }`
                  : `/t/${notif.nft__contract__address}/${notif.nft__token_identifier}`
              }
              key={notif.id}
            >
              <div
                className={`py-3 px-3 hover:bg-gray-50 transition-all rounded-lg cursor-pointer whitespace-nowrap flex items-start w-full max-w-full ${
                  new Date(notif.to_timestamp) > new Date(previouslyLastOpened)
                    ? "bg-gray-100 hover:bg-gray-200"
                    : ""
                }`}
                onClick={() => setIsActive(!isActive)}
                key={notif.id}
                // style={
                //   new Date(notif.to_timestamp) > new Date(previouslyLastOpened)
                //     ? { backgroundColor: "#f3f4ff" }
                //     : {}
                // }
              >
                <div className="w-max mr-2 relative" style={{ minWidth: 36 }}>
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
                  <div
                    className="absolute bottom-0 right-0 rounded-full h-5 w-5 flex items-center justify-center shadow"
                    style={{
                      backgroundColor: getNotificationInfo(notif.type_id).color,
                    }}
                  >
                    <FontAwesomeIcon
                      style={{
                        height: 12,
                        width: 12,
                      }}
                      icon={
                        iconObjects[getNotificationInfo(notif.type_id).icon]
                      }
                      color="white"
                    />
                  </div>
                </div>
                <div className="flex-1 flex-col items-start text-left">
                  <div
                    style={{
                      // textOverflow: "ellipsis",
                      // overflow: "hidden",
                      whiteSpace: "break-spaces",
                      fontSize: 14,
                    }}
                  >
                    {notif.description}
                  </div>
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
