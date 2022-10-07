Here you will find status messages, alerts, and errors that should be handled by a partner app.

## Development/Implementation Errors

Errors are implemented as a number of exception classes that will be delivered through callbacks
when they occur. By investigating the type of the error, implementations can chose the right course
of action.

### Connection errors

Connection errors are delivered through the on `onFailure` method of `ConnectionListener`.
Connection errors can occur at any time from that a clients calls `connect` up until the time the
client has disconnected. The following comprises a list of errors that can be delivered through the
`ConnectionListener.onFailure()` callback:

```
   CouldNotFindSpotifyApp
```

The Spotify app is not installed on the device. The Spotify Android app must be installed on the 
user's device in order for the Spotify App Remote SDK to work. Please see the 
["Installing Spotify" section](https://beta.developer.spotify.com/documentation/general/guides/content-linking-guide/) 
of the Content Linking guide on how to direct users to download Spotify.

```
   NotLoggedInException
```

No one is logged in to the Spotify app on this device. Guide the user to log in to Spotify and try
again.

```
   AuthenticationFailedException
```

Partner app failed to authenticate with Spotify. Check client credentials and make sure your app is
registered correctly at developer.spotify.com

```
   UserNotAuthorizedException
```

Indicates the user did not authorize this client of App Remote to use Spotify on the users behalf.
You need to make sure they approve `app-remote-control` scope first. For details see the "Authorize
your application" section in the [tutorial](README.md)

```
   UnsupportedFeatureVersionException
```

Spotify app can't support requested features. User should update Spotify app.

```
   OfflineModeException
```

Spotify user has set their Spotify app to be in offline mode, but app remote requires a call to be
made to the backend. The user needs to disable offline mode in the Spotify app.

```
   LoggedOutException
```

User has logged out from Spotify. The difference between this one and `NotLoggedInException` is that
 in case of the latter the connection could not have been established. `LoggedOutException` means
 that user logged out after Remote SDK connected to Spotify app.

```
   SpotifyDisconnectedException
```

The Spotify app was/is disconnected by the Spotify app. This indicates typically that the Spotify
app was closed by the user or for other reasons. You need to reconnect to continue using Spotify App
 Remote.

```
   SpotifyConnectionTerminatedException
```

The connection to the Spotify app was unexpectedly terminated. Spotify might have crashed or was
killed by the system. You need to reconnect to continue using Spotify App Remote.

```
   SpotifyRemoteServiceException
```

Encapsulates possible `SecurityException` and `IllegalStateException` errors thrown by Context#startService(Intent) and Context#startForegroundService(Intent).  
`SecurityException` - If the caller does not have permission to access the service or the service can not be found.
`IllegalStateException` - If the application is in a state where the service can not be started, be found, or be accessed (such as not in the foreground in a state when services are allowed).
