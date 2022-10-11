
#import "RNSpotifyRemoteAuth.h"
#import <AVFoundation/AVFoundation.h>
#import <React/RCTConvert.h>
#import <SpotifyiOS.h>
#import "RNSpotifyRemoteConvert.h"
#import "RNSpotifyItem.h"
#import "RNSpotifyRemoteError.h"
#import "RNSpotifyRemotePromise.h"
#import "RNSpotifyRemoteSubscriptionCallback.h"
#import "Macros.h"
#define SPOTIFY_API_BASE_URL @"https://api.spotify.com/"
#define SPOTIFY_API_URL(endpoint) [NSURL URLWithString:NSString_concat(SPOTIFY_API_BASE_URL, endpoint)]

// Static Singleton instance
static RNSpotifyRemoteAuth *sharedInstance = nil;

@interface RNSpotifyRemoteAuth() <SPTSessionManagerDelegate>
{
    BOOL _initialized;
    BOOL _isInitializing;
    NSDictionary* _options;
    
    NSMutableArray<RNSpotifyRemotePromise*>* _sessionManagerCallbacks;
    
    SPTConfiguration* _apiConfiguration;
    SPTSessionManager* _sessionManager;
}
- (void)initializeSessionManager:(NSDictionary*)options completionCallback:(RNSpotifyRemotePromise*)completion;
@end

@implementation RNSpotifyRemoteAuth

-(NSString*) accessToken{
    return _sessionManager.session.accessToken;
}

-(SPTConfiguration*) configuration{
    return _apiConfiguration;
}

#pragma mark Singleton Methods

+ (instancetype)sharedInstance {
    // Hopefully ReactNative can take care of allocating and initializing our instance
    // otherwise we'll need to check here
    return sharedInstance;
}

-(id)init
{
    // This is to hopefully maintain the singleton pattern within our React App.
    // Since ReactNative is the one allocating and initializing our instance,
    // we need to store the instance within the sharedInstance otherwise we'll
    // end up with a different one when calling shared instance statically
    if(sharedInstance == nil){
        if(self = [super init])
        {
            _initialized = NO;
            _isInitializing = NO;
            _sessionManagerCallbacks = [NSMutableArray array];
            _apiConfiguration = nil;
            _sessionManager = nil;
        }
        static dispatch_once_t once;
        dispatch_once(&once, ^{
            sharedInstance = self;
        });
    }
    // Returning Shared Instance
    return sharedInstance;
}

-(BOOL)isSpotifyInstalled{
    return _sessionManager != nil && _sessionManager.spotifyAppInstalled;
}

#pragma mark URL handling

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)URL options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    // Not sure what we do if session manager is nil, perhaps store the parameters for when
    // we initialize?
    BOOL returnVal = NO;
    if(_sessionManager != nil){
        DLog(@"Setting application openURL and options on session manager");
        NSURLComponents *urlComponents = [NSURLComponents componentsWithURL:URL resolvingAgainstBaseURL:TRUE];
        NSURLQueryItem * errorDescription = [[[urlComponents queryItems] filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"name == %@", SPTAppRemoteErrorDescriptionKey]] firstObject];
        NSURLQueryItem * errorType = [[[urlComponents queryItems] filteredArrayUsingPredicate:[NSPredicate predicateWithFormat:@"name == %@",@"error"]] firstObject];
        
        // If there was an error we should reject our pending Promise
        if(errorDescription){
            [RNSpotifyRemotePromise rejectCompletions:_sessionManagerCallbacks error:[RNSpotifyRemoteError errorWithCode:errorType.value message:errorDescription.value]];
            returnVal = NO;
        }
        returnVal = [_sessionManager application:application openURL:URL options:options];
    }
    if(returnVal){
//        [self resolveCompletions:_sessionManagerCallbacks result:nil];
    }
    return returnVal;
}


#pragma mark - SPTSessionManagerDelegate

- (void)sessionManager:(SPTSessionManager *)manager didInitiateSession:(SPTSession *)session
{
    [RNSpotifyRemotePromise resolveCompletions:_sessionManagerCallbacks result:session];
    DLog(@"Session Initiated");
}

- (void)sessionManager:(SPTSessionManager *)manager didFailWithError:(NSError *)error
{
    [RNSpotifyRemotePromise rejectCompletions:_sessionManagerCallbacks error:[RNSpotifyRemoteError errorWithNSError:error]];
    DLog(@"Session Manager Failed");
}

- (void)sessionManager:(SPTSessionManager *)manager didRenewSession:(SPTSession *)session
{
    [RNSpotifyRemotePromise resolveCompletions:_sessionManagerCallbacks result:session];
    DLog(@"Session Renewed");
}

#pragma mark - React Native functions

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(endSession:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    // If the session is closed while initializing, then reject all of the pending call backs / promises
    if(_isInitializing){
        [RNSpotifyRemotePromise rejectCompletions:_sessionManagerCallbacks error:[RNSpotifyRemoteError errorWithCodeObj:RNSpotifyRemoteErrorCode.SessionClosed]];
    }
    _isInitializing = NO;
    _initialized = NO;
    [_sessionManagerCallbacks removeAllObjects];
    _sessionManager = nil;
    resolve([NSNull null]);
};

