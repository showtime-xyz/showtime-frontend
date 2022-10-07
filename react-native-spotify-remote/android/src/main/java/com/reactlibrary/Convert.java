package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.spotify.protocol.types.Album;
import com.spotify.protocol.types.Artist;
import com.spotify.protocol.types.CrossfadeState;
import com.spotify.protocol.types.ImageUri;
import com.spotify.protocol.types.ListItem;
import com.spotify.protocol.types.ListItems;
import com.spotify.protocol.types.PlayerOptions;
import com.spotify.protocol.types.PlayerRestrictions;
import com.spotify.protocol.types.PlayerState;
import com.spotify.protocol.types.PlayerContext;
import com.spotify.protocol.types.Track;
import com.spotify.sdk.android.auth.AuthorizationResponse;

import java.util.Calendar;

public class Convert {

    public static ReadableMap toMap(AuthorizationResponse response){
        if(response != null) {
            WritableMap map = Arguments.createMap();
            Calendar expirationDate = Calendar.getInstance();
            expirationDate.add(Calendar.SECOND,response.getExpiresIn());

            switch (response.getType()) {
                case TOKEN:
                    map.putString("accessToken", response.getAccessToken());
                    break;
            
                case CODE:
                    map.putString("accessToken", response.getCode());
                    break;
            }
            map.putString("expirationDate", expirationDate.toString());
            map.putBoolean("expired",Calendar.getInstance().after(expirationDate));
            return map;
        }else {
            return null;
        }
    }


    public static ReadableArray toArray(ListItems listItems) {
        WritableArray array = Arguments.createArray();
        for (ListItem item : listItems.items) {
            array.pushMap(Convert.toMap(item));
        }
        return array;
    }

    public static ReadableMap toMap(ListItem item) {
        WritableMap map = Arguments.createMap();
        map.putString("title", item.title);
        map.putString("subtitle", item.subtitle);
        map.putString("id", item.id);
        map.putString("uri", item.uri);
        map.putBoolean("playable", item.playable);

        // Not supported by android SDK, so put empty to maintain signature
        map.putArray("children", Arguments.createArray());
        map.putBoolean("container", item.hasChildren);
        map.putBoolean("availableOffline", false);

        return map;
    }

    public static ListItem toItem(ReadableMap map){
        ListItem item = new ListItem(
                map.getString("id"),
                map.getString("uri"),
                new ImageUri(""),
                map.getString("title"),
                map.getString("subtitle"),
                map.getBoolean("playable"),
                map.getBoolean("container")
        );
        return item;
    }

    public static ReadableMap toMap(CrossfadeState state) {
        WritableMap map = Arguments.createMap();
        map.putBoolean("enabled", state.isEnabled);
        map.putInt("duration", state.duration);
        return map;
    }

    public static ReadableMap toMap(Album album) {
        WritableMap map = Arguments.createMap();
        map.putString("name", album.name);
        map.putString("uri", album.uri);
        return map;
    }

    public static ReadableMap toMap(Artist artist) {
        WritableMap map = Arguments.createMap();
        map.putString("name", artist.name);
        map.putString("uri", artist.uri);
        return map;
    }

    public static ReadableMap toMap(Track track) {
        WritableMap map = Arguments.createMap();

        map.putDouble("duration", (double) track.duration);
        map.putBoolean("isPodcast", track.isPodcast);
        map.putBoolean("isEpisode", track.isEpisode);
        map.putString("uri", track.uri);
        map.putString("name", track.name);
        map.putMap("artist", Convert.toMap(track.artist));
        map.putMap("album", Convert.toMap(track.album));

        return map;
    }

    public static ReadableMap toMap(PlayerOptions options) {
        WritableMap map = Arguments.createMap();
        map.putDouble("repeatMode", options.repeatMode);
        map.putBoolean("isShuffling", options.isShuffling);
        return map;
    }

    public static ReadableMap toMap(PlayerRestrictions restrictions) {
        WritableMap map = Arguments.createMap();

        map.putBoolean("canRepeatContext", restrictions.canRepeatContext);
        map.putBoolean("canRepeatTrack", restrictions.canRepeatTrack);
        map.putBoolean("canSeek", restrictions.canSeek);
        map.putBoolean("canSkipNext", restrictions.canSkipNext);
        map.putBoolean("canSkipPrev", restrictions.canSkipPrev);
        map.putBoolean("canToggleShuffle", restrictions.canToggleShuffle);

        return map;
    }


    public static WritableMap toMap(PlayerState playerState) {
        WritableMap map = Arguments.createMap();

        map.putBoolean("isPaused", playerState.isPaused);
        map.putDouble("playbackPosition", (double) playerState.playbackPosition);
        map.putDouble("playbackSpeed", playerState.playbackSpeed);
        map.putMap("playbackOptions", Convert.toMap(playerState.playbackOptions));
        map.putMap("playbackRestrictions", Convert.toMap(playerState.playbackRestrictions));
        map.putMap("track", Convert.toMap(playerState.track));

        return map;
    }


    public static ReadableMap toMap(PlayerContext playerContext) {
        WritableMap map = Arguments.createMap();

        map.putString("title", playerContext.title);
        map.putString("uri", playerContext.uri);

        return map;
    }


}
