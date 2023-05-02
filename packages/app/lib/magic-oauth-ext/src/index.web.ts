//@ts-nocheck
import * as WebBrowser from "expo-web-browser";
import { Extension } from "magic-sdk";

import { createCryptoChallenge } from "./crypto";
import {
  OAuthErrorData,
  OAuthPayloadMethods,
  OAuthRedirectError,
  OAuthRedirectResult,
  OAuthRedirectConfiguration,
} from "./types";

export class OAuthExtension extends Extension.Internal<"oauth"> {
  name = "oauth" as const;
  config = {};
  compat = {
    "magic-sdk": ">=2.4.6",
    "@magic-sdk/react-native": false,
  };

  public loginWithRedirect(configuration: OAuthRedirectConfiguration) {
    return this.utils.createPromiEvent<void>(async (resolve) => {
      const { provider, query } = await createURI.call(this, configuration);

      // @ts-ignore - this.sdk.endpoint is marked protected but we need to access it.
      window.location.href = new URL(
        `/v1/oauth2/${provider}/start?${query}`,
        this.sdk.endpoint
      ).href;

      resolve();
    });
  }

  public loginWithPopup(configuration: OAuthRedirectConfiguration) {
    return this.utils.createPromiEvent<OAuthRedirectResult>(
      async (resolve, reject) => {
        try {
          const { provider, query, redirectURI } = createURI.call(
            this,
            configuration
          );
          const url = `https://auth.magic.link/v1/oauth2/${provider}/start?${query}`;

          /**
           * Response Type
           * https://docs.expo.io/versions/latest/sdk/webbrowser/#returns
           */
          const res = await WebBrowser.openAuthSessionAsync(
            url,
            redirectURI,
            {}
          );

          if (res.type === "success") {
            const queryString = new URL(res.url).search;
            resolve(getResult.call(this, queryString.toString()));
          } else {
            reject(
              this.createError<object>(
                res.type,
                "User has cancelled the authentication",
                {}
              )
            );
          }
        } catch (err: any) {
          reject(
            this.createError<object>(err.message, "An error has occurred", {
              err,
            })
          );
        }
      }
    );
  }
}

const OAUTH_REDIRECT_METADATA_KEY = "oauth_redirect_metadata";

function createURI(
  this: OAuthExtension,
  configuration: OAuthRedirectConfiguration
) {
  // Bust any old, in-progress OAuth flows.
  this.utils.storage.removeItem(OAUTH_REDIRECT_METADATA_KEY);

  // Unpack configuration, generate crypto values, and persist to storage.
  const { provider, redirectURI, scope, loginHint } = configuration;
  const { verifier, challenge, state } = createCryptoChallenge();

  /* Stringify for RN Async storage */
  const storedData = JSON.stringify({
    verifier,
    state,
  });

  this.utils.storage.setItem(OAUTH_REDIRECT_METADATA_KEY, storedData);

  // Formulate the initial redirect query to Magic's OAuth hub.
  // Required fields:
  //   - `magic_api_key`
  //   - `magic_challenge`
  //   - `state`
  //   - `redirect_uri`
  //   - `platform`

  const query = [
    `magic_api_key=${encodeURIComponent(this.sdk.apiKey)}`,
    `magic_challenge=${encodeURIComponent(challenge)}`,
    `state=${encodeURIComponent(state)}`,
    `platform=${encodeURIComponent("web")}`,
    scope && `scope=${encodeURIComponent(scope.join(" "))}`,
    redirectURI && `redirect_uri=${encodeURIComponent(redirectURI)}`,
    loginHint && `login_hint=${encodeURIComponent(loginHint)}`,
  ].reduce((prev, next) => (next ? `${prev}&${next}` : prev));

  return {
    query,
    provider,
    redirectURI,
  };
}

function getResult(this: OAuthExtension, queryString: string) {
  return this.utils.createPromiEvent<OAuthRedirectResult>(
    async (resolve, reject) => {
      const json: string = await this.utils.storage.getItem(
        OAUTH_REDIRECT_METADATA_KEY
      );

      const { verifier, state } = JSON.parse(json);

      // Remove the save OAuth state from storage, it stays in memory now...
      this.utils.storage.removeItem(OAUTH_REDIRECT_METADATA_KEY);

      const parseRedirectResult = this.utils.createJsonRpcRequestPayload(
        OAuthPayloadMethods.ParseRedirectResult,
        [queryString, verifier, state]
      );

      // Parse the result, which may contain an OAuth-formatted error.
      const resultOrError = await this.request<
        OAuthRedirectResult | OAuthRedirectError
      >(parseRedirectResult);
      const maybeResult = resultOrError as OAuthRedirectResult;
      const maybeError = resultOrError as OAuthRedirectError;

      if (maybeError.error) {
        reject(
          this.createError<OAuthErrorData>(
            maybeError.error,
            maybeError.error_description ?? "An error occurred.",
            {
              errorURI: maybeError.error_uri,
              provider: maybeError.provider,
            }
          )
        );
      }

      resolve(maybeResult);
    }
  );
}

export * from "./types";
