import "raf/polyfill";

import "setimmediate";

import { useEffect } from "react";

import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import "react-datepicker/dist/react-datepicker.css";

import { View } from "@showtime-xyz/universal.view";

import Footer from "app/components/footer";
import Header from "app/components/header";
import { withColorScheme } from "app/components/memo-with-theme";
import { usePlatformBottomHeight } from "app/hooks/use-platform-bottom-height";
import { useScript } from "app/hooks/use-script";
import { initialiseAppleMusic } from "app/lib/apple-music-auth/apple-music-auth";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { Sentry } from "app/lib/sentry";
import { AppProviders } from "app/providers/app-providers";
import { CheckoutScreen } from "app/screens/checkout";
import { CheckoutReturnScreen } from "app/screens/checkout-return";
import { ClaimScreen } from "app/screens/claim";
import { ClaimLimitExplanationScreen } from "app/screens/claim-limit-explanation";
import { CollectorsScreen } from "app/screens/collectors";
import { CommentsScreen } from "app/screens/comments";
import { CreatorChannelsIntroScreen } from "app/screens/creator-channels-intro";
import { CreatorChannelsMembersScreen } from "app/screens/creator-channels-members";
import { CreatorChannelsMessageReactionsScreen } from "app/screens/creator-channels-message-reactions";
import { CreatorChannelsSettingsScreen } from "app/screens/creator-channels-settings";
import { CreatorChannelsShareScreen } from "app/screens/creator-channles-share";
import { DetailsScreen } from "app/screens/details";
import { DropScreen } from "app/screens/drop";
import { DropEditDetailsScreen } from "app/screens/drop-edit-details";
import { DropExplanationScreen } from "app/screens/drop-explanation";
import { DropFreeScreen } from "app/screens/drop-free";
import { DropViewShareScreen } from "app/screens/drop-view-share";
import { EditProfileScreen } from "app/screens/edit-profile";
import { FollowersScreen } from "app/screens/followers";
import { FollowingScreen } from "app/screens/following";
import { LikersScreen } from "app/screens/likers";
import { LoginScreen } from "app/screens/login";
import { OnboardingScreen } from "app/screens/onboarding";
import { QRCodeShareScreen } from "app/screens/qr-code-share";
import { RaffleScreen } from "app/screens/raffle";
import { ReportScreen } from "app/screens/report";
import { AddEmailScreen } from "app/screens/settings-add-email";
import { VerifyPhoneNumberScreen } from "app/screens/settings-verify-phone-number";

import { Toaster } from "design-system/toast";

import "../styles/styles.css";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
});

function App({ Component, pageProps, router }: AppProps) {
  const meta = pageProps.meta;

  const scriptLoadedRes = useScript(
    "https://js-cdn.music.apple.com/musickit/v3/musickit.js"
  );

  useEffect(() => {
    if (scriptLoadedRes === "ready") {
      initialiseAppleMusic();
    }
  }, [scriptLoadedRes]);

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
            <link rel="preconnect" href="//showtime.b-cdn.net" />
            <link rel="dns-prefect" href="//showtime.b-cdn.net" />
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
      </Head>
      <AppProviders>
        <Container>
          <View tw="mx-auto flex-col md:flex-row">
            <Header
              canGoBack={
                router.pathname === "/search" ||
                router.pathname.split("/").length - 1 >= 2
              }
            />

            <View tw="w-full items-center md:ml-auto md:w-[calc(100vw-248px)]">
              <NextNProgress
                color="#4F46E5"
                options={{ showSpinner: false }}
                showOnShallow={false}
              />
              <Component {...pageProps} />
            </View>
          </View>
          <Footer />
        </Container>

        {/* Modals */}
        <CommentsScreen />
        <DetailsScreen />
        <FollowersScreen />
        <FollowingScreen />
        <DropScreen />
        <DropExplanationScreen />
        <ClaimScreen />
        <RaffleScreen />
        <CollectorsScreen />
        <ClaimLimitExplanationScreen />
        <LikersScreen />
        <ReportScreen />
        <DropFreeScreen />
        <CheckoutScreen />
        <CheckoutReturnScreen />
        <QRCodeShareScreen />
        <DropViewShareScreen />
        <CreatorChannelsIntroScreen />
        <CreatorChannelsMembersScreen />
        <CreatorChannelsSettingsScreen />
        <CreatorChannelsMessageReactionsScreen />
        <CreatorChannelsShareScreen />
        <DropEditDetailsScreen />
        <EditProfileScreen />
        <OnboardingScreen />
        <AddEmailScreen />
        <VerifyPhoneNumberScreen />

        {/* Login should be the last so it renders on top of others if needed */}
        <LoginScreen />
        <Toaster />
      </AppProviders>
    </>
  );
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const Container = withColorScheme(
  ({ children }: { children: React.ReactNode }) => {
    const fonts = [inter.variable].join(" ");
    const headerHeight = useHeaderHeight();
    const bottomBarHeight = usePlatformBottomHeight();
    return (
      <View
        tw="bg-white dark:bg-black md:bg-gray-100 dark:md:bg-gray-900"
        // @ts-ignore
        style={{
          paddingTop: headerHeight,
          paddingBottom: `calc(${bottomBarHeight}px + env(safe-area-inset-bottom))`,
        }}
      >
        <div className={fonts}>{children}</div>
      </View>
    );
  }
);

export default App;
