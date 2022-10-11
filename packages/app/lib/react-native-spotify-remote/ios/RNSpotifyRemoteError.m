//
//  RNSpotifyError.m
//  RNSpotify
//
//  Created by Luis Finke on 2/15/18.
//  Copyright © 2018. All rights reserved.
//

#import "RNSpotifyRemoteError.h"
#import <SpotifyiOS.h>


@interface RNSpotifyRemoteErrorCode()
-(id)initWithName:(NSString*)name message:(NSString*)message;
+(instancetype)codeWithName:(NSString*)name message:(NSString*)message;
@end

@implementation RNSpotifyRemoteErrorCode

#define DEFINE_SPOTIFY_ERROR_CODE(errorName, messageStr) \
    static RNSpotifyRemoteErrorCode* _RNSpotifyRemoteErrorCode##errorName = nil; \
    +(RNSpotifyRemoteErrorCode*)errorName { \
        if(_RNSpotifyRemoteErrorCode##errorName == nil) { \
            _RNSpotifyRemoteErrorCode##errorName = [RNSpotifyRemoteErrorCode codeWithName:@#errorName message:messageStr]; } \
        return _RNSpotifyRemoteErrorCode##errorName; } \

DEFINE_SPOTIFY_ERROR_CODE(IsInitializing, @"Spotify connection is initializing")
DEFINE_SPOTIFY_ERROR_CODE(AlreadyInitialized, @"Spotify has already been initialized")
DEFINE_SPOTIFY_ERROR_CODE(NotInitialized, @"Spotify has not been initialized")
DEFINE_SPOTIFY_ERROR_CODE(NotImplemented, @"This feature has not been implemented")
DEFINE_SPOTIFY_ERROR_CODE(NotLoggedIn, @"You are not logged in")
DEFINE_SPOTIFY_ERROR_CODE(MissingOption, @"Missing required option")
DEFINE_SPOTIFY_ERROR_CODE(NullParameter, @"Null parameter")
DEFINE_SPOTIFY_ERROR_CODE(ConflictingCallbacks, @"You cannot call this function while it is already executing")
DEFINE_SPOTIFY_ERROR_CODE(BadResponse, @"Invalid response format")
DEFINE_SPOTIFY_ERROR_CODE(PlayerNotReady, @"Player is not ready")
DEFINE_SPOTIFY_ERROR_CODE(SessionExpired, @"Your login session has expired")
DEFINE_SPOTIFY_ERROR_CODE(InvalidParameter, @"Invalid Parameter Value")
DEFINE_SPOTIFY_ERROR_CODE(SessionClosed, @"Session has been closed")
DEFINE_SPOTIFY_ERROR_CODE(AppRemoteDisconnected, @"App Remote is not connected")
DEFINE_SPOTIFY_ERROR_CODE(UnknownResponse, @"Spotify returned an unknown response")
DEFINE_SPOTIFY_ERROR_CODE(SpotifyNotInstalled, @"Spotify does not appear to be installed. Note: You must whitelist the 'spotify' URL scheme in your info.plist.")

#undef DEFINE_SPOTIFY_ERROR_CODE


@synthesize name = _name;
@synthesize message = _message;

-(id)initWithName:(NSString*)name message:(NSString*)message
{
    if(self = [super init])
    {
        _name = [NSString stringWithString:name];
        _message = [NSString stringWithString:message];
    }
    return self;
}

+(instancetype)codeWithName:(NSString*)name message:(NSString*)message
{
    return [[self alloc] initWithName:name message:message];
}

-(NSString*)code
{
    return [NSString stringWithFormat:@"RNSR%@", _name];
}

-(NSDictionary*)reactObject
{
    return @{ @"code":self.code, @"message":self.message };
}

-(void)reject:(void(^)(NSString*,NSString*,NSError*))promiseRejector
{
    promiseRejector(self.code, self.message, nil);
}

@end



@interface RNSpotifyRemoteError()
{
    NSError* _error;
}
+(NSString*)getRemoteSDKErrorCode:(SPTAppRemoteErrorCode)enumVal;
+(NSString*)getSDKErrorCode:(SPTErrorCode)enumVal;
@end

@implementation RNSpotifyRemoteError

@synthesize code = _code;
@synthesize message = _message;

-(id)initWithCode:(NSString*)code message:(NSString*)message
{
    if(code == nil || code.length == 0)
    {
        code = @"";
    }

    if(self = [super init])
    {
        _error = nil;
        _code = [NSString stringWithString:code];
        _message = [NSString stringWithString:message];
    }
    return self;
}

-(id)initWithCode:(NSString*)code error:(NSError*)error
{
    if(code == nil || code.length == 0)
    {
        return [self initWithNSError:error];
    }
    if(self = [super init])
    {
        if(error == nil)
        {
            @throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"Cannot provide a nil error to RNSpotifyError" userInfo:nil];
        }
        _error = error;
        _code = [NSString stringWithString:code];
        _message = _error.localizedDescription;
    }
    return self;
}

-(id)initWithCodeObj:(RNSpotifyRemoteErrorCode*)code
{
    return [self initWithCodeObj:code message:code.message];
}

-(id)initWithCodeObj:(RNSpotifyRemoteErrorCode*)code message:(NSString*)message
{
    if(self = [super init])
    {
        _error = nil;
        _code = [NSString stringWithString:code.code];
        _message = [NSString stringWithString:message];
    }
    return self;
}

-(id)initWithNSError:(NSError*)error
{
    if(self = [super init])
    {
        if(error == nil)
        {
            @throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"Cannot provide a nil error to RNSpotifyError" userInfo:nil];
        }
        _error = error;
        
        
        // Get the Error code based on error domain
        if([_error.domain isEqualToString:@"com.spotify.sdk.login"])
        {
            _code = [self.class getSDKErrorCode:_error.code];
        }else if([_error.domain isEqualToString:@"com.spotify.app-remote"])
        {
            _code = [self.class getRemoteSDKErrorCode:_error.code];
        }
        else if([_error.domain isEqualToString:@"com.spotify.ios-sdk.playback"])
        {
            _code = [self.class getSDKErrorCode:_error.code];
        }
        else
        {
            _code = [NSString stringWithFormat:@"%@:%ld", _error.domain, _error.code];
        }
        
        
        // Errors will typically have nested underlyingErrors, unwrap them grabbing
        // each message along the way, concatenate them for more descriptive errors
        NSError * underlyingError = _error;
        NSMutableArray* messageParts = [NSMutableArray array];
        while(underlyingError != nil )
        {
            NSString* errMessage = [underlyingError localizedDescription];
            if(errMessage != nil){
                [messageParts addObject:errMessage];
            }
            
            NSString* errRecovery = [underlyingError localizedRecoverySuggestion];
            if(errRecovery != nil){
                [messageParts addObject:errRecovery];
            }
            
            underlyingError = underlyingError.userInfo[@"NSUnderlyingError"];
        }
        
        if([messageParts count] > 0){
            _message = [messageParts componentsJoinedByString:@"\r\n"];
        }else{
            _message = @"No error information";
        }
    }
    return self;
}

