
#import <Foundation/Foundation.h>
#import <SpotifyiOS.h>
#import "RNSpotifyRemoteError.h"

@interface RNSpotifyRemoteConvert : NSObject

+(id)ID:(id)obj;
+(NSString*)Date:(NSDate*)date;
+(id)RNSpotifyError:(RNSpotifyRemoteError*)error;
+(id)NSError:(NSError*)error;
+(id)SPTAppRemotePlayerState:(NSObject<SPTAppRemotePlayerState>*) state;
+(id)SPTAppRemoteCrossfadeState:(NSObject<SPTAppRemoteCrossfadeState>*) state;
+(id)SPTAppRemotePlaybackRestrictions:(NSObject<SPTAppRemotePlaybackRestrictions>*) restrictions;
+(id)SPTAppRemotePlaybackOptions:(NSObject<SPTAppRemotePlaybackOptions>*) options;
+(id)SPTAppRemoteTrack:(NSObject<SPTAppRemoteTrack> *) track;
+(id)SPTAppRemoteArtist:(NSObject<SPTAppRemoteArtist> *) artist;
+(id)SPTAppRemoteAlbum:(NSObject<SPTAppRemoteAlbum> *) album;
+(id)SPTAppRemoteContentItem:(NSObject<SPTAppRemoteContentItem> *) item;
+(id)SPTAppRemoteContentItems:(NSArray *) items;
+(id)SPTSession:(SPTSession *) session;

@end
