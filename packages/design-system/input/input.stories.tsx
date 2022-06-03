import { Meta } from "@storybook/react";
import { Svg, Path } from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { View } from "@showtime-xyz/universal.view";

import { Input, InputPressable } from "./index";

const LinkIcon = () => {
  const isDark = useIsDarkMode();
  return (
    <InputPressable onPress={() => {}}>
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.9956 0.0666941C14.4225 0.0530236 12.9069 0.65779 11.7752 1.75074L11.7649 1.76086L10.0449 3.47086C9.65325 3.86025 9.6514 4.49341 10.0408 4.88507C10.4302 5.27673 11.0633 5.27858 11.455 4.88919L13.1696 3.18456C13.9235 2.45893 14.9318 2.05752 15.9783 2.06662C17.0271 2.07573 18.0303 2.49641 18.7719 3.23804C19.5136 3.97967 19.9342 4.98292 19.9434 6.03171C19.9525 7.07776 19.5514 8.08563 18.8264 8.83941L15.8328 11.8329L15.8327 11.833C15.4272 12.2387 14.9392 12.5524 14.4018 12.7529C13.8644 12.9533 13.2902 13.0359 12.718 12.9949C12.1459 12.9539 11.5893 12.7904 11.086 12.5154C10.5826 12.2404 10.1443 11.8604 9.80072 11.401C9.46991 10.9588 8.84323 10.8685 8.40098 11.1993C7.95873 11.5301 7.86838 12.1568 8.19919 12.599C8.71453 13.288 9.37202 13.858 10.127 14.2705C10.8821 14.683 11.717 14.9283 12.5752 14.9898C13.4333 15.0513 14.2947 14.9274 15.1008 14.6267C15.9069 14.326 16.6389 13.8555 17.2472 13.247L20.2471 10.2471L20.2592 10.2347C21.3522 9.10313 21.957 7.58751 21.9433 6.01433C21.9296 4.44115 21.2986 2.93628 20.1862 1.82383C19.0737 0.711378 17.5688 0.0803646 15.9956 0.0666941ZM9.42474 7.01025C8.56657 6.94879 7.70522 7.07261 6.89911 7.37331C6.09305 7.67399 5.36109 8.1445 4.75285 8.75292L4.75272 8.75305L1.75285 11.7529L1.74067 11.7653C0.647719 12.8969 0.0429528 14.4125 0.0566233 15.9857C0.0702938 17.5589 0.701307 19.0638 1.81376 20.1762C2.9262 21.2887 4.43108 21.9197 6.00426 21.9334C7.57744 21.947 9.09305 21.3423 10.2247 20.2493L10.2371 20.2371L11.9471 18.5271C12.3376 18.1366 12.3376 17.5034 11.9471 17.1129C11.5565 16.7224 10.9234 16.7224 10.5328 17.1129L8.82932 18.8164C8.07555 19.5415 7.06768 19.9425 6.02164 19.9334C4.97285 19.9243 3.9696 19.5036 3.22797 18.762C2.48634 18.0204 2.06566 17.0171 2.05655 15.9683C2.04746 14.9223 2.44851 13.9144 3.17355 13.1606L6.16706 10.1671L6.16719 10.167C6.5727 9.76135 7.06071 9.44765 7.59811 9.24718C8.13552 9.04671 8.70976 8.96416 9.28187 9.00514C9.85398 9.04611 10.4106 9.20965 10.9139 9.48465C11.4173 9.75966 11.8556 10.1397 12.1992 10.599C12.53 11.0413 13.1567 11.1316 13.5989 10.8008C14.0412 10.47 14.1315 9.8433 13.8007 9.40105C13.2854 8.71209 12.6279 8.14203 11.8729 7.72952C11.1178 7.31701 10.2829 7.07171 9.42474 7.01025Z"
          fill={isDark ? "#B2B4CC" : "#3D3E5C"}
        />
      </Svg>
    </InputPressable>
  );
};

const CopyIcon = () => {
  const isDark = useIsDarkMode();

  return (
    <InputPressable>
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H12C12.2652 2 12.5196 2.10536 12.7071 2.29289C12.8946 2.48043 13 2.73478 13 3V4C13 4.55228 13.4477 5 14 5C14.5523 5 15 4.55228 15 4V3C15 2.20435 14.6839 1.44129 14.1213 0.87868C13.5587 0.31607 12.7956 0 12 0H3C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3V12C0 12.7956 0.31607 13.5587 0.87868 14.1213C1.44129 14.6839 2.20435 15 3 15H4C4.55228 15 5 14.5523 5 14C5 13.4477 4.55228 13 4 13H3C2.73478 13 2.48043 12.8946 2.29289 12.7071C2.10536 12.5196 2 12.2652 2 12V3C2 2.73478 2.10536 2.48043 2.29289 2.29289ZM9 10C9 9.44771 9.44771 9 10 9H19C19.5523 9 20 9.44771 20 10V19C20 19.5523 19.5523 20 19 20H10C9.44771 20 9 19.5523 9 19V10ZM10 7C8.34315 7 7 8.34315 7 10V19C7 20.6569 8.34315 22 10 22H19C20.6569 22 22 20.6569 22 19V10C22 8.34315 20.6569 7 19 7H10Z"
          fill={isDark ? "#B2B4CC" : "#3D3E5C"}
        />
      </Svg>
    </InputPressable>
  );
};

export const Inputs = () => {
  const isDark = useIsDarkMode();
  return (
    <View
      style={{ padding: 10, flex: 1, minHeight: 500 }}
      tw={isDark ? "bg-black" : "bg-white"}
    >
      <Input
        label="First Name"
        leftElement={<LinkIcon />}
        placeholder="First name"
      />
      <Spacer />
      <Input
        label="Last Name"
        leftElement={<LinkIcon />}
        rightElement={<CopyIcon />}
        placeholder="Last name"
      />
      <Spacer />
      <Input label="Email" type="email-address" placeholder="Email" />
      <Spacer />
      <Input label="Disabled" disabled placeholder="Last name" />
      <Spacer />
      <Input label="Amount" type="number-pad" isInvalid placeholder="Amount" />
      <Spacer />
      <Spacer />
    </View>
  );
};

export const InputFormElements = () => {
  const isDark = useIsDarkMode();
  return (
    <View
      style={{ padding: 10, flex: 1, minHeight: 500 }}
      tw={isDark ? "bg-black" : "bg-white"}
    >
      <Input
        helperText="enter your username"
        label="Username"
        placeholder="@showtime"
      />
      <Spacer />
      <Input
        errorText="Email not found"
        isInvalid
        helperText="Enter email linked to this account"
        label="Email"
        // use id when placeholders don't help browser detect auto complete.
        id="Email"
        placeholder="xyz@abc.com"
      />
    </View>
  );
};

const Spacer = () => {
  return <View style={{ height: 20 }} />;
};
export default {
  component: Input,
  title: "Components/Input",
} as Meta;
