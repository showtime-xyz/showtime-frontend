#import <UIKit/UIKit.h>
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#if __has_include("RNEventEmitter.h")
#import "RNEventEmitter.h"
#else
#import <RNEventEmitter/RNEventEmitter.h>
#endif

@interface RNSpotifyRemoteAppRemote : NSObject <RCTBridgeModule, RNEventConformer>

//// isInitialized
//-(id)isInitialized;

+(instancetype)sharedInstance;

-(void)isConnectedAsync:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

-(void)disconnect;
-(void)disconnect:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)connect:(NSString*)accessToken resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

// Playback API
-(void)playUri:(NSString*)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)playItem:(NSDictionary*)item resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)playItemWithIndex:(NSDictionary*)item skipToTrackIndex:(NSInteger)skipToTrackIndex resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)queueUri: (NSString*)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)resume:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)pause:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)skipToNext:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)skipToPrevious:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)seek: (NSInteger)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

-(void)setShuffling: (BOOL)shuffling resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)setRepeatMode: (NSInteger)repeatMode resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

-(void)getPlayerState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getCrossfadeState:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;

// Content API
-(void)getRootContentItems:(NSString*)type resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getRecommendedContentItems:(NSDictionary*)options resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getChildrenOfItem:(NSDictionary*)item resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;
-(void)getContentItemForUri:(NSString *)uri resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject;



@end
