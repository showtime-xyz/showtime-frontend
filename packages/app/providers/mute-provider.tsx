import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { usePreviousValue } from "app/hooks/use-previous-value";
import { isMobileWeb } from "app/utilities";

export const MuteContext = createContext([true, () => {}] as
  | [boolean, Dispatch<SetStateAction<boolean>>]);

type MuteState = [boolean, Dispatch<SetStateAction<boolean>>];

/*
const useAutoPlayWithSound = (values: MuteState) => {
  useEffect(() => {
    const handleClick = (event: PointerEvent | MouseEvent) => {
      const target = event.target as HTMLElement;

      // if the target is a video, we want to do nothing as well since this is handled by the video player
      if (
        typeof target === "object" &&
        target.tagName.toLowerCase() === "video"
      )
        return;

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
      window.removeEventListener("click", handleClick, true);
    };

    if (Platform.OS === "web") {
      // register the click listener
      window.addEventListener("click", handleClick, true);
    }

    // cleanup
    return () => {
      if (Platform.OS === "web") {
        window.removeEventListener("click", handleClick, true);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
*/

const useMuteOnVisbilityChange = (values: MuteState) => {
  const wasMuted = useRef(values[0]);
  useEffect(() => {
    const handleFocus = async () => {
      // get setter from mute context
      const [muted, setMuted] = values;

      // first check if the video is muted and store that value in a ref to reset to the correct value once the user returns to the page
      if (document.visibilityState === "hidden") {
        if (!muted) {
          setMuted(true);
          wasMuted.current = muted;
        }
      } else {
        // if the video is not muted, we want to unmute it
        if (!wasMuted.current) {
          setMuted(false);
          wasMuted.current = false;
        }
      }
    };

    if (Platform.OS === "web") {
      // register the click listener
      window.addEventListener("visibilitychange", handleFocus, false);
    }

    // cleanup
    return () => {
      if (Platform.OS === "web") {
        window.removeEventListener("visibilitychange", handleFocus, false);
      }
    };
  }, [values]);
};

export const MuteProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  // default to true on web (muted) and false on native
  const values = useState(Platform.OS === "web");
  const setValue = values[1];

  // auto play with sound on web with first interaction
  //useAutoPlayWithSound(values);

  // on web, mute the video when the user navigates away from the page (tab change, etc.)
  useMuteOnVisbilityChange(values);

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
