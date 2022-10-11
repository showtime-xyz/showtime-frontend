//
//  RNSpotifyRemotePromise.m
//  RNSpotify
//
//  Created by Luis Finke on 2/15/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNSpotifyRemotePromise.h"

@interface RNSpotifyRemotePromise()
{
    BOOL _responded;
    void(^_resolver)(id);
    void(^_rejector)(RNSpotifyRemoteError*);
    void(^_completion)(id, RNSpotifyRemoteError*);
}
@end

@implementation RNSpotifyRemotePromise

-(id)initWithOnResolve:(void(^)(id))resolver onReject:(void(^)(RNSpotifyRemoteError*))rejector
{
    if(self = [super init])
    {
        _responded = NO;
        _resolver = resolver;
        _rejector = rejector;
        _completion = nil;
    }
    return self;
}

-(id)initWithOnComplete:(void(^)(id,RNSpotifyRemoteError*))completion
{
    if(self = [super init])
    {
        _responded = NO;
        _resolver = nil;
        _rejector = nil;
        _completion = completion;
    }
    return self;
}

-(void)resolve:(id)result
{
    if(_responded)
    {
        @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"cannot call resolve or reject multiple times on a Completion object" userInfo:nil];
    }
    _responded = YES;
    if(_resolver != nil)
    {
        _resolver(result);
    }
    if(_completion != nil)
    {
        _completion(result, nil);
    }
}

-(void)reject:(RNSpotifyRemoteError*)error
{
    if(_responded)
    {
        @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"cannot call resolve or reject multiple times on a Completion object" userInfo:nil];
    }
    _responded = YES;
    if(_rejector != nil)
    {
        _rejector(error);
    }
    if(_completion != nil)
    {
        _completion(nil, error);
    }
}

+(RNSpotifyRemotePromise*)onResolve:(void(^)(id))onResolve onReject:(void(^)(RNSpotifyRemoteError*))onReject
{
    return [[self alloc] initWithOnResolve:onResolve onReject:onReject];
}

+(RNSpotifyRemotePromise*)onReject:(void(^)(RNSpotifyRemoteError*))onReject onResolve:(void(^)(id))onResolve
{
    return [[self alloc] initWithOnResolve:onResolve onReject:onReject];
}

+(RNSpotifyRemotePromise*)onComplete:(void(^)(id,RNSpotifyRemoteError*))onComplete
{
    return [[self alloc] initWithOnComplete:onComplete];
}

+ (NSArray<RNSpotifyRemotePromise*>*)popCompletionCallbacks:(NSMutableArray<RNSpotifyRemotePromise*>*)callbackArray{
    NSArray<RNSpotifyRemotePromise*>* callbacks = [NSArray arrayWithArray:callbackArray];
    [callbackArray removeAllObjects];
    return callbacks;
}

+ (void)rejectCompletions:(NSMutableArray<RNSpotifyRemotePromise*>*)callbacks error:(RNSpotifyRemoteError*) error{
    NSArray<RNSpotifyRemotePromise*>* completions = [RNSpotifyRemotePromise popCompletionCallbacks:callbacks];
    for(RNSpotifyRemotePromise* completion in completions)
    {
        [completion reject:error];
    }
}

+ (void)resolveCompletions:(NSMutableArray<RNSpotifyRemotePromise*>*)callbacks result:(id) result{
    NSArray<RNSpotifyRemotePromise*>* completions = [RNSpotifyRemotePromise popCompletionCallbacks:callbacks];
    for(RNSpotifyRemotePromise* completion in completions)
    {
        [completion resolve:result];
    }
}

@end
