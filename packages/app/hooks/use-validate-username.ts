import { useRef, useState } from "react";

import { axios } from "../lib/axios";
import { Logger } from "../lib/logger";
import { useUser } from "./use-user";

export const useValidateUsername = () => {
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const debounceTimeout = useRef<any>(null);
  const lastInput = useRef<string | null>(null);

  async function validateUsername(value: string) {
    const username = value ? value.trim() : null;
    try {
      setIsLoading(true);
      if (
        username === null ||
        username.toLowerCase() === user?.data?.profile?.username?.toLowerCase()
      ) {
        setIsValid(true);
      } else if (username.length > 1) {
        const res = await axios({
          url: `/v1/username_available?username=${username}`,
          method: "get",
        });

        if (res.data) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      }
    } catch (e) {
      Logger.error("username validate api failed ", e);
    } finally {
      setIsLoading(false);
    }
  }

  function debouncedValidate(value: string) {
    if (value !== lastInput.current && !isLoading) {
      setIsLoading(true);
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      validateUsername(value);
    }, 400);

    lastInput.current = value;
  }

  return {
    isValid,
    isLoading,
    validate: debouncedValidate,
  };
};
