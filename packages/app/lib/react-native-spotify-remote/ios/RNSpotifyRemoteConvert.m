
#import <React/RCTConvert.h>
#import "RNSpotifyRemoteConvert.h"
#import "NSArrayExtensions.h"


@interface RNSpotifyRemoteConvert()
+(NSDateFormatter *) ISO_DATE_FORMATTER;
@end



@implementation RNSpotifyRemoteConvert

+(id)ID:(id)obj
{
    if(obj == nil)
    {
        return [NSNull null];
    }
    return obj;
}


static NSDateFormatter* _ISO_DATE_FORMATTER;
+(NSDateFormatter*) ISO_DATE_FORMATTER{
    if(_ISO_DATE_FORMATTER == nil){
        NSDateFormatter * dateFormatter = [[NSDateFormatter alloc] init];
        // setLocale importance https://developer.apple.com/library/archive/qa/qa1480/_index.html
        [dateFormatter setLocale:[NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"]];
        [dateFormatter setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
        [dateFormatter setCalendar:[NSCalendar calendarWithIdentifier:NSCalendarIdentifierGregorian]];
        _ISO_DATE_FORMATTER = dateFormatter;
    }

    return _ISO_DATE_FORMATTER;
}

+(NSString*)Date:(NSDate *) date{
    return [[self ISO_DATE_FORMATTER] stringFromDate:date];
}

+(id)RNSpotifyError:(RNSpotifyRemoteError*)error
{
    if(error==nil)
    {
        return [NSNull null];
    }
    return error.reactObject;
}

+(id)NSError:(NSError*)error
{
    if(error==nil)
    {
        return [NSNull null];
    }
    return [self RNSpotifyError:[RNSpotifyRemoteError errorWithNSError:error]];
}

+(id)SPTAppRemoteCrossfadeState:(NSObject<SPTAppRemoteCrossfadeState> *)state{
    if(state == nil)
    {
        return [NSNull null];
    }
    return @{
        @"duration": [NSNumber numberWithInteger:state.duration],
        @"enabled": [NSNumber numberWithBool:state.enabled],
    };
}

+(id)SPTAppRemotePlayerState:(NSObject<SPTAppRemotePlayerState>*) state{
    if(state == nil)
    {
        return [NSNull null];
    }
    return @{
        @"state": @{
            @"track": [RNSpotifyRemoteConvert SPTAppRemoteTrack:state.track],
            @"playbackPosition": [NSNumber numberWithInteger:state.playbackPosition],
            @"playbackSpeed": [NSNumber numberWithFloat:state.playbackSpeed],
            @"isPaused": [NSNumber numberWithBool:state.isPaused],
            @"playbackRestrictions": [RNSpotifyRemoteConvert SPTAppRemotePlaybackRestrictions:state.playbackRestrictions],
            @"playbackOptions": [RNSpotifyRemoteConvert SPTAppRemotePlaybackOptions:state.playbackOptions]
        },
        @"context": @{
            @"title": state.contextTitle ? state.contextTitle : @"",
            @"uri": state.contextURI
        }
    };
}

+(id)SPTAppRemotePlaybackRestrictions:(NSObject<SPTAppRemotePlaybackRestrictions>*) restrictions{
    if(restrictions == nil){
        return [NSNull null];
    }
    
    return @{
         @"canSkipNext": [NSNumber numberWithBool:restrictions.canSkipNext],
         @"canSkipPrevious": [NSNumber numberWithBool:restrictions.canSkipPrevious],
         @"canRepeatTrack": [NSNumber numberWithBool:restrictions.canRepeatTrack],
         @"canRepeatContext": [NSNumber numberWithBool:restrictions.canRepeatContext],
         @"canToggleShuffle": [NSNumber numberWithBool:restrictions.canToggleShuffle],
         @"canSeek":[NSNumber numberWithBool:restrictions.canSeek]
     };
}

+(id)SPTAppRemotePlaybackOptions:(NSObject<SPTAppRemotePlaybackOptions>*) options{
    if(options == nil){
        return [NSNull null];
    }
    return @{
      @"isShuffling": [NSNumber numberWithBool:options.isShuffling],
      @"repeatMode": [NSNumber numberWithUnsignedInteger:options.repeatMode],
    };
}


+(id)SPTAppRemoteTrack:(NSObject<SPTAppRemoteTrack>*) track{
    if(track == nil){
        return [NSNull null];
    }
    return @{
             @"name": track.name,
             @"uri":track.URI,
             @"duration":[NSNumber numberWithUnsignedInteger:track.duration],
             @"artist":[RNSpotifyRemoteConvert SPTAppRemoteArtist:track.artist],
             @"album":[RNSpotifyRemoteConvert SPTAppRemoteAlbum:track.album],
             @"saved":[NSNumber numberWithBool:track.saved],
             @"episode":[NSNumber numberWithBool:track.episode],
             @"podcast":[NSNumber numberWithBool:track.podcast],
    };
}

+(id)SPTAppRemoteArtist:(NSObject<SPTAppRemoteArtist>*) artist{
    if(artist == nil){
        return [NSNull null];
    }
    NSString *artistName = @"";
    if (artist.name != nil) {
        artistName = artist.name;
    }
    NSString *artistUri = @"";
    if (artist.URI != nil) {
        artistUri = artist.URI;
    }
    
    return @{
        @"name":artist.name == nil ? @"" : artist.name,
        @"uri":artist.URI == nil ? @"" : artist.URI
    };
}

+(id)SPTAppRemoteAlbum:(NSObject<SPTAppRemoteAlbum>*) album{
    if(album == nil){
        return [NSNull null];
    }
    NSString *albumName = @"";
    if (album.name != nil) {
        albumName = album.name;
    }
    NSString *albumUri = @"";
    if (album.URI != nil) {
        albumUri = album.URI;
    }

    return @{
        @"name":album.name == nil ? @"" : album.name,
        @"uri":album.URI == nil ? @"" : album.URI
    };
}


+(id)SPTAppRemoteContentItem:(NSObject<SPTAppRemoteContentItem> *) item{
    if(item == nil){
        return [NSNull null];
    }
    
    return @{
             @"title":item.title,
             @"subtitle":item.subtitle,
             @"id":item.identifier,
             @"uri":item.URI,
             @"availableOffline":[NSNumber numberWithBool:item.availableOffline],
             @"playable":[NSNumber numberWithBool:item.playable],
             @"container":[NSNumber numberWithBool:item.container],
             @"children":[RNSpotifyRemoteConvert SPTAppRemoteContentItems:item.children]
    };
}

+(id)SPTAppRemoteContentItems:(NSArray *) items{
    if(items == nil){
        return @[];
    }
    NSPredicate* conformsPredicate =[NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
        return [evaluatedObject conformsToProtocol:@protocol(SPTAppRemoteContentItem)];
    }];
    NSArray* json = [
        [items filteredArrayUsingPredicate: conformsPredicate]
         map:^id(id object) {
             return [RNSpotifyRemoteConvert SPTAppRemoteContentItem:object];
         }
    ];
    return json;
}

+(id)SPTSession:(SPTSession *)session{
    if(session == nil || session.accessToken == nil || session.refreshToken == nil){
        return [NSNull null];
    }
    
    return @{
        @"accessToken":session.accessToken,
        @"refreshToken":session.refreshToken,
        @"scope":[NSNumber numberWithUnsignedInteger: session.scope],
        @"expired":[NSNumber numberWithBool: session.expired],
        @"expirationDate":[self Date:session.expirationDate]
    };
}


@end
