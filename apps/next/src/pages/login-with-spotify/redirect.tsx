import { useEffect, useState } from "react";

import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { withColorScheme } from "app/components/memo-with-theme";
import { useSaveSpotifyToken } from "app/hooks/use-save-spotify-token";
import { useUser } from "app/hooks/use-user";

import { getSpotifyRedirectUri } from "./util";

const Redirect = withColorScheme(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const storedState = localStorage.getItem("spotify_auth_state");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { saveSpotifyToken } = useSaveSpotifyToken();
  const { isAuthenticated } = useUser();

  useEffect(
    () => {
      console.log("I fire once");
      const submit = async () => {
        // log dependencies
        console.log({
          code,
          state,
          storedState,
          isAuthenticated,
          isSubmitting,
        });

        setIsSubmitting(true);
        await saveSpotifyToken({ code, redirectUri: getSpotifyRedirectUri() });
        setSuccess(true);
      };

      if (!isAuthenticated) {
        setError("You must be logged in to save your Spotify token.");
        return;
      }

      if (isSubmitting || success !== null) {
        return;
      }
      if (!code || !state || state !== storedState) {
        setError("Invalid state");
        return;
      }
      submit()
        .catch((e) => {
          setError(e.message);
          setSuccess(false);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <View tw="flex-1" style={{ marginTop: 48, marginLeft: 48 }}>
      {error ? (
        <Text style={{ alignContent: "center" }}>Error: {error}</Text>
      ) : success ? (
        <>
          <Text style={{ alignContent: "center" }}>Success!</Text>
        </>
      ) : (
        <Spinner />
      )}
    </View>
  );
});

export default Redirect;
