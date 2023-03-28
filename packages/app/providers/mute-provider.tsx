import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { usePreviousValue } from "app/hooks/use-previous-value";
import { isMobileWeb } from "app/utilities";

export const MuteContext = createContext([true, () => {}] as
  | [boolean, Dispatch<SetStateAction<boolean>>]);

type MuteState = [boolean, Dispatch<SetStateAction<boolean>>];

const useAutoPlayWithSound = (values: MuteState) => {
  useEffect(() => {
    const handleClick = async () => {
      console.log("aaa");
      // this should only run on web
      if (Platform.OS !== "web") return;

      // now we want to check if the current page has a video
      // if it does, we want to unmute it
      // if it doesn't, we want to do nothing
      const video = document.querySelector("video");
      if (!video) return;

      // get setter from mute context
      const setMuted = values[1];

      // create an audio context
      // @ts-expect-error webkitAudioContext is unknown
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();

      // Create an invisible audio node and connect it to the audio context
      const source = audioContext.createBufferSource();
      const buffer = audioContext.createBuffer(1, 1, 22050);
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();

      // unmute the video via the mute context
      setMuted(false);

      // remove the click listener
      window.removeEventListener("click", handleClick);
    };

    // register the click listener
    window.addEventListener("click", handleClick);

    // cleanup
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [values]);
};

export const MuteProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  // default to true on web (muted) and false on native
  const values = useState(Platform.OS === "web");
  const setValue = values[1];

  // auto play with sound on web with first interaction
  useAutoPlayWithSound(values);

  const prevRouter = usePreviousValue(router);

  useEffect(() => {
    if (
      isMobileWeb() &&
      (prevRouter?.pathname !== router.pathname ||
        prevRouter?.query !== router.query)
    ) {
      setValue(true);
    }
  }, [router, prevRouter?.query, prevRouter?.pathname, setValue]);

  return <MuteContext.Provider value={values}>{children}</MuteContext.Provider>;
};

export const useMuted = () => {
  return useContext(MuteContext);
};
