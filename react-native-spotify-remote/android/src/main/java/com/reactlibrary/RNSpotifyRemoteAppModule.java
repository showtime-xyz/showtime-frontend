
package com.reactlibrary;

import android.util.Log;

import androidx.arch.core.util.Function;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.lufinkey.react.eventemitter.RNEventEmitter;
import com.spotify.android.appremote.api.ConnectionParams;
import com.spotify.android.appremote.api.Connector;
import com.spotify.android.appremote.api.SpotifyAppRemote;
import com.spotify.android.appremote.api.error.CouldNotFindSpotifyApp;
import com.spotify.android.appremote.api.error.NotLoggedInException;
import com.spotify.android.appremote.api.error.UserNotAuthorizedException;

import com.lufinkey.react.eventemitter.RNEventConformer;

import com.spotify.protocol.client.CallResult;
import com.spotify.protocol.client.ErrorCallback;
import com.spotify.protocol.types.ListItem;

import java.util.Stack;


@ReactModule(name = "RNSpotifyRemoteAppRemote")
public class RNSpotifyRemoteAppModule extends ReactContextBaseJavaModule implements RNEventConformer {
    private static final String LOG_TAG = "RNSpotifyAppRemote";

    private final ReactApplicationContext reactContext;

    private RNSpotifyRemoteAuthModule authModule;
    private SpotifyAppRemote mSpotifyAppRemote;
    private Connector.ConnectionListener mSpotifyRemoteConnectionListener;
    private Stack<Promise> mConnectPromises = new Stack<Promise>();

    public RNSpotifyRemoteAppModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mSpotifyRemoteConnectionListener = new Connector.ConnectionListener() {

            public void onConnected(SpotifyAppRemote spotifyAppRemote) {
                mSpotifyAppRemote = spotifyAppRemote;
                handleOnConnect();
                while (!mConnectPromises.empty()) {
                    Promise promise = mConnectPromises.pop();
                    promise.resolve(true);
                }
                sendEvent("remoteConnected", null);
            }

            public void onFailure(Throwable throwable) {
                while (!mConnectPromises.empty()) {
                    Promise promise = mConnectPromises.pop();
                    if (throwable instanceof NotLoggedInException) {
                        promise.reject(new Error("Spotify connection failed: user is not logged in."));
                    } else if (throwable instanceof UserNotAuthorizedException) {
                        promise.reject(new Error("Spotify connection failed: user is not authorized."));
                    } else if (throwable instanceof CouldNotFindSpotifyApp) {
                        promise.reject(new Error("Spotify connection failed: could not find the Spotify app, it may need to be installed."));
                    } else {
                        promise.reject(throwable);   
                    }
                }
                sendEvent("remoteDisconnected", null);
            }
        };
    }

    @Override
    @ReactMethod
    public void __registerAsJSEventEmitter(int moduleId) {
        RNEventEmitter.registerEventEmitterModule(this.reactContext, moduleId, this);
    }

    @Override
    public void onNativeEvent(String eventName, Object... args) {
        // Called when an event for this module is emitted from native code
    }

    @Override
    public void onJSEvent(String eventName, Object... args) {
        // Called when an event for this module is emitted from javascript
    }

    @Override
    public void onEvent(String eventName, Object... args) {
        // Called when any event for this module is emitted
    }

    private void sendEvent(String eventMame, Object data) {
        RNEventEmitter.emitEvent(this.reactContext, this, eventMame, data);
    }
    
    private void handleOnConnect() {
        mSpotifyAppRemote.getPlayerApi()
                .subscribeToPlayerContext()
                .setEventCallback(playerContext -> {
                    ReadableMap map = Convert.toMap(playerContext);
                    sendEvent("playerContextChanged", map);
                });
        mSpotifyAppRemote.getPlayerApi()
                .subscribeToPlayerState()
                .setEventCallback(playerState -> {
                    WritableMap map = Convert.toMap(playerState);
                    sendEvent("playerStateChanged", map);
                });
    }

    private <T> void executeAppRemoteCall(Function<SpotifyAppRemote, CallResult<T>> apiCall, CallResult.ResultCallback<T> resultCallback, ErrorCallback errorCallback) {
        if (mSpotifyAppRemote == null) {
            errorCallback.onError(new Error("Spotify App Remote not connected"));
        } else {
            apiCall.apply(mSpotifyAppRemote)
                    .setResultCallback(resultCallback)
                    .setErrorCallback(errorCallback);
        }
    }

    private void getPlayerStateInternal(CallResult.ResultCallback<ReadableMap> resultCallback, ErrorCallback errorCallback) {
        if (mSpotifyAppRemote == null) {
            errorCallback.onError(new Error("Spotify App Remote not connected"));
        } else {
            mSpotifyAppRemote.getPlayerApi().getPlayerState()
                    .setResultCallback(playerState -> {
                        WritableMap map = Convert.toMap(playerState);
                        WritableMap eventMap = Convert.toMap(playerState);
                        sendEvent("playerStateChanged", eventMap);
                        resultCallback.onResult(map);
                    })
                    .setErrorCallback(errorCallback);
        }
    }
    @ReactMethod
    public void connectWithoutAuth(String token, String clientId, String redirectUri, Promise promise) {
        ConnectionParams.Builder paramsBuilder = new ConnectionParams.Builder(clientId)
                .setRedirectUri(redirectUri);
        // With this method, users must be preauthorized to use the scope as we cannot display it

        if (mConnectPromises.empty()) {
            mConnectPromises.push(promise);
            ConnectionParams connectionParams = paramsBuilder.build();
            SpotifyAppRemote.connect(this.getReactApplicationContext(), connectionParams,
                    mSpotifyRemoteConnectionListener);
        } else {
            mConnectPromises.push(promise);
        }
    }
    @ReactMethod
    public void connect(String token, Promise promise) {
        // todo: looks like the android remote handles it's own auth (since it doesn't have a token)
        // todo: argument.  Can probably improve the experience for those who don't need a token
        // todo: and just want to connect the remote
        authModule = reactContext.getNativeModule(RNSpotifyRemoteAuthModule.class);
        Error notAuthError = new Error("Auth module has not been authorized.");
        if (authModule == null) {
            promise.reject(notAuthError);
            return;
        }
        ConnectionParams.Builder paramsBuilder = authModule.getConnectionParamsBuilder();
        if (paramsBuilder == null) {
            promise.reject(notAuthError);
            return;
        }

        // If we're already connecting then just push the promise onto stack to handle
        // when connected
        if (mConnectPromises.empty()) {
            mConnectPromises.push(promise);
            ConnectionParams connectionParams = paramsBuilder.build();
            SpotifyAppRemote.connect(this.getReactApplicationContext(), connectionParams,
                    mSpotifyRemoteConnectionListener);
        } else {
            mConnectPromises.push(promise);
        }
    }

    @ReactMethod
    public void disconnect(Promise promise) {
        if (mSpotifyAppRemote != null) {
            SpotifyAppRemote.disconnect(mSpotifyAppRemote);
            sendEvent("remoteDisconnected", null);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void isConnectedAsync(Promise promise) {
        if (mSpotifyAppRemote != null) {
            boolean isConnected = mSpotifyAppRemote.isConnected();
            promise.resolve(isConnected);
        } else {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void playUri(String uri, Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().play(uri),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void playItem(ReadableMap map, Promise promise) {
        executeAppRemoteCall(
                api -> api.getContentApi().playContentItem(Convert.toItem(map)),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void playItemWithIndex(ReadableMap map, int index, Promise promise) {
        executeAppRemoteCall(
                api -> {
                    return api.getPlayerApi().skipToIndex(map.getString("uri"), index);
                },
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void queueUri(String uri, Promise promise) {
        if (!uri.startsWith("spotify:track:")) {
            promise.reject(new Error("Can only queue Spotify track uri's (i.e. spotify:track:<id>)"));
        }
        executeAppRemoteCall(
                api -> api.getPlayerApi().queue(uri),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void seek(float ms, Promise promise) {
        long positionMs = (long) ms;
        executeAppRemoteCall(
                api -> api.getPlayerApi().seekTo(positionMs),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void resume(Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().resume(),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void pause(Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().pause(),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void skipToNext(Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().skipNext(),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void skipToPrevious(Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().skipPrevious(),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void setShuffling(boolean isShuffling, Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().setShuffle((isShuffling)),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void setRepeatMode(int repeatMode, Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().setRepeat((repeatMode)),
                empty -> promise.resolve(null),
                err -> promise.reject(err)
        );
    }

    @ReactMethod
    public void getPlayerState(final Promise promise) {
        this.getPlayerStateInternal(
                playerState -> {
                    promise.resolve(playerState);
                },
                error -> {
                    promise.reject(error);
                }
        );
    }

    @ReactMethod
    public void getRecommendedContentItems(ReadableMap options, Promise promise) {
        executeAppRemoteCall(
                api -> api.getContentApi().getRecommendedContentItems(options.getString("type")),
                listItems -> {
                    promise.resolve(Convert.toArray(listItems));
                },
                error -> promise.reject(error)
        );
    }

    @ReactMethod
    public void getChildrenOfItem(ReadableMap itemMap, ReadableMap options, Promise promise) {
        executeAppRemoteCall(
                api -> {
                    int perPage = options.getInt("perPage");
                    int offset = options.getInt("offset");
                    ListItem listItem = Convert.toItem(itemMap);
                    return api.getContentApi().getChildrenOfItem(listItem, perPage, offset);
                },
                listItems -> {
                    promise.resolve(Convert.toArray(listItems));
                },
                error -> promise.reject(error)
        );
    }

    @ReactMethod
    public void getCrossfadeState(Promise promise) {
        executeAppRemoteCall(
                api -> api.getPlayerApi().getCrossfadeState(),
                crossfadeState -> {
                    promise.resolve(Convert.toMap(crossfadeState));
                },
                error -> promise.reject(error)
        );
    }

    @ReactMethod
    public void getRootContentItems(String type, Promise promise) {
        Log.w(LOG_TAG, "getRootContentItems is not Implemented in Spotify Android SDK, returning []");
        promise.resolve(Arguments.createArray());
    }

    @ReactMethod
    public void getContentItemForUri(String uri, Promise promise) {
        Log.w(LOG_TAG, "getContentItemForUri is not Implemented in Spotify Android SDK, returning null");
        promise.resolve(null);
    }

    @Override
    public String getName() {
        return "RNSpotifyRemoteAppRemote";
    }
}
