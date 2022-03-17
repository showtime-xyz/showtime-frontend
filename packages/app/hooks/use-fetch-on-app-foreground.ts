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
        function fetchData(state: AppStateStatus) {
          if (state === "active") {
            console.log("calling foreground fetch");
            axios(params).then(resolve).catch(reject);
            AppState.removeEventListener("change", fetchData);
            listener.current = null;
          }
        }

        AppState.addEventListener("change", fetchData);
        listener.current = fetchData;
      });
    }
  }

  useEffect(() => {
    return () => {
      if (listener.current) {
        AppState.removeEventListener("change", listener.current);
      }
    };
  }, []);

  return fetchOnAppForeground;
};
