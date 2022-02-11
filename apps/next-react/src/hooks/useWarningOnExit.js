import { useEffect } from "react";

import { useRouter } from "next/router";

export const useWarningOnExit = (shouldWarn, warningText) => {
  const router = useRouter();
  const message = warningText || "Are you sure that you want to leave?";

  useEffect(() => {
    let isWarned = false;

    const routeChangeStart = (url, shallow) => {
      if (router.asPath !== url && !shallow && shouldWarn && !isWarned) {
        isWarned = true;
        if (window.confirm(message)) {
          router.push(url);
        } else {
          isWarned = false;
          router.events.emit("routeChangeError");
          router.replace(router.asPath, router.asPath, { shallow: true });

          throw "Abort route change. Please ignore this error.";
        }
      }
    };

    const beforeUnload = (e) => {
      if (shouldWarn && !isWarned) {
        const event = e || window.event;
        event.returnValue = message;
        return message;
      }
      return null;
    };

    router.events.on("routeChangeStart", routeChangeStart);
    window.addEventListener("beforeunload", beforeUnload);
    router.beforePopState(({ url }) => {
      if (router.asPath !== url && shouldWarn && !isWarned) {
        isWarned = true;
        if (window.confirm(message)) return true;
        else {
          isWarned = false;
          window.history.pushState(null, "", url);
          router.replace(router.asPath, router.asPath, { shallow: true });
          return false;
        }
      }

      return true;
    });

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      window.removeEventListener("beforeunload", beforeUnload);
      router.beforePopState(() => true);
    };
  }, [message, router, shouldWarn]);
};
