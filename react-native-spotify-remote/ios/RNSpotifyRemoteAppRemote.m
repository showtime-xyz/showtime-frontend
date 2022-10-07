
#import "RNSpotifyRemoteAppRemote.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTConvert.h>
#import <SpotifyiOS.h>
#import "RNSpotifyRemoteConvert.h"
#import "RNSpotifyItem.h"
#import "RNSpotifyRemoteError.h"
#import "RNSpotifyRemotePromise.h"
#import "RNSpotifyRemoteSubscriptionCallback.h"
#import "RNSpotifyRemoteAuth.h"
#import "Macros.h"
#define SPOTIFY_API_BASE_URL @"https://api.spotify.com/"
#define SPOTIFY_API_URL(endpoint) [NSURL URLWithString:NSString_concat(SPOTIFY_API_BASE_URL, endpoint)]

static NSString * const EventNamePlayerStateChanged = @"playerStateChanged";
static NSString * const EventNamePlayerContextChanged = @"playerContextChanged";
static NSString * const EventNameRemoteDisconnected = @"remoteDisconnected";
static NSString * const EventNameRemoteConnected = @"remoteConnected";

// Static Singleton instance
static RNSpotifyRemoteAppRemote *sharedInstance = nil;

@interface RNSpotifyRemoteAppRemote() <SPTAppRemoteDelegate,SPTAppRemotePlayerStateDelegate>
{
    BOOL _isConnecting;
    NSString* _accessToken;

    NSMutableArray<RNSpotifyRemotePromise*>* _appRemoteCallbacks;
    NSMutableDictionary<NSString*,NSNumber*>* _eventSubscriptions;
    NSDictionary<NSString*,RNSpotifyRemoteSubscriptionCallback*>* _eventSubscriptionCallbacks;
    
    SPTAppRemote *_appRemote;
}
- (void)initializeAppRemote:(NSString*)accessToken completionCallback:(RNSpotifyRemotePromise*)completion;
- (void)handleEventSubscriptions;
- (void)resetEventSubscriptions;
@end

@implementation RNSpotifyRemoteAppRemote

@synthesize bridge = _bridge;

// Constants exported out to javascript
-(NSDictionary*)constantsToExport{
    return @{
        @"remoteContentTypes":SPTAppRemoteContentTypeDefault
    };
}

#pragma mark Singleton Methods

-(id)init
{
    // This is to hopefully maintain the singleton pattern within our React App.
    // Since ReactNative is the one allocating and initializing our instance,
    // we need to store the instance within the sharedInstance otherwise we'll
    // end up with a different one when calling shared instance statically
    if(sharedInstance == nil){
        if(self = [super init]){
            DLog(@"RNSpotify Initialized");
            _isConnecting=NO;
            _appRemoteCallbacks = [NSMutableArray array];
            
            _appRemote = nil;
            _eventSubscriptions = @{}.mutableCopy;
            _eventSubscriptionCallbacks = [self initializeEventSubscribers];
        }
        static dispatch_once_t once;
        dispatch_once(&once, ^{
            sharedInstance = self;
        });
    }
    return sharedInstance;
}

- (NSDictionary*)initializeEventSubscribers{
    return @{
      EventNamePlayerStateChanged: [RNSpotifyRemoteSubscriptionCallback subscriber:^(void(^onSuccess)(void)){
          if(self->_appRemote != nil && self->_appRemote.playerAPI != nil){
              self->_appRemote.playerAPI.delegate = self;
              RCTExecuteOnMainQueue(^{
                  [self->_appRemote.playerAPI subscribeToPlayerState:^(id  _Nullable result, NSError * _Nullable error) {
                      // todo: figure out what to do if there is an error
                      if(error != nil){
                          DLog(@"Couldn't Subscribe to PlayerStateChanges");
                      }else{
                          DLog(@"Subscribed to PlayerStateChanges");
                          onSuccess();
                      }
                  }];
              });
          }
      } unsubscriber:^(void(^onSuccess)(void)){
          if(self->_appRemote != nil && self->_appRemote.playerAPI != nil){
              RCTExecuteOnMainQueue(^{
                  [self->_appRemote.playerAPI unsubscribeToPlayerState:^(id  _Nullable result, NSError * _Nullable error) {
                      // todo: figure out what to do if there is an error
                      if(error != nil){
                          DLog(@"Couldn't Unsubscribe from PlayerStateChanges");
                      }else{
                          DLog(@"Unsubscribed to PlayerStateChanges");
                          onSuccess();
                      }
                  }];
              });
          }
      }]
    };
}

