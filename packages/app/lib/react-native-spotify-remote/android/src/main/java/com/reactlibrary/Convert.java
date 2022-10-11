package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
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



}
