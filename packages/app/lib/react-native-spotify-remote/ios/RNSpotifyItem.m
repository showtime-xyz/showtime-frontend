//
//  RNSpotifyItem.m
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-10.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "./RNSpotifyItem.h"

@implementation RNSpotifyItem

@synthesize availableOffline;
@synthesize container;
@synthesize identifier;
@synthesize imageIdentifier;
@synthesize playable;
@synthesize subtitle;
@synthesize title;
@synthesize URI;
@synthesize children;

-(id)initWithJson:(NSDictionary *)json{
    if(self = [super init])
    {
        availableOffline = [NSNull null];
        container = [json[@"container"] boolValue];
        identifier = json[@"id"] != nil ? json[@"id"] : [NSNull null];
        imageIdentifier = nil;
        playable = [json[@"playable"] boolValue];
        subtitle = json[@"subtitle"] != nil ? json[@"subtitle"] : [NSNull null];
        title = json[@"title"] != nil ? json[@"title"] : [NSNull null];
        URI = json[@"uri"] != nil ? json[@"uri"] : [NSNull null];
        children = nil;
    }
    return self;
}

+(RNSpotifyItem*)fromJSON:(NSDictionary *)json{
    return [[RNSpotifyItem alloc] initWithJson:json];
}

@end