- (void)initializeAppRemote:(NSString*)accessToken completionCallback:(RNSpotifyRemotePromise*)completion{
    SPTAppRemoteLogLevel logLevel = IsDebug == 1 ? SPTAppRemoteLogLevelDebug : SPTAppRemoteLogLevelNone;
    _appRemote = [[SPTAppRemote alloc] initWithConfiguration:[[RNSpotifyRemoteAuth sharedInstance] configuration] logLevel:logLevel];
    _appRemote.connectionParameters.accessToken = accessToken != nil ? accessToken : [[RNSpotifyRemoteAuth sharedInstance] accessToken];
    _appRemote.delegate = self;
    // Add our callback before we connect
    [_appRemoteCallbacks addObject:completion];
    RCTExecuteOnMainQueue(^{
        [self->_appRemote connect];
    });
}

+ (instancetype)sharedInstance {
    // Hopefully ReactNative can take care of allocating and initializing our instance
    // otherwise we'll need to check here
    return sharedInstance;
}

- (void)disconnect{
    if([ self isConnected] == YES){
        [_appRemote disconnect];
    }
}

#pragma mark - SPTAppRemotePlayerStateDelegate implementation

- (void)playerStateDidChange:(nonnull id<SPTAppRemotePlayerState>)playerState {
    NSDictionary *state = [RNSpotifyRemoteConvert SPTAppRemotePlayerState:playerState];
    [self sendEvent:EventNamePlayerStateChanged args:@[state[@"state"]]];
    [self sendEvent:EventNamePlayerContextChanged args:@[state[@"context"]]];
}

#pragma mark - SPTAppRemoteDelegate implementation

- (void)appRemote:(nonnull SPTAppRemote *)appRemote didDisconnectWithError:(nullable NSError *)error {
    [RNSpotifyRemotePromise rejectCompletions:_appRemoteCallbacks error:[RNSpotifyRemoteError errorWithNSError:error]];
    [self resetEventSubscriptions];
    [self sendEvent:EventNameRemoteDisconnected args:@[]];
}

- (void)appRemote:(nonnull SPTAppRemote *)appRemote didFailConnectionAttemptWithError:(nullable NSError *)error {
    // Check if spotify is installed
    if(![RNSpotifyRemoteAuth.sharedInstance isSpotifyInstalled]){
        [RNSpotifyRemotePromise rejectCompletions:_appRemoteCallbacks error:[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.SpotifyNotInstalled ]];
    }else{
            [RNSpotifyRemotePromise rejectCompletions:_appRemoteCallbacks error:[RNSpotifyRemoteError errorWithNSError:error]];
    };
}

- (void)appRemoteDidEstablishConnection:(nonnull SPTAppRemote *)connectedRemote {
    [RNSpotifyRemotePromise resolveCompletions:_appRemoteCallbacks result:_appRemote];
    [self handleEventSubscriptions];
    [self sendEvent:EventNameRemoteConnected args:@[]];
}

#pragma mark - Utilities

+(void (^)(id _Nullable, NSError * _Nullable))defaultSpotifyRemoteCallback:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject{
    return ^(id  _Nullable result, NSError * _Nullable error) {
        if(error != nil){
            [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
        }else{
            resolve([NSNull null]);
        }
    };
}

-(BOOL)isConnected{
    return (_appRemote != nil && _appRemote.isConnected) ? YES : NO;
}


// A few different methods require checking the current playback state before they do things
// Since we are fetching it anyways, we can push out an event with the new state.
-(void)getPlayerStateInternal:(void(^)(id<SPTAppRemotePlayerState>)) resolve reject:(RCTPromiseRejectBlock)reject{
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player getPlayerState:^(id _Nullable result, NSError * _Nullable error) {
            if(error != nil){
                [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
            }else if( [result conformsToProtocol:@protocol(SPTAppRemotePlayerState)]){
                // Send a playerStateChanged event since we went and retrieved it anyways
                NSDictionary *state = [RNSpotifyRemoteConvert SPTAppRemotePlayerState:result];
                [self sendEvent:EventNamePlayerStateChanged args:@[state[@"state"]]];
                [self sendEvent:EventNamePlayerContextChanged args:@[state[@"context"]]];
                resolve(result);
            }else{
                [[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.UnknownResponse] reject:reject];
            }
        }];
    } reject:reject];
}

-(void)usePlayerApi:(void(^)(id<SPTAppRemotePlayerAPI>))callback reject:(RCTPromiseRejectBlock)reject{
    RCTExecuteOnMainQueue(^{
        if( self->_appRemote == nil || self->_appRemote.playerAPI == nil){
            [[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.PlayerNotReady] reject:reject];
        }else{
            callback(self->_appRemote.playerAPI);
        }
    });
}

