//
//  Macros.h
//  RNSpotify
//
//  Created by Colter McQuay on 2018-10-06.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef Macros_h
#define Macros_h

#ifdef DEBUG
    #define DLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
    #define IsDebug 1
#else
    #define DLog(...)
    #define IsDebug 0
#endif

#endif /* Macros_h */
