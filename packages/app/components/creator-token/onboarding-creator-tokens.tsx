import React, { useState, useMemo } from "react";

import { AnimatePresence } from "moti";

import { BottomSheetModalProvider } from "@showtime-xyz/universal.bottom-sheet";
import { InviteTicket } from "@showtime-xyz/universal.icon";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";

export const OnboardingCreatorToken = () => {
  return (
    <View>
      <InviteTicket />
    </View>
  );
};
