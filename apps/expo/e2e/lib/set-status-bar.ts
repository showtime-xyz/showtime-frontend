import { execSync } from "child_process";
import { device } from "detox";

// eslint-disable-next-line @typescript-eslint/require-await
export async function setStatusBar() {
  if (device.getPlatform() === "ios") {
    // TODO: Set date on iPad - "Tue Jan 9"
    // assumes only one simulator is booted
    // use Apple's magic time "9:41" - new Date('1/9/2007 09:41').toISOString()
    execSync(
      "xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode active --cellularBars 4"
    );
  } else {
    // enter demo mode
    execSync("adb shell settings put global sysui_demo_allowed 1");
    // display time 6:00
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1850"
    );
    // Display full mobile data with 4g type and no wifi
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype 4g -e wifi false"
    );
    // Hide notifications
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false"
    );
    // Show full battery but not in charging state
    execSync(
      "adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100"
    );
  }
}
