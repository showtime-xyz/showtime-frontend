//
//  RNSpotifyRemotePromise.h
//  RNSpotify
//
//  Created by Luis Finke on 2/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNSpotifyRemoteError.h"

@interface RNSpotifyRemotePromise<__covariant ObjectType> : NSObject

-(id)initWithOnResolve:(void(^)(ObjectType result))resolver onReject:(void(^)(RNSpotifyRemoteError* error))rejector;
-(id)initWithOnComplete:(void(^)(ObjectType result, RNSpotifyRemoteError* error))completion;

-(void)resolve:(ObjectType)result;
-(void)reject:(RNSpotifyRemoteError*)error;

+(RNSpotifyRemotePromise*)onResolve:(void(^)(ObjectType result))onResolve onReject:(void(^)(RNSpotifyRemoteError* error))onReject;
+(RNSpotifyRemotePromise*)onReject:(void(^)(RNSpotifyRemoteError* error))onReject onResolve:(void(^)(ObjectType result))onResolve;
+(RNSpotifyRemotePromise*)onComplete:(void(^)(ObjectType result, RNSpotifyRemoteError* error))onComplete;

+ (NSArray<RNSpotifyRemotePromise*>*)popCompletionCallbacks:(NSMutableArray<RNSpotifyRemotePromise*>*)callbackArray;

+ (void)rejectCompletions:(NSMutableArray<RNSpotifyRemotePromise*>*)callbacks error:(RNSpotifyRemoteError*) error;

+ (void)resolveCompletions:(NSMutableArray<RNSpotifyRemotePromise*>*)callbacks result:(id) result;

@end
