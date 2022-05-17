import "raf/polyfill";

import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";
import Head from "next/head";
import "photoswipe/dist/photoswipe.css";

import { Footer } from "app/components/footer";
import { Header } from "app/components/header";
import { MintSnackbar } from "app/components/mint-snackbar";
import { emptyAnalyticsScript } from "app/lib/analytics";
import { Sentry } from "app/lib/sentry";
import { AppProvider } from "app/providers";
import { ActivitiesScreen } from "app/screens/activities";
import { BuyScreen } from "app/screens/buy";
import { CommentsScreen } from "app/screens/comments";
import { CreateScreen } from "app/screens/create";
import { DeleteScreen } from "app/screens/delete";
import { DetailsScreen } from "app/screens/details";
import { EditProfileScreen } from "app/screens/edit-profile";
import { ListScreen } from "app/screens/list";
import { LoginScreen } from "app/screens/login";
import { TransferScreen } from "app/screens/transfer";
import { UnlistScreen } from "app/screens/unlist";

import { View } from "design-system/view";

import "../styles/styles.css";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
});

export default function App({ Component, pageProps, router }: AppProps) {
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
        <script dangerouslySetInnerHTML={{ __html: emptyAnalyticsScript() }} />
      </Head>

      <AppProvider>
        <View tw="bg-gray-100 dark:bg-black">
          <Header
            canGoBack={
              router.pathname === "/search" ||
              router.pathname.split("/").length - 1 >= 2
            }
          />

          <View tw="min-h-screen items-center">
            <Component {...pageProps} />
          </View>

          <Footer />
        </View>

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
        <MintSnackbar />
        <EditProfileScreen />
        {/* Login should be the last so it renders on top of others if needed */}
        <LoginScreen />
      </AppProvider>
    </>
  );
}