RCT_EXPORT_METHOD(getSession:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    // If we're initializing, then add a completion callback to the list of callbacks
    if(_isInitializing){
        [_sessionManagerCallbacks addObject:[RNSpotifyRemotePromise onResolve:^(SPTSession* session) {
            resolve([RNSpotifyRemoteConvert SPTSession:session]);
        } onReject:^(RNSpotifyRemoteError *error) {
            [error reject:reject];
        }]];
    }
    
    @try{
        if(_initialized && _sessionManager != nil){
            resolve([RNSpotifyRemoteConvert SPTSession:_sessionManager.session]);
        }else{
            resolve([NSNull null]);
        }
    }
    @catch( NSError * error ){
        [[RNSpotifyRemoteError errorWithNSError:error] reject:reject];
    }
};


RCT_EXPORT_METHOD(authorize:(NSDictionary*)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
    // Wrap our promise callbacks in a completion
    RNSpotifyRemotePromise<NSString*>* completion = [RNSpotifyRemotePromise<NSString*> onResolve:^(NSString *result) {
        resolve(result);
    } onReject:^(RNSpotifyRemoteError *error) {
        [error reject:reject];
    }];
    
    if(_isInitializing){
        [_sessionManagerCallbacks addObject:completion];
        return;
    }
    
    if(_initialized && [_sessionManager session]!= nil && [_sessionManager session].isExpired == NO)
    {
        [completion resolve:[RNSpotifyRemoteConvert SPTSession:_sessionManager.session]];
        return;
    }
    _isInitializing = YES;

    // ensure options is not null or missing fields
    if(options == nil)
    {
        [completion reject: [RNSpotifyRemoteError nullParameterErrorForName:@"options"]];
        return;
    }
    else if(options[@"clientID"] == nil)
    {
        [completion reject: [RNSpotifyRemoteError nullParameterErrorForName:@"clientID"]];
        return;
    }else if(options[@"redirectURL"] == nil)
    {
         [completion reject: [RNSpotifyRemoteError nullParameterErrorForName:@"redirectURL"]];
        return;
    }

    // store the options
    _options = options;
    [self initializeSessionManager:options completionCallback:
     [
      RNSpotifyRemotePromise
      onResolve:^(SPTSession* session) {
          self->_isInitializing = NO;
          self->_initialized = YES;
          [completion resolve:[RNSpotifyRemoteConvert SPTSession:session]];
      }
      onReject:^(RNSpotifyRemoteError *error) {
          self->_isInitializing=NO;
          [completion reject:error];
      }
    ]
   ];
}

- (void)initializeSessionManager:(NSDictionary*)options completionCallback:(RNSpotifyRemotePromise*)completion{
    // Create our configuration object
    _apiConfiguration = [SPTConfiguration configurationWithClientID:options[@"clientID"] redirectURL:[NSURL URLWithString:options[@"redirectURL"]]];
    // Add swap and refresh urls to config if present
    if(options[@"tokenSwapURL"] != nil){
        _apiConfiguration.tokenSwapURL = [NSURL URLWithString: options[@"tokenSwapURL"]];
    }
    
    if(options[@"tokenRefreshURL"] != nil){
        _apiConfiguration.tokenRefreshURL = [NSURL URLWithString: options[@"tokenRefreshURL"]];
    }
    
    if(options[@"playURI"] != nil){
        _apiConfiguration.playURI = options[@"playURI"];
    }
    
    // Default Scope
    SPTScope scope = SPTAppRemoteControlScope | SPTUserReadPrivateScope;
    if(options[@"scopes"] != nil){
        scope = [RCTConvert NSUInteger:options[@"scopes"]];
    }
    
    // Allocate our _sessionManager using our configuration
    _sessionManager = [SPTSessionManager sessionManagerWithConfiguration:_apiConfiguration delegate:self];
    
    // Add our completion callback
    [_sessionManagerCallbacks addObject:completion];

    // For debugging..
    if(options[@"showDialog"] != nil){
        _sessionManager.alwaysShowAuthorizationDialog = [options[@"showDialog"] boolValue];
    }
    
    // Initialize the auth flow
    if (@available(iOS 11, *)) {
        RCTExecuteOnMainQueue(^{
            // Use this on iOS 11 and above to take advantage of SFAuthenticationSession
            [ self->_sessionManager
                 initiateSessionWithScope:scope
                 options:SPTDefaultAuthorizationOption
            ];
        });
    } else {
        RCTExecuteOnMainQueue(^{
            // Use this on iOS versions < 11 to use SFSafariViewController
            [ self->_sessionManager
                initiateSessionWithScope:scope
                options:SPTDefaultAuthorizationOption
                presentingViewController:[UIApplication sharedApplication].keyWindow.rootViewController
            ];
        });
    }
}

+ (BOOL)requiresMainQueueSetup{
    return NO;
}

@end

