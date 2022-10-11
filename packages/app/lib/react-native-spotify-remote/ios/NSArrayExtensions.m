//
//  NSArrayExtensions.m
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-11.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NSArrayExtensions.h"

@implementation NSArray (FP)
- (NSArray *)map:(MapBlock)block {
    NSMutableArray *resultArray = [[NSMutableArray alloc] init];
    for (id object in self) {
        [resultArray addObject:block(object)];
    }
    return resultArray;
}
@end
