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

  let metaTags = null;
  const meta = pageProps.meta;
  if (meta) {
    metaTags = meta ? (
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
      </>
    ) : (
      <>
        <title>Showtime</title>
        <meta key="title" name="title" content="Showtime" />
      </>
    );
  }

  return (
    <>
      <Head>
        {metaTags}
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