-(void)useContentApi:(void(^)(id<SPTAppRemoteContentAPI>))callback reject:(RCTPromiseRejectBlock)reject{
    RCTExecuteOnMainQueue(^{
        if( self->_appRemote == nil || self->_appRemote.contentAPI == nil){
            [[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.AppRemoteDisconnected] reject:reject];
        }else{
            callback(self->_appRemote.contentAPI);
        }
    });
}

#pragma mark - React Native functions

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(disconnect:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self disconnect];
    resolve(@YES);
}

RCT_EXPORT_METHOD(connect:(NSString*)accessToken resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RNSpotifyRemotePromise<NSNumber*>* completion = [RNSpotifyRemotePromise onResolve:resolve onReject:^(RNSpotifyRemoteError *error) {
        [error reject:reject];
    }];
    if(_isConnecting){
        [_appRemoteCallbacks addObject:completion];
    }else{
        if([self isConnected] == YES){
            resolve(@YES);
        }else{
            [self initializeAppRemote:accessToken completionCallback:completion];
        }
    }
}

RCT_EXPORT_METHOD(isConnectedAsync:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RCTExecuteOnMainQueue(^{
        if([self isConnected]){
            resolve(@YES);
        }else{
            resolve(@NO);
        }
    });
}

RCT_EXPORT_METHOD(playUri:(NSString*)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player play:uri callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}

RCT_EXPORT_METHOD(playItem:(NSDictionary*)item resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RNSpotifyItem* spotifyItem = [RNSpotifyItem fromJSON:item];
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player playItem:spotifyItem callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];

}

RCT_EXPORT_METHOD(playItemWithIndex:(NSDictionary*)item skipToTrackIndex:(NSInteger)skipToTrackIndex resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RNSpotifyItem* spotifyItem = [RNSpotifyItem fromJSON:item];
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player playItem:spotifyItem skipToTrackIndex:skipToTrackIndex callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}

RCT_EXPORT_METHOD(queueUri:(NSString*)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    if(![[uri lowercaseString] hasPrefix:@"spotify:track:"]){
        [[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.InvalidParameter message:@"Can only queue Spotify track uri's (i.e. spotify:track:<id> )"] reject:reject];
        return;
    }
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player enqueueTrackUri:uri callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];

}

RCT_EXPORT_METHOD(resume:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self getPlayerStateInternal:^(id<SPTAppRemotePlayerState> state) {
        if(state.isPaused){
            [self->_appRemote.playerAPI resume:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
        }else{
            resolve([NSNull null]);
        }
    } reject:reject];
}

RCT_EXPORT_METHOD(pause:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self getPlayerStateInternal:^(id<SPTAppRemotePlayerState> state) {
        if(!state.isPaused){
            [self->_appRemote.playerAPI pause:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
        }else{
            resolve([NSNull null]);
        }
    } reject:reject];
}

RCT_EXPORT_METHOD(skipToNext:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player skipToNext:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}

RCT_EXPORT_METHOD(skipToPrevious:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player skipToPrevious:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}

RCT_EXPORT_METHOD(seek:(NSInteger)position resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player seekToPosition:position callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}

RCT_EXPORT_METHOD(setShuffling:(BOOL)shuffling resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player setShuffle:shuffling callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}

RCT_EXPORT_METHOD(setRepeatMode: (NSInteger)repeatMode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player setRepeatMode:repeatMode callback:[RNSpotifyRemoteAppRemote defaultSpotifyRemoteCallback:resolve reject:reject]];
    } reject:reject];
}


RCT_EXPORT_METHOD(getPlayerState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self getPlayerStateInternal:^(id<SPTAppRemotePlayerState> state) {
        resolve([RNSpotifyRemoteConvert SPTAppRemotePlayerState:state][@"state"]);
    } reject:reject];
}

RCT_EXPORT_METHOD(getCrossfadeState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self usePlayerApi:^(id<SPTAppRemotePlayerAPI>player) {
        [player getCrossfadeState:^(id  _Nullable result, NSError * _Nullable error) {
            if(error != nil){
                [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
            }else{
                if([result conformsToProtocol:@protocol(SPTAppRemoteCrossfadeState)]){
                    resolve([RNSpotifyRemoteConvert SPTAppRemoteCrossfadeState:result]);
                }else{
                    [[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.BadResponse message:@"Couldn't parse returned crossfade state"] reject:reject];
                }
            }
        }];
    } reject:reject];
}

