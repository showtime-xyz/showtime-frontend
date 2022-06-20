import "raf/polyfill";

import "setimmediate";

import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";
import Head from "next/head";

import { View } from "@showtime-xyz/universal.view";

import { Footer } from "app/components/footer";
import { Header } from "app/components/header";
import { withColorScheme } from "app/components/memo-with-theme";
import { useLogRocket } from "app/hooks/use-logrocket";
import { renderEmptyAnalyticsSnippet } from "app/lib/rudderstack/script";
import { Sentry } from "app/lib/sentry";
import { AppProviders } from "app/providers/app-providers";
import { ActivitiesScreen } from "app/screens/activities";
import { BuyScreen } from "app/screens/buy";
import { ClaimScreen } from "app/screens/claim";
import { CommentsScreen } from "app/screens/comments";
import { CreateScreen } from "app/screens/create";
import { DeleteScreen } from "app/screens/delete";
import { DetailsScreen } from "app/screens/details";
import { DropScreen } from "app/screens/drop";
import { EditProfileScreen } from "app/screens/edit-profile";
import { FollowersScreen } from "app/screens/followers";
import { FollowingScreen } from "app/screens/following";
import { ListScreen } from "app/screens/list";
import { LoginScreen } from "app/screens/login";
import { TransferScreen } from "app/screens/transfer";
import { UnlistScreen } from "app/screens/unlist";

import "../styles/styles.css";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
});

export default function App({ Component, pageProps, router }: AppProps) {
  useLogRocket();

  return (
    <>
      <Head>
        <title>Showtime</title>
        <meta key="title" name="title" content="Showtime" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
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
              router.pathname.split("/").length - 1 >= 2
            }
          />
          <View tw="min-h-screen items-center overflow-x-hidden">
            <Component {...pageProps} />
          </View>
          <Footer />
        </Container>

        {/* Modals */}
        <CommentsScreen />
        <TransferScreen />
        <CreateScreen />
        <DeleteScreen />
        <ListScreen />
        <UnlistScreen />
        <DetailsScreen />
        <BuyScreen />
        <ActivitiesScreen />
        <EditProfileScreen />
        <FollowersScreen />
        <FollowingScreen />
        <DropScreen />
        <ClaimScreen />
        {/* Login should be the last so it renders on top of others if needed */}
        <LoginScreen />
      </AppProviders>
    </>
  );
}

const Container = withColorScheme(
  ({ children }: { children: React.ReactChild }) => {
    return <View tw="bg-gray-100 dark:bg-black">{children}</View>;
  }
);
