import { Button } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

import { toast, Toaster } from "./index";

export default {
  component: View,
  title: "Components/Toast",
};

export const Primary = () => {
  return (
    <View tw="flex-1 items-center justify-center">
      <Button onPress={() => toast("Gm friends!")}>Toast</Button>
      <View tw="h-2" />
      <Button onPress={() => toast.success("Successed")}>Success toast</Button>
      <View tw="h-2" />
      <Button
        onPress={() =>
          toast.success("Successed", { message: "you are verified!" })
        }
      >
        Successed Message toast
      </Button>
      <View tw="h-2" />
      <Button
        variant="danger"
        onPress={() => toast.error("Something went wrong")}
      >
        Error Toast
      </Button>
      <View tw="h-2" />
      <Button
        variant="danger"
        onPress={() =>
          toast.error("Error", { message: "Something went wrong" })
        }
      >
        Error Message Toast
      </Button>
      <View tw="h-2" />
      <Button
        variant="secondary"
        onPress={() =>
          toast.custom("It's Showtime!", {
            ios: {
              name: "sparkle",
              color: "#F7A51D",
            },
            web: "✨",
          })
        }
      >
        Custom Icon Toast
      </Button>
      <View tw="h-2" />
      <Button
        variant="outlined"
        onPress={async () => {
          const fetch = new Promise((resolve) => setTimeout(resolve, 3000));
          toast.promise(fetch, {
            loading: "Processing Payment!",
            success: "Payment Succeeded 🎉",
            error: "Your payment was not successful, please try again.",
          });
        }}
      >
        Loading then Succeeded Toast
      </Button>
      <View tw="h-2" />
      <Button
        variant="outlined"
        onPress={async () => {
          const fetch = new Promise((resolve, reject) =>
            setTimeout(reject, 3000)
          );
          toast.promise(fetch, {
            loading: "Processing Payment!",
            success: "Payment Succeeded 🎉",
            error: "Your payment was not successful, please try again.",
          });
        }}
      >
        Loading then Failed Toast
      </Button>

      <View tw="h-2" />
      <Button
        variant="text"
        onPress={() => {
          toast.dismiss();
        }}
      >
        Dismiss Toast
      </Button>
      <Toaster />
    </View>
  );
};
