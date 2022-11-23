import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import { axios, AxiosParams } from "app/lib/axios";

export const useFetchOnAppForeground = () => {
  const listener = useRef<any>(null);

  function fetchOnAppForeground(params: AxiosParams) {
    if (AppState.currentState === "active") {
      return axios(params);
    } else {
      return new Promise<any>((resolve, reject) => {
        const fetchData = (state: AppStateStatus) => {
          if (state === "active") {
            axios(params).then(resolve).catch(reject);
            listener.current?.remove();
          }
        };

        listener.current = AppState.addEventListener("change", fetchData);
      });
    }
  }

  useEffect(() => {
    return () => {
      listener.current?.remove();
    };
  }, []);

  return fetchOnAppForeground;
};
