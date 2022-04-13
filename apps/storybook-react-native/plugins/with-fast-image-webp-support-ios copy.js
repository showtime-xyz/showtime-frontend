const {
  WarningAggregator,
  withAppDelegate,
  createRunOncePlugin,
} = require("@expo/config-plugins");

const RNFI_EXPO_WEBP_IMPORT = `#import "AppDelegate.h"
#import "SDImageCodersManager.h"
#import <SDWebImageWebPCoder/SDImageWebPCoder.h>`;

const RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_IDENTIFIER = `- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{`;

const RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_CODE = `
[SDImageCodersManager.sharedManager addCoder:SDImageWebPCoder.sharedCoder];
[[SDWebImageDownloader sharedDownloader] setValue:@"image/webp,image/*,*/*;q=0.8" forHTTPHeaderField:@"Accept"];
`;

function modifyAppDelegate(appDelegate) {
  if (!appDelegate.includes(RNFI_EXPO_WEBP_IMPORT)) {
    appDelegate = appDelegate.replace(
      /#import "AppDelegate.h"/g,
      RNFI_EXPO_WEBP_IMPORT
    );
  }
  if (
    appDelegate.includes(RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_IDENTIFIER) &&
    !appDelegate.includes(RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_CODE)
  ) {
    const block =
      RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_IDENTIFIER +
      RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_CODE;
    appDelegate = appDelegate.replace(
      RNFI_EXPO_WEBP_DID_FINISH_LAUNCHING_IDENTIFIER,
      block
    );
  }
  return appDelegate;
}

const withFastImageWebPSupportIOS = (config) => {
  return withAppDelegate(config, (config) => {
    if (config.modResults.language === "objc") {
      config.modResults.contents = modifyAppDelegate(
        config.modResults.contents
      );
    } else {
      WarningAggregator.addWarningIOS(
        "withFastImageWebPSupportIOSAppDelegate",
        "Swift AppDelegate files are not supported yet."
      );
    }
    return config;
  });
};

module.exports = createRunOncePlugin(
  withFastImageWebPSupportIOS,
  "rnfi-expo-animated-webp-support",
  "1.0.0"
);
