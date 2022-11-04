import "raf/polyfill";

import "setimmediate";

import { useCallback } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";
import Head from "next/head";

import { usePlatformResize } from "@showtime-xyz/universal.hooks";
import { View } from "@showtime-xyz/universal.view";

import { Footer } from "app/components/footer";
import { Header } from "app/components/header";
import { withColorScheme } from "app/components/memo-with-theme";
import { MOBILE_WEB_TABS_HEIGHT } from "app/constants/layout";
import { useLogRocket } from "app/hooks/use-logrocket";
import { renderEmptyAnalyticsSnippet } from "app/lib/rudderstack/script";
import { Sentry } from "app/lib/sentry";
import { AppProviders } from "app/providers/app-providers";
import { ClaimScreen } from "app/screens/claim";
import { ClaimLimitExplanationScreen } from "app/screens/claim-limit-explanation";
import { CollectorsScreen } from "app/screens/collectors";
import { CommentsScreen } from "app/screens/comments";
import { CompleteProfileScreen } from "app/screens/complete-profile";
import { DetailsScreen } from "app/screens/details";
import { DropScreen } from "app/screens/drop";
import { EditProfileScreen } from "app/screens/edit-profile";
import { FollowersScreen } from "app/screens/followers";
import { FollowingScreen } from "app/screens/following";
import { LikersScreen } from "app/screens/likers";
import { LoginScreen } from "app/screens/login";
import { AddEmailScreen } from "app/screens/settings-add-email";
import { VerifyPhoneNumberScreen } from "app/screens/settings-verify-phone-number";
import { isMobileWeb } from "app/utilities";

import "../styles/styles.css";

// TODO: remove this once Reanimated ship a fix
if (typeof window !== "undefined") {
  // @ts-ignore
  window._frameTimestamp = null;
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
});

export default function App({ Component, pageProps, router }: AppProps) {
  useLogRocket();

  const meta = pageProps.meta;
  const metaTags = meta ? (
    <>
      <title>{meta.title}</title>
      <meta key="title" name="title" content={meta.title} />

      <meta name="description" content={meta.description} />

      {/* Open graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Showtime_xyz" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
      <meta name="twitter:app:name:iphone" content="Showtime" />
      <meta name="twitter:app:id:iphone" content="1606611688" />

      {meta.deeplinkUrl && (
        <meta
          name="twitter:app:url:iphone"
          content={"io.showtime://" + meta.deeplinkUrl}
        />
      )}

      <meta name="twitter:app:name:ipad" content="Showtime" />
      <meta name="twitter:app:id:ipad" content="1606611688" />

      <meta name="twitter:app:name:googleplay" content="Showtime" />
      <meta name="twitter:app:id:googleplay" content="io.showtime" />
      {meta.deeplinkUrl && (
        <meta
          name="twitter:app:url:googleplay"
          content={
            `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/` +
            meta.deeplinkUrl
          }
        />
      )}
    </>
  ) : (
    <>
      <title>Showtime</title>
      <meta key="title" name="title" content="Showtime" />
    </>
  );

  return (
    <>
      <Head>
        {process.env.NODE_ENV !== "development" ? (
          <>
            <link rel="preconnect" href="//showtimenft.wl.r.appspot.com" />
            <link rel="dns-prefect" href="//showtimenft.wl.r.appspot.com" />
            <link rel="preconnect" href="//lh3.googleusercontent.com" />
            <link rel="dns-prefect" href="//lh3.googleusercontent.com" />
            <link rel="preconnect" href="//res.cloudinary.com" />
            <link rel="dns-prefect" href="//res.cloudinary.com" />
          </>
        ) : null}

        {metaTags}

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-512x512.png"
        />

        <meta name="application-name" content="Showtime" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Showtime" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no, viewport-fit=cover"
          name="viewport"
        />

        <script
          dangerouslySetInnerHTML={{ __html: renderEmptyAnalyticsSnippet() }}
        />
      </Head>
      <AppProviders>
        <Container>
          <Header
            canGoBack={
              router.pathname === "/search" ||
              router.pathname === "/list" ||
              router.pathname.split("/").length - 1 >= 2
            }
          />
          <View
            tw="items-center"
            style={{ minHeight: `calc(100vh - ${MOBILE_WEB_TABS_HEIGHT}px)` }}
          >
            <Component {...pageProps} />
          </View>
          <Footer />
        </Container>

        {/* Modals */}
        <CommentsScreen />
        <DetailsScreen />
        <FollowersScreen />
        <FollowingScreen />
        <DropScreen />
        <ClaimScreen />
        <CollectorsScreen />
        <ClaimLimitExplanationScreen />
        <LikersScreen />

        {/* Settings that renders on top of other modals */}
        <EditProfileScreen />
        <CompleteProfileScreen />
        <AddEmailScreen />
        <VerifyPhoneNumberScreen />

        {/* Login should be the last so it renders on top of others if needed */}
        <LoginScreen />
      </AppProviders>
    </>
  );
}

const Container = withColorScheme(
  ({ children }: { children: React.ReactChild }) => {
    const onResize = useCallback(() => {
      if (isMobileWeb()) {
        document.body.classList.add("overflow-hidden", "overscroll-y-contain");
      } else {
        document.body.classList.remove("overflow-hidden", "overscroll-y-none");
      }
    }, []);
    usePlatformResize(onResize, true);
    return <View tw="bg-gray-100 dark:bg-black">{children}</View>;
  }
);
