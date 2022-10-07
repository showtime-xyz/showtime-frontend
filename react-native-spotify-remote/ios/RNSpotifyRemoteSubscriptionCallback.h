//
//  RNSpotifySubscriptionCallback.h
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-10.
//  Copyright © 2018. All rights reserved.
//

#ifndef RNSpotifySubscriptionCallback_h
#define RNSpotifySubscriptionCallback_h

// This just defines a callback that takes a void callback as an argument
// This is so that we can pass an onSuccess callback to the subscriber
#define CallBack void(^)(void(^)(void))

@interface RNSpotifyRemoteSubscriptionCallback : NSObject

-(id)initWithCallbacks:(CallBack)subscriber unsubscriber:(CallBack)unsubscriber;
-(void)subscribe;
-(void)unSubscribe;
-(void)reset;

+(RNSpotifyRemoteSubscriptionCallback*)subscriber:(CallBack)subscriber unsubscriber:(CallBack)unsubscriber;

+(RNSpotifyRemoteSubscriptionCallback*)unsubscriber:(CallBack)unsubscriber subscriber:(CallBack)subscriber;

@end

#endif /* RNSpotifySubscriptionCallback_h */
