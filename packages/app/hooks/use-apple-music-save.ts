import { useEffect, useState } from "react";

import { Logger } from "app/lib/logger";

let music: any;
const developerToken =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjMzRFI3UzY1NEsifQ.eyJpYXQiOjE2Nzg5NDIzNzAsImV4cCI6MTY5NDQ5NDM3MCwiaXNzIjoiODhUS0hCMjY4VyJ9.jD1060-UrGZSdEuccQmJJDHUmN028jsyG-3ieZGJSL09BXEkMjFL_RaGTwfsA7pLWV34cp4CHtqgzXk2cjSx1g";

const initMusicKit = async () => {
  if (music) return music;
  try {
    console.log("EFjefjifejiefji 112");
    // @ts-ignore
    await window.MusicKit.configure({
      developerToken,
      app: {
        name: "Showtime",
        build: "1978.4.1",
      },
    });
  } catch (err) {
    Logger.error(err);
  }

  // MusicKit instance is available
  // @ts-ignore
  music = window.MusicKit.getInstance();
};

export const useAppleMusicSave = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    initMusicKit().then(() => {
      setLoading(false);
    });
  }, []);

  const authorize = () => {
    return music.authorize();
  };

  return {
    authorize,
    loading,
    storeSongToUserLibrary,
  };
};

const storeSongToUserLibrary = (songId: number, token: string) => {
  const url = "https://api.music.apple.com/v1/me/library?ids[songs]=" + songId;
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: "Bearer " + developerToken,
    "Music-User-Token": token,
  });
  const options = {
    method: "POST",
    headers: headers,
  };

  console.log("url ", url, options);

  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        console.log("Song added to library");
      } else {
        console.log("Error adding song to library: " + response.status);
      }
    })
    .catch((error) => {
      console.log("Error adding song to library: " + error);
    });
};