+(instancetype)errorWithCode:(NSString*)code message:(NSString*)message
{
    return [[self alloc] initWithCode:code message:message];
}

+(instancetype)errorWithCode:(NSString *)code error:(NSError *)error
{
    return [[self alloc] initWithCode:code error:error];
}

+(instancetype)errorWithCodeObj:(RNSpotifyRemoteErrorCode*)code
{
    return [[self alloc] initWithCodeObj:code];
}

+(instancetype)errorWithCodeObj:(RNSpotifyRemoteErrorCode*)code message:(NSString*)message
{
    return [[self alloc] initWithCodeObj:code message:message];
}

+(instancetype)errorWithNSError:(NSError*)error
{
    return [[self alloc] initWithNSError:error];
}

-(void)reject:(void(^)(NSString*,NSString*,NSError*))promiseRejector
{
    promiseRejector(_code, _message, _error);
}

-(NSDictionary*)reactObject
{
    return @{ @"code":_code, @"message":_message };
}

+(RNSpotifyRemoteError*)nullParameterErrorForName:(NSString*)paramName
{
    return [RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.NullParameter
                                     message:[NSString stringWithFormat:@"%@ cannot be null", paramName]];
}

+(RNSpotifyRemoteError*)missingOptionErrorForName:(NSString*)optionName
{
    return [RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.MissingOption
                                     message:[NSString stringWithFormat:@"Missing required option %@", optionName]];
}

+(RNSpotifyRemoteError*)httpErrorForStatusCode:(NSInteger)statusCode
{
    if(statusCode <= 0)
    {
        return [RNSpotifyRemoteError errorWithCode:@"HTTPRequestFailed" message:@"Unable to send request"];
    }
    return [RNSpotifyRemoteError errorWithCode:[NSString stringWithFormat:@"HTTP%ld", statusCode]
                                  message:[NSHTTPURLResponse localizedStringForStatusCode:statusCode]];
}

+(RNSpotifyRemoteError*)httpErrorForStatusCode:(NSInteger)statusCode message:(NSString*)message
{
    NSString* code = [NSString stringWithFormat:@"HTTP%ld", statusCode];
    if(statusCode <= 0)
    {
        code = @"HTTPRequestFailed";
    }
    return [RNSpotifyRemoteError errorWithCode:code message:message];
}



#define SDK_ERROR_CASE(error) case error: return @#error;

+(NSString*)getRemoteSDKErrorCode:(SPTAppRemoteErrorCode)enumVal
{
    switch(enumVal)
    {
            SDK_ERROR_CASE(SPTAppRemoteUnknownError)
            SDK_ERROR_CASE(SPTAppRemoteRequestFailedError)
            SDK_ERROR_CASE(SPTAppRemoteInvalidArgumentsError)
            SDK_ERROR_CASE(SPTAppRemoteConnectionTerminatedError)
            SDK_ERROR_CASE(SPTAppRemoteBackgroundWakeupFailedError)
            SDK_ERROR_CASE(SPTAppRemoteConnectionAttemptFailedError)
    }
            return [NSString stringWithFormat:@"SPError:%ld", (NSInteger)enumVal];
}

+(NSString*)getSDKErrorCode:(SPTErrorCode)enumVal
{
    switch(enumVal)
    {
        SDK_ERROR_CASE(SPTUnknownErrorCode)
        SDK_ERROR_CASE(SPTJSONFailedErrorCode)
        SDK_ERROR_CASE(SPTRenewSessionFailedErrorCode)
        SDK_ERROR_CASE(SPTAuthorizationFailedErrorCode)
    }
    return [NSString stringWithFormat:@"SPError:%ld", (NSInteger)enumVal];
}

@end
