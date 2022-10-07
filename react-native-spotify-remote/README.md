
# Spotify App Remote for React Native

[![npm version](https://badge.fury.io/js/react-native-spotify-remote.svg)](https://badge.fury.io/js/react-native-spotify-remote)

A react native module for the Spotify Remote SDK ( [iOS](https://github.com/spotify/ios-sdk/) | [Android](https://github.com/spotify/android-sdk/) )

- [Documentation](https://cjam.github.io/react-native-spotify-remote/index.html)
- [Change Log](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)

## Supported Features

An [Example](./example) project was developed to exercise and test all functionality within this library.  If you are curious about how to use something, or need to compare your application setup to something that works, check there first.

## Features

The following table shows the platform support for various Spotify Remote API functionality within this library.

|Feature|iOS|Android||
|:--|:-:|:-:|-:|
|**Authentication**|
|`authorize`					|✅|✅||
|`getSession`					|✅|✅||
|`endSession`					|✅|✅||
|**Remote**|
|`isConnectedAsync`				|✅|✅||
|`connect`						|✅|✅||
|`disconnect`					|✅|✅||
|`playUri`						|✅|✅||
|`playItem`						|✅|✅||
|`playItemWithIndex`			|✅|✅||
|`queueUri`						|✅|✅||
|`seek`							|✅|✅||
|`resume`						|✅|✅||
|`pause`						|✅|✅||
|`skipToNext`					|✅|✅||
|`skipToPrevious`				|✅|✅||
|`setShuffling`					|✅|✅||
|`setRepeatMode`				|✅|✅||
|`getPlayerState`				|✅|✅||
|`getRootContentItems`			|✅|❌|Not available in Android SDK|
|`getRecommendedContentItems`	|✅|✅||
|`getChildrenOfItem`			|✅|✅||
|`getContentItemForUri`			|✅|❌|Not available in Android SDK|
|`getCrossfadeState`			|✅|✅||
|**Remote Events**|
|`playerStateChanged`			|✅|✅||
|`playerContextChanged`			|✅|✅||
|`remoteDisconnected`			|✅|✅||
|`remoteConnected`				|✅|✅||

## Install

```bash
yarn add react-native-spotify-remote
```

or

```bash
npm install --save react-native-spotify-remote
```

## Linking

As of React Native `> 0.61`, auto linking should work for both iOS and Android.  There shouldn't be any modifications necessary and it *Should* work out of the box.  The one caveat, is that `react-native-events` needs to be linked as it doesn't yet support auto linking.  If you do run into issues or are using an older version of React Native, the following sections should help get you up and running.

### iOS

>This library requires being built with **XCode 11** for reasons given [here](https://github.com/spotify/ios-sdk/issues/179#issuecomment-581032275).

#### Cocoapods (Recommended)

By far the easiest way to integrate into your project.  In your `ios/PodFile` add the following lines to your projects target:

```rb
	pod 'RNEventEmitter', :path => "../node_modules/react-native-events"
	pod 'RNSpotifyRemote', :path => '../node_modules/react-native-spotify-remote'
```

See the [`Example App PodFile`](./example/ios/PodFile) for a full example.

I have only tested this against RN > 0.60 in the example app.  So if you have issues with a RN version < 0.60 that might be a place to start troubleshooting.

#### Manual

Manual linking is needed for projects that don't use Cocoapods.

1. Manually add the frameworks from `node_modules/react-native-spotify-remote/ios/external/SpotifySDK` to *Linked Frameworks and Libraries* in your project settings. 

![iOS Framework Search paths](.screenshots/ios-add-framework.png);

2. Then add `../node_modules/react-native-spotify-remote/ios/external/SpotifySDK` to *Framework Search Paths* in your project settings see the screenshot below. (By default it won't show the options in XCode so you may need to check `all`)

![iOS Framework Search paths](.screenshots/ios-framework-searchpaths.png);


##### Troubleshooting

`'React/RCTConvert.h' file not found` might be due to a build dependency issue where `RNSpotifyRemote` is being built *before* `React`.  Try adding `React` as an explicit dependency of the `RNSpotifyRemote` target/project in XCode.  Otherwise, Cocoapods should solve this for you.


## Auth Callback

In order to support the callback that you will get from the Spotify App you will need to add a url handler to your app.

### iOS

Modifications are needed for the `AppDelegate.m`:

```objective-c
#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNSpotifyRemote.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)URL options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  return [[RNSpotifyRemoteAuth sharedInstance] application:application openURL:URL options:options];
}

@end
```

### Android

If you need to link your project manually, here are some things you'll need to do.  

> ### `react-native-events` does not support autolinking at this point and will need to be manually linked into your application

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add the following imports to the top of the file
  ```
  import com.reactlibrary.RNSpotifyRemotePackage;
  import com.lufinkey.react.eventemitter.RNEventEmitterPackage;
  ``` 
  - Add to the list returned by `getPackages()` for example:
  ```java
        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
           packages.add(new RNEventEmitterPackage());
		   packages.add(new RNSpotifyRemotePackage());
          return packages;
        }
  ```

2. Append the following lines to `android/settings.gradle`:
  	```
	include ':react-native-spotify-remote'
	project(':react-native-spotify-remote').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-spotify-remote/android')

	include ':react-native-events'
	project(':react-native-events').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-events/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
    implementation project(':react-native-spotify-remote')
    implementation project(':react-native-events')
  	```
4. As per the [Spotify Android SDK Docs](https://developer.spotify.com/documentation/android/guides/android-authentication/) Insert the following lines into `android/app/src/AndroidManifest.xml`

```xml
      <activity
            android:exported="true"
            android:name="com.spotify.sdk.android.authentication.AuthCallbackActivity"
            android:theme="@android:style/Theme.Translucent.NoTitleBar">

            <intent-filter>
                <action android:name="android.intent.action.VIEW"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <category android:name="android.intent.category.BROWSABLE"/>

                <data
                    android:scheme="<YOUR_APPLICATION_SCHEME>"
                    android:host="<YOUR_APPLICATION_CALLBACK>"/>
            </intent-filter>
        </activity>

        <activity
            android:name="com.spotify.sdk.android.authentication.LoginActivity"
            android:theme="@android:style/Theme.Translucent.NoTitleBar">
        </activity>
```

If you have issues linking the module, please check that gradle is updated to the latest version and that your project is synced.

## Usage

### Example Application

This repo contains an [Example App](./example/Readme.md) which should be the quickest and easiest way to get up and running to try things out.  It is using React Hooks (cuz they're pretty cool) and exercises all of the remote API calls.

### In Code

Again, I recommend looking at the example app.  If you specifically want to see some code that actually does stuff take a look at the [App.tsx](./example/App.tsx).

Here's how you would use this library with Typescript (though the same mostly applies to Javascript) and the `async`/`await` syntax for promises (Just cuz I like em).

```typescript
import { 
	auth as SpotifyAuth, 
	remote as SpotifyRemote, 
	ApiScope, 
	ApiConfig
} from 'react-native-spotify-remote';

// Api Config object, replace with your own applications client id and urls
const spotifyConfig: ApiConfig = {
	clientID: "SPOTIFY_CLIENT_ID",
	redirectURL: "SPOTIFY_REDIRECT_URL",
	tokenRefreshURL: "SPOTIFY_TOKEN_REFRESH_URL",
	tokenSwapURL: "SPOTIFY_TOKEN_SWAP_URL",
	scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope]
}

// Initialize the library and connect the Remote
// then play an epic song
async function playEpicSong(){
	try{
		const session = await SpotifyAuth.authorize(spotifyConfig);
		await SpotifyRemote.connect(session.accessToken);
		await SpotifyRemote.playUri("spotify:track:6IA8E2Q5ttcpbuahIejO74");
                await SpotifyRemote.seek(58000);
	}catch(err){
		console.error("Couldn't authorize with or connect to Spotify",err);
	}   
}
```

## Token Swap & Refresh

> A server must be running for with endpoints that allow Spotify to authenticate your app.

In order to support the OAuth flow, you need to have a server to support the calls for token `swap` and `refresh`.  I have included  the same server setup defined in the [react-native-spotify](https://github.com/lufinkey/react-native-spotify#token-swap-and-refresh) repo as it does exactly what you need.

See the [Server Readme](./example-server/README.md) for further instructions.

## Additional notes

Nothing has been special to deal with Spotify *Free* Users but this module _should_ still work.

## Opening Issues

Please do not open issues about getting the module to work unless you have tried using both the example app and the example token swap server. Please make sure you have tried running on the latest react-native version before submitting a bug.

## Contributors

Big thanks to [@lufinkey](https://github.com/lufinkey) and all of the great work that he has done in the [react-native-spotify](https://github.com/lufinkey/react-native-spotify) repo which was the original source of inspiration and some useful patterns for this package.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-11-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/cjam"><img src="https://avatars2.githubusercontent.com/u/1000288?v=4" width="100px;" alt=""/><br /><sub><b>Colter McQuay</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=cjam" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/lufinkey"><img src="https://avatars3.githubusercontent.com/u/7820113?v=4" width="100px;" alt=""/><br /><sub><b>Luis Finke</b></sub></a><br /><a href="#ideas-lufinkey" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/YozhikM"><img src="https://avatars0.githubusercontent.com/u/27273025?v=4" width="100px;" alt=""/><br /><sub><b>Stanislav</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=YozhikM" title="Code">💻</a></td>
    <td align="center"><a href="https://djwillcaine.com"><img src="https://avatars3.githubusercontent.com/u/5376687?v=4" width="100px;" alt=""/><br /><sub><b>Will Caine</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=djwillcaine" title="Code">💻</a></td>
    <td align="center"><a href="http://www.estuderevisapp.com/"><img src="https://avatars0.githubusercontent.com/u/7197169?v=4" width="100px;" alt=""/><br /><sub><b>Everaldo Rosa de Souza Junior</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=juniorklawa" title="Code">💻</a></td>
    <td align="center"><a href="http://www.cankalya.com"><img src="https://avatars.githubusercontent.com/u/33005883?v=4" width="100px;" alt=""/><br /><sub><b>İbrahim Can KALYA</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=IbrahimCanKALYA" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/uptotec"><img src="https://avatars.githubusercontent.com/u/38630967?v=4" width="100px;" alt=""/><br /><sub><b>Mahmoud Ashraf Mahmoud</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=uptotec" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://linkedin.com/in/serafettinaytekin"><img src="https://avatars.githubusercontent.com/u/19591219?v=4" width="100px;" alt=""/><br /><sub><b>Şerafettin Aytekin</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=srfaytkn" title="Code">💻</a></td>
    <td align="center"><a href="http://reteps.github.io"><img src="https://avatars.githubusercontent.com/u/13869303?v=4" width="100px;" alt=""/><br /><sub><b>Peter Stenger</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/commits?author=reteps" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/reinhardholl"><img src="https://avatars.githubusercontent.com/u/4051986?v=4" width="100px;" alt=""/><br /><sub><b>Reinhard Höll</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/issues?q=author%3Areinhardholl" title="Bug reports">🐛</a> <a href="https://github.com/cjam/react-native-spotify-remote/commits?author=reinhardholl" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/gustavoggs"><img src="https://avatars.githubusercontent.com/u/793491?v=4" width="100px;" alt=""/><br /><sub><b>Gustavo Graña</b></sub></a><br /><a href="https://github.com/cjam/react-native-spotify-remote/issues?q=author%3Agustavoggs" title="Bug reports">🐛</a> <a href="https://github.com/cjam/react-native-spotify-remote/commits?author=gustavoggs" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
