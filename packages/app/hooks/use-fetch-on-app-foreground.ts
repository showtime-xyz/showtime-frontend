import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { axios, AxiosParams } from "app/lib/axios";

export const useFetchOnAppForeground = () => {
  const listener = useRef<any>(null);

  function fetchOnAppForeground(params: AxiosParams) {
    if (AppState.currentState === "active") {
      return axios(params);
    } else {
      return new Promise<any>((resolve, reject) => {
        let requested = false;
        listener.current = AppState.addEventListener("change", async (s) => {
          // sometimes this callback gets triggered more than once, so adding this requested flag
          if (s === "active" && !requested) {
            requested = true;
            try {
              console.log("Calling fetch on foreground");
              const res = await axios(params);
              resolve(res);
            } catch (e) {
              reject(e);
            } finally {
              console.log("removing background listener");
              listener.current?.remove();
            }
          }
        });
      });
    }
  }

  useEffect(() => {
    return () => {
      if (listener.current && listener.current.remove) {
        listener.current.remove();
      }
    };
  });

  return fetchOnAppForeground;
};
