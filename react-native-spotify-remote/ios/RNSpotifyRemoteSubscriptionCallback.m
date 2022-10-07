//
//  RNSubscriptionCallback.m
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-10.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "./RNSpotifyRemoteSubscriptionCallback.h"

@interface RNSpotifyRemoteSubscriptionCallback()
{
    BOOL _isSubscribed;
    void(^_subscriber)(void(^)(void));
    void(^_unsubscriber)(void(^)(void));
}

@end

@implementation RNSpotifyRemoteSubscriptionCallback

- (id)initWithCallbacks:(CallBack)subscriber unsubscriber:(CallBack)unsubscriber{
    if(self = [super init])
    {
        _isSubscribed = NO;
        _subscriber = subscriber;
        _unsubscriber = unsubscriber;
    }
    return self;
}

-(void)subscribe{
    if(_isSubscribed == NO){
        _subscriber(^{
            self->_isSubscribed = YES;
        });
    }
}

-(void)unSubscribe{
    if(_isSubscribed == YES){
        _unsubscriber(^{
            self->_isSubscribed = NO;
        });
    }
}

-(void)reset{
    self->_isSubscribed = NO;
}

+(RNSpotifyRemoteSubscriptionCallback*)subscriber:(CallBack)subscriber unsubscriber:(CallBack)unsubscriber{
    return [[self alloc] initWithCallbacks:subscriber unsubscriber:unsubscriber];
}

+(RNSpotifyRemoteSubscriptionCallback*)unsubscriber:(CallBack)unsubscriber subscriber:(CallBack)subscriber{
    return [[self alloc] initWithCallbacks:subscriber unsubscriber:unsubscriber];
}

@end
