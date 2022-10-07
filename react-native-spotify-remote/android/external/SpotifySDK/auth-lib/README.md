# Spotify Authentication Library

[![Build Status](https://travis-ci.org/spotify/android-auth.svg?branch=master)](https://travis-ci.org/spotify/android-auth)

This library is responsible for authenticating the user and fetching the access token
that can subsequently be used to play music or in requests to the [Spotify Web API](https://developer.spotify.com/web-api/).

# Integrating the library into your project

To add this library to your project add the reference to its `build.gradle` file:

```gradle
implementation 'com.spotify.android:auth:1.2.3'
```

To learn more about working with authentication see the
[Authentication Guide](https://developer.spotify.com/technologies/spotify-android-sdk/android-sdk-authentication-guide/)
and the [API reference](https://developer.spotify.com/android-sdk-docs/authentication) on the developer site.

The following entries are merged into your manifest when you add the libary:

```xml
<uses-permission android:name="android.permission.INTERNET"/>

<activity
    android:exported="true"
    android:name="com.spotify.sdk.android.authentication.AuthCallbackActivity"
    android:theme="@android:style/Theme.Translucent.NoTitleBar">

    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>

        <data
            android:scheme="@string/com_spotify_sdk_redirect_scheme"
            android:host="@string/com_spotify_sdk_redirect_host"/>
    </intent-filter>
</activity>

<activity
    android:name="com.spotify.sdk.android.authentication.LoginActivity"
    android:theme="@android:style/Theme.Translucent.NoTitleBar">
</activity>
```

You will need to add the following strings to your project to enable Chrome CustomTabs
login flow:

```xml
<resources>
    <string name="com_spotify_sdk_redirect_scheme">yourscheme</string>
    <string name="com_spotify_sdk_redirect_host">yourhost</string>
</resources>
```

So, if you provided `bestapp://ismyapp` as a redirect URI in [the developer console](https://developer.spotify.com/my-applications/#!/applications)
then you set `com_spotify_sdk_redirect_scheme` to `bestapp` and `com_spotify_sdk_redirect_host` to `ismyapp`.

Since Chrome CustomTabs share credentials with the Chrome instance you have installed
you get much better experience logging users in compare to WebView flow.

# Sample Code

Checkout [the sample project](auth-sample).

# Contributing

You are welcome to contribute to this project. Please make sure that:
* New code is test covered
* Features and APIs are well documented
* `./gradlew check` must succeed

## Code of conduct
This project adheres to the [Open Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/spotify/code-of-conduct/blob/master/code-of-conduct.md

