import { useEffect, useState } from "react";

import { Logger } from "app/lib/logger";

let music: any;
const developerToken =
  "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ilo2VkQ0NTJOMjcifQ.eyJpYXQiOjE2NjY5ODIzODUsImV4cCI6MTY4MjUzNDM4NSwiaXNzIjoiODhUS0hCMjY4VyJ9.fVefAK7d250DZw1CzmQgSPrUy_3X6yz8am0SgWYow9fOdz_H5akyyP_NH2maEOH2V8TfOxMpYvyXVzJzvE7dPw";

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