RCT_EXPORT_METHOD(getRootContentItems:(NSString* _Nullable)contentType resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    if(contentType == nil){
        contentType = SPTAppRemoteContentTypeDefault;
    }

    [self useContentApi:^(id<SPTAppRemoteContentAPI>contentApi) {
        [contentApi fetchRootContentItemsForType: contentType callback:^(NSArray* _Nullable result, NSError * _Nullable error){
            if(error != nil){
                [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
            }else{
                resolve([RNSpotifyRemoteConvert SPTAppRemoteContentItems:result]);
            }
        }];
    } reject:reject];
}

RCT_EXPORT_METHOD(getRecommendedContentItems:(NSDictionary* _Nullable) options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    if(options == nil){
        options = @{};
    }
    
    NSString* contentType = options[@"type"] != nil ? [RCTConvert NSString:options[@"type"]] : SPTAppRemoteContentTypeDefault;
    BOOL flatten = options[@"flatten"] != nil ? [RCTConvert BOOL:options[@"flatten"]] : TRUE;
    
    [self useContentApi:^(id<SPTAppRemoteContentAPI>contentApi) {
        [contentApi fetchRecommendedContentItemsForType:contentType flattenContainers:flatten
           callback:^(NSArray* _Nullable result, NSError * _Nullable error){
              if(error != nil){
                  [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
              }else{
                  resolve([RNSpotifyRemoteConvert SPTAppRemoteContentItems:result]);
              }
          }
        ];
    } reject:reject];
}

RCT_EXPORT_METHOD(getChildrenOfItem:(NSDictionary*)item resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    RNSpotifyItem* spotifyItem = [RNSpotifyItem fromJSON:item];
    [self useContentApi:^(id<SPTAppRemoteContentAPI>contentApi) {
        [contentApi fetchChildrenOfContentItem:spotifyItem callback:^(NSArray<SPTAppRemoteContentItem>* _Nullable result, NSError * _Nullable error){
            if(error != nil){
                [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
            }else{
                resolve([RNSpotifyRemoteConvert SPTAppRemoteContentItems:result]);
            }
        }];
    } reject:reject];
}

RCT_EXPORT_METHOD(getContentItemForUri:(NSString *)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
    [self useContentApi:^(id<SPTAppRemoteContentAPI>contentApi) {
        [contentApi fetchContentItemForURI:uri callback:^(NSObject<SPTAppRemoteContentItem>* _Nullable result, NSError * _Nullable error){
                if(error != nil){
                    [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
                }else{
                    resolve([RNSpotifyRemoteConvert SPTAppRemoteContentItem:result]);
                }
            }
        ];
    } reject:reject];
}


+(BOOL)requiresMainQueueSetup
{
   return NO;
}

-(void)handleEventSubscriptions{
    [_eventSubscriptions enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull key, NSNumber * _Nonnull value, BOOL * _Nonnull stop) {
        RNSpotifyRemoteSubscriptionCallback* callback = self->_eventSubscriptionCallbacks[key];
        BOOL shouldSubscribe = [value boolValue];
        
        // If a callback has been registered for this event then use it
        // Note: the callback structure makes sure to only subscribe/unsubscribe once
        if(callback != nil){
            if(shouldSubscribe == YES){
                [callback subscribe];
            }else if(shouldSubscribe == NO){
                [callback unSubscribe];
            }
        }
    }];
}

-(void)resetEventSubscriptions{
    [_eventSubscriptions enumerateKeysAndObjectsUsingBlock:^(NSString * _Nonnull key, NSNumber * _Nonnull value, BOOL * _Nonnull stop) {
        RNSpotifyRemoteSubscriptionCallback* callback = self->_eventSubscriptionCallbacks[key];
        [callback reset];
    }];
}

#pragma mark - RNEventConformer Implementation

RCT_EXPORT_METHOD(__registerAsJSEventEmitter:(int)moduleId)
{
    [RNEventEmitter registerEventEmitterModule:self withID:moduleId bridge:_bridge];
}

-(void)sendEvent:(NSString*)event args:(NSArray*)args
{
    [RNEventEmitter emitEvent:event withParams:args module:self bridge:_bridge];
}

-(void)onJSEvent:(NSString*)eventName params:(NSArray*)params{
    if([eventName isEqualToString:@"eventSubscribed"]){
        NSString * eventType = params[0];
        if(eventType != nil){
            [_eventSubscriptions setValue:@YES forKey:eventType];
        }
        [self handleEventSubscriptions];
    }else if([eventName isEqualToString:@"eventUnsubscribed"]){
        NSString * eventType = params[0];
        if(eventType != nil){
            [_eventSubscriptions setValue:@NO forKey:eventType];
        }
        [self handleEventSubscriptions];
    }
}

@end

