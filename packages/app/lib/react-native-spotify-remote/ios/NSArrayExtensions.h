//
//  NSArrayExtensions.h
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-11.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef NSArrayExtensions_h
#define NSArrayExtensions_h

typedef id(^MapBlock)(id);
@interface NSArray (FP)
- (NSArray *)map:(MapBlock)block;
@end

#endif /* NSArrayExtensions_h */
