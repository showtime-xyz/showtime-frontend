//
//  RNSpotifyItem.h
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-10.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <SpotifyiOS.h>

#ifndef RNSpotifyItem_h
#define RNSpotifyItem_h


@interface RNSpotifyItem : NSObject<SPTAppRemoteContentItem>
- (id)initWithJson:(NSDictionary*) json;
+ (RNSpotifyItem*)fromJSON:(NSDictionary*) json;
@end

#endif /* RNSpotifyItem_h */
