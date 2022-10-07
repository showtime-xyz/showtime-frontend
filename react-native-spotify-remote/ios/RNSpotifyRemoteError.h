//
//  RNSpotifyError.h
//  RNSpotify
//
//  Created by Luis Finke on 2/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RNSpotifyRemoteErrorCode : NSObject

@property (readonly) NSString* name;
@property (readonly) NSString* code;
@property (readonly) NSString* message;
@property (readonly) NSDictionary* reactObject;

#define DECLARE_SPOTIFY_ERROR_CODE(errorName) \
    @property (class, readonly) RNSpotifyRemoteErrorCode* errorName;

DECLARE_SPOTIFY_ERROR_CODE(IsInitializing)
DECLARE_SPOTIFY_ERROR_CODE(AlreadyInitialized)
DECLARE_SPOTIFY_ERROR_CODE(NotInitialized)
DECLARE_SPOTIFY_ERROR_CODE(NotImplemented)
DECLARE_SPOTIFY_ERROR_CODE(NotLoggedIn)
DECLARE_SPOTIFY_ERROR_CODE(MissingOption)
DECLARE_SPOTIFY_ERROR_CODE(NullParameter)
DECLARE_SPOTIFY_ERROR_CODE(ConflictingCallbacks)
DECLARE_SPOTIFY_ERROR_CODE(BadResponse)
DECLARE_SPOTIFY_ERROR_CODE(PlayerNotReady)
DECLARE_SPOTIFY_ERROR_CODE(SessionExpired)
DECLARE_SPOTIFY_ERROR_CODE(InvalidParameter)
DECLARE_SPOTIFY_ERROR_CODE(SessionClosed)
DECLARE_SPOTIFY_ERROR_CODE(AppRemoteDisconnected)
DECLARE_SPOTIFY_ERROR_CODE(UnknownResponse)
DECLARE_SPOTIFY_ERROR_CODE(SpotifyNotInstalled)

#undef DECLARE_SPOTIFY_ERROR_CODE

-(void)reject:(void(^)(NSString*,NSString*,NSError*))promiseRejector;

@end



@interface RNSpotifyRemoteError : NSObject

-(id)initWithCode:(NSString*)code message:(NSString*)message;
-(id)initWithCode:(NSString*)code error:(NSError*)error;
-(id)initWithCodeObj:(RNSpotifyRemoteErrorCode*)code;
-(id)initWithCodeObj:(RNSpotifyRemoteErrorCode*)code message:(NSString*)message;
-(id)initWithNSError:(NSError*)error;

+(instancetype)errorWithCode:(NSString*)code message:(NSString*)message;
+(instancetype)errorWithCode:(NSString*)code error:(NSError*)error;
+(instancetype)errorWithCodeObj:(RNSpotifyRemoteErrorCode*)code;
+(instancetype)errorWithCodeObj:(RNSpotifyRemoteErrorCode*)code message:(NSString*)message;
+(instancetype)errorWithNSError:(NSError*)error;

-(void)reject:(void(^)(NSString*,NSString*,NSError*))promiseRejector;

@property (readonly) NSString* code;
@property (readonly) NSString* message;
@property (readonly) NSDictionary* reactObject;

+(RNSpotifyRemoteError*)nullParameterErrorForName:(NSString*)paramName;
+(RNSpotifyRemoteError*)missingOptionErrorForName:(NSString*)optionName;
+(RNSpotifyRemoteError*)httpErrorForStatusCode:(NSInteger)statusCode;
+(RNSpotifyRemoteError*)httpErrorForStatusCode:(NSInteger)statusCode message:(NSString*)message;

@end
